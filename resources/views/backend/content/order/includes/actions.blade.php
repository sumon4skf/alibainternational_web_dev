@if($status == "Waiting for Payment")
<a href="{{ route('admin.order.makeAsPayment', $order) }}" class="btn btn-sm btn-secondary toggle_make_top"
    data-toggle="tooltip" data-placement="top" title="Make Partial">
    Make Partial
</a>
@endif
<a href="{{ route('admin.order.show', $order) }}" class="btn btn-sm btn-info" data-toggle="tooltip" data-placement="top"
    title="Details">
    <i class="fa fa-file-o"></i>
</a>
@if ($order->id !== 1 & $logged_in_user->isAdmin())
<a href="{{ route('admin.order.destroy', $order) }}" data-method="delete"
    data-trans-button-cancel="@lang('buttons.general.cancel')"
    data-trans-button-confirm="@lang('buttons.general.crud.delete')" data-trans-title="Are You Sure ?"
    class="btn btn-sm btn-danger" data-toggle="tooltip" data-placement="top"
    title="@lang('buttons.general.crud.delete')">
    <i class="fa fa-trash-o"></i>
</a>
@endif
