<?php $block = '<ol>'; ?>
@foreach ($orderItems as $item)
<?php 
$note = $item->purchaseBy ? $item->purchaseBy->name : null;
$block .= $note ? '<li>'.$note.'</li>' : '<li>Not purchased</li>'; 
?>
@endforeach
<?php $block .= '</ol>'; ?>

<button type="button" class="btn bg-transparent" data-container="body" data-toggle="popover" data-placement="top"
  data-content="{!! $block !!}">
  <i class="fa fa-users"></i>
</button>