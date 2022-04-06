<h5>
  <button type="button" id="backToLoginCard" class="btn mr-2 p-0 text-danger">
    <i class=" icon-left"></i> Back
  </button>
  Verify OTP
</h5>

<div class="otp_submit_form">
  <div class="form-group">
    <input type="hidden" name="userId" class="userId">
    <input type="hidden" name="userPhone" class="userPhone">
    <input type="text" name="otp_code" class="form-control text-center otp_code" placeholder="----" maxlength="4"
      required="true" autofocus="true" autocomplete="off">
    <small id="phone" class="form-text text-muted text-center">e.g: 1234</small>
  </div> <!-- form-group -->
  <div class="form-group">
    <button type="submit" id="otpCodeSubmitBtn" class="btn btn-default btn-block">Resend Code
      30</button>
  </div>
</div>