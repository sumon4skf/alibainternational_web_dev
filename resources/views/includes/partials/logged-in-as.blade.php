@impersonating
<div class="alert alert-warning text-center logged-in-as m-0">
  You are currently logged in as {{ auth()->user()->name }}. <a href="{{ route('impersonate.leave') }}">Return to your
    account</a>.
</div>
<!--alert alert-warning logged-in-as-->
@endImpersonating