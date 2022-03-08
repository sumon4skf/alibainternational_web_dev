<?php $block = '<ol>'; ?>
@foreach ($orderItems as $item)
<?php 
$note = $item->purchaseBy ? $item->purchaseBy->order_note : null;
$block .= $note ? '<li>'.$note.'</li>' : '<li>N/A</li>';
?>
@endforeach
<?php $block .= '</ol>'; ?>

<button type="button" class="btn bg-transparent" data-container="body" data-toggle="popover" data-placement="top"
  data-content="{!! $block !!}">
  <i class="fa fa-file-text-o"></i>
</button>