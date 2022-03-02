{{ html()->modelForm($address, 'PATCH', route('frontend.ajax.customer.address.update', $address))->open() }}

<div class="form-group">
  {{html()->label('Name')->for('name')}}
  {{html()->text('name')
  ->class('form-control')
  ->placeholder('Name')
  ->required()}}
</div> <!-- form-group -->

<div class="form-group">
  {{html()->label('Phone One')->for('phone_one')}}
  {{html()->text('phone_one')
  ->class('form-control')
  ->placeholder('Phone One')
  ->required()}}
</div> <!-- form-group -->

<div class="form-group">
  {{html()->label('Phone Two')->for('phone_two')}}
  {{html()->text('phone_two')
  ->class('form-control')
  ->placeholder('Phone Two')
  }}
</div> <!-- form-group -->

<div class="form-group">
  {{html()->label('Address')->for('address')}}
  {{html()->textarea('address')
  ->rows(3)
  ->class('form-control')
  ->placeholder('Full Address')
  ->required()}}
</div> <!-- form-group -->

<div class="form-group">
  <button type="submit" class="btn btn-primary btn-block">Update Address</button>
</div> <!-- form-group -->



{{ html()->closeModelForm() }}