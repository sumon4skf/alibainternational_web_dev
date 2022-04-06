<div class="form-group">
  {{ html()->email('email')
  ->class('form-control')
  ->placeholder(__('validation.attributes.frontend.email'))
  ->attributes(['maxlength'=> 191, 'autocomplete' => 'email'])
  ->required() }}
</div>
<div class="form-group">
  <button type="submit" id="emailSubmitBtn" class="btn btn-default btn-block" name="login">Next</button>
</div>