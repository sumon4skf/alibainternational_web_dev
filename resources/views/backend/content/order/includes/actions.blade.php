<div class="btn-group">
  <button type="button" class="btn btn-sm btn-secondary dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
    <i class="fa fa-cog"></i>
  </button>
  <div class="dropdown-menu dropdown-menu-right">
    @if($status == "Waiting for Payment")
    <button class="dropdown-item" type="button">Action</button>
    <a href="{{ route('admin.order.makeAsPayment', $order) }}" class="dropdown-item toggle_make_top"
      data-toggle="tooltip" data-placement="top" title="Make Partial">
      Make Partial
    </a>
    @endif
    <a href="{{ route('admin.order.show', $order) }}" class="dropdown-item" data-toggle="tooltip" data-placement="top"
      title="Details">
      View Details
    </a>

    @if ($logged_in_user->can('order.destroy'))
    <a href="{{ route('admin.order.destroy', $order) }}" data-method="delete"
      data-trans-button-cancel="@lang('buttons.general.cancel')"
      data-trans-button-confirm="@lang('buttons.general.crud.delete')" data-trans-title="Are You Sure ?"
      class="dropdown-item" data-toggle="tooltip" data-placement="top" title="@lang('buttons.general.crud.delete')">
      <span class="text-danger">Delete Order</span>
    </a>
    @endif
  </div>
</div>