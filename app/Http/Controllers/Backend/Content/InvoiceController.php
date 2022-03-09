<?php

namespace App\Http\Controllers\Backend\Content;

use App\Http\Controllers\Controller;
use App\Models\Auth\User;
use App\Models\Content\Invoice;
use App\Models\Content\InvoiceItem;
use App\Models\Content\OrderItem;
use Illuminate\Contracts\View\Factory;
use Illuminate\Http\Request;
use Illuminate\View\View;

class InvoiceController extends Controller
{
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index()
  {
    return view('backend.content.invoice.index');
  }


  public function generatePrepare()
  {
    $items = request('items', []);

    $orderItems = OrderItem::whereIn('id', $items)->get();
    $array = ["received-in-BD-warehouse", "out-of-stock", "adjustment", "refunded"];
    $status = true;
    $msg = 'Invoice Generate on process';
    $user_id = $orderItems->count() ? $orderItems->first()->user_id : null;
    foreach ($orderItems as $item) {
      if (!in_array($item->status, $array)) {
        $status = false;
        $msg = 'Selected Items not ready for Invoice Generate';
        break;
      }
      if ($user_id != $item->user_id) {
        $status = false;
        $msg = 'Selected Items is not the similar customer';
        break;
      }
    }

    return response(['items' => $orderItems, 'status' => $status, 'msg' => $msg]);
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param \Illuminate\Http\Request $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
    $courier_bill = request('courier_bill');
    $payment_method = request('payment_method');
    $delivery_method = request('delivery_method');
    $user_id = request('user_id');
    $items = request('items', []);
    $additional = request('additional', []);
    $user = User::find($user_id);
    $totalItems = is_array($items) ? count($items) : 0;
    $response = [
      'status' => false,
      'invoice_no' => null,
      'msg' => 'Invoice generated failed',
    ];
    if ($totalItems) {
      $shipping = $user ? $user->shipping : [];
      $invoice = Invoice::create([
        'customer_name' => $user->name,
        'customer_phone' => $user->phone,
        'customer_address' => json_encode($shipping),
        'total_courier' => $courier_bill,
        'payment_method' => $payment_method,
        'delivery_method' => $delivery_method,
        'additional' => json_encode($additional),
        'status' => 'Pending',
        'user_id' => $user_id,
      ]);
      $invoice->update([
        'invoice_no' => 'INV' . generate_order_number($invoice->id, 4),
      ]);

      $courier_bill = calculateOneItemCourierBill($courier_bill, $totalItems);

      $orderItems = OrderItem::whereIn('id', $items)->get();
      $subTotalDue = 0;
      foreach ($orderItems as $orderItem) {
        $item_id = $orderItem->id;
        if ($orderItem->status == 'received-in-BD-warehouse') {
          $invoice_status = 'on-transit-to-customer';
        } else {
          $invoice_status = $orderItem->status;
        }
        $due = calculateItemDue($orderItem);
        $totalDue = $due + $courier_bill;
        $first_payment = $orderItem->first_payment;
        $items_payable = $orderItem->first_payment + $totalDue;
        $subTotalDue += $items_payable;
        InvoiceItem::create([
          'invoice_id' => $invoice->id,
          'order_id' => $orderItem->order_id,
          'item_id' => $item_id,
          'product_id' => $orderItem->product_id,
          'product_name' => $orderItem->product_name,
          'items_total' => $orderItem->product_value,
          'china_shipping' => $orderItem->chinaLocalDelivery,
          'weight' => $orderItem->actual_weight,
          'shipping_rate' => $orderItem->shipping_rate,
          'courier_bill' => $courier_bill,
          'items_payable' => $items_payable,
          'deposit' => $first_payment,
          'due_payment' => $totalDue,
          'second_payment' => null,
          'status' => $invoice_status,
          'user_id' => $user_id,
        ]);

        $orderItem->update([
          'courier_bill' => $courier_bill,
          'invoice_no' => $invoice->invoice_no,
          'status' => $invoice_status
        ]);
      }

      if (request('notify')) {
        generate_customer_notifications('on-transit-to-customer', $user, $invoice->invoice_no, $subTotalDue, "");
      }
      $response = [
        'status' => true,
        'invoice_no' => $invoice->invoice_no,
        'redirect' => url('admin/invoice'),
        'msg' => 'Invoice generated successfully',
      ];
    }

    return response($response);
  }

  /**
   * Display the specified resource.
   *
   * @param Invoice $invoice
   * @return Factory|View
   */
  public function show(Invoice $invoice)
  {
    return view('backend.content.invoice.show', compact('invoice'));
  }

  /**
   * Display the specified resource.
   *
   * @param Invoice $invoice
   * @return Factory|View
   */
  public function details($id)
  {
    $invoice = Invoice::with(['invoiceItems' => function ($query) {
      $query->with('order');
    }])->find($id);

    return view('backend.content.invoice.details', compact('invoice'));
  }

  /**
   * Show the form for editing the specified resource.
   *
   * @param Invoice $invoice
   * @return \Illuminate\Http\Response
   */
  public function edit(Invoice $invoice)
  {
    //
  }

  /**
   * Update the specified resource in storage.
   *
   * @param \Illuminate\Http\Request $request
   * @param Invoice $invoice
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, Invoice $invoice)
  {
    //
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param Invoice $invoice
   * @return \Illuminate\Http\Response
   */
  public function destroy($id)
  {
    $invoice = Invoice::withTrashed()->find($id);
    if ($invoice->trashed()) {
      $invoice->forceDelete();
      return \response([
        'status' => true,
        'icon' => 'success',
        'msg' => 'Invoice permanently deleted',
      ]);
    } else if ($invoice->delete()) {
      return \response([
        'status' => true,
        'icon' => 'success',
        'msg' => 'Invoice moved to trashed successfully',
      ]);
    }

    return \response([
      'status' => false,
      'icon' => 'error',
      'msg' => 'Delete failed',
    ]);
  }

  public function trashed()
  {
    $invoices = Invoice::onlyTrashed()->orderByDesc('created_at')->paginate(10);
    return view('backend.content.invoice.trash', compact('invoices'));
  }

  public function restore($id)
  {
    Invoice::onlyTrashed()->findOrFail($id)->restore();
    return redirect()->route('admin.invoice.index')->withFlashSuccess('Invoice Recovered Successfully');
  }


  public function confirm_received($id)
  {
    $invoice = Invoice::with('invoiceItems')->find($id);
    if (!$invoice) {
      return redirect()->back()->withFlashError('Invoice status not changed');
    }
    foreach ($invoice->invoiceItems as $invoice_item) {
      $item_id = $invoice_item->item_id;
      $OrderItem = OrderItem::find($item_id);

      if ($OrderItem->status == 'on-transit-to-customer') {
        $OrderItem->update([
          'invoice_no' => $invoice->invoice_no,
          'last_payment' => $invoice_item->due_payment,
          'due_payment' => 0,
          'status' => 'delivered',
        ]);
      } else {
        $OrderItem->update([
          'invoice_no' => $invoice->invoice_no,
          'last_payment' => $invoice_item->due_payment,
          'due_payment' => 0,
          'status' => 'adjusted',
        ]);
      }
      $invoice_item->update([
        'second_payment' => $invoice_item->due_payment,
        'due_payment' => 0
      ]);
    }
    $invoice->status = 'confirm_received';
    $invoice->save();

    return redirect()->back()->withFlashSuccess('Invoice Confirm Received Successfully');
  }
}
