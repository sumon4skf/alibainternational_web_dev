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

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $invoices = json_decode(request('invoices'), true);
        $related = json_decode(request('related'), true);
        $status = false;
        if (!empty($related)) {
            $user_id = $related['user_id'];
            $isNotify = $related['isNotify'];
            $courier_bill = $related['courier_bill'];
            $payment_method = $related['payment_method'];
            $delivery_method = $related['delivery_method'];
            $user = User::with('shipping')->find($user_id);
            $shipping = $user ? $user->shipping : [];
            $invoice = Invoice::create([
                // 'transaction_id' => uniqid('SSL'),
                'customer_name' => $user->full_name,
                'customer_phone' => $user->phone,
                'customer_address' => json_encode($shipping),
                'total_courier' => $courier_bill,
                'payment_method' => $payment_method,
                'delivery_method' => $delivery_method,
                'status' => 'Pending',
                'user_id' => $user_id,
            ]);
            $invoice->update([
                'invoice_no' => 'INV' . generate_order_number($invoice->id, 4),
            ]);
            $item_ids = [];
            $total_invoices = is_array($invoices) ? count($invoices) : 0;
            $courier_bill = calculateOneItemCourierBill($courier_bill, $total_invoices);

            if (!empty($invoices)) {
                foreach ($invoices as $item) {
                    $item_id = $item['id'] ?? null;
                    array_push($item_ids, $item_id);
                    $orderItem = OrderItem::with('order')->find($item_id);
                    if ($orderItem->status == 'received-in-BD-warehouse') {
                        $invoice_status = 'on-transit-to-customer';
                    } else {
                        $invoice_status = $item['status'];
                    }
                    $due = calculateItemDue($orderItem);
                    $totalDue = $due + $courier_bill;
                    $first_payment = $orderItem->first_payment;
                    $items_payable = $orderItem->first_payment + $totalDue;
                    InvoiceItem::create([
                        'invoice_id' => $invoice->id,
                        'order_id' => $orderItem->order_id,
                        'item_id' => $item_id,
                        'product_id' => $item['product_id'],
                        'product_name' => $item['product_name'],
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
                    if ($isNotify) {
                        generate_customer_notifications('on-transit-to-customer', $user, $orderItem->order_item_number, $totalDue, "");
                    }
                }
            }
            $orderItem = null;
            foreach ($item_ids as $item_id) {
                $orderItem = OrderItem::find($item_id);
                if ($orderItem) {
                    if ($orderItem->status == 'received-in-BD-warehouse') {
                        $order_item_status = 'on-transit-to-customer';
                    } else {
                        $order_item_status = $orderItem->status;
                    }
                    $orderItem->update([
                        'courier_bill' => $courier_bill,
                        'invoice_no' => $invoice->invoice_no,
                        'status' => $order_item_status
                    ]);
                }
            }

            $status = $orderItem ? true : false;
        }

        return response()->json(['status' => $status]);
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
