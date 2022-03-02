@auth

  @php
    $name = $logged_in_user->name;
    $email = $logged_in_user->email;
    $phone = $logged_in_user->phone;

    $email = explode('@', $email);
    $validEmail = in_array('otpLogin.com', $email) ? false : true;

  @endphp
  @if ((!$name || !$validEmail || !$phone) && !Route::is('frontend.index'))
    <div class="alert alert-danger fixed-bottom m-0 py-5 text-center" role="alert">
      <h5>Your are not completed !</h5>
      <a href="{{route('frontend.user.update.information',['redirect' => url()->current()])}}" class="text-primary">@lang('Update now')</a>
    </div>
  @endif

@endauth

