<div class="form-group">
  {{ html()->text('phone')
  ->class('form-control')
  ->id('phone_number')
  ->placeholder('Phone')
  ->attributes(['autocomplete' => 'off'])
  ->required() }}
  <p class="text-danger d-none small phone_error_msg m-0"></p>
</div>
<div class="form-group">
  <button type="button" id="otpSubmitBtn" class="btn btn-default btn-block" name="login">Next</button>
</div>