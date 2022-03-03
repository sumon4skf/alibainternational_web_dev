@extends('frontend.layouts.app')

@section('title', __('labels.frontend.contact.box_title'))

@section('content')

<div class="breadcrumb_section bg_gray page-title-mini">
  <div class="container">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="{{route('frontend.index')}}">Home</a></li>
      <li class="breadcrumb-item active">Contact</li>
    </ol>
  </div>
</div>


<div class="section pt-4">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-6">
        <div class="card">
          <div class="card-body">
            <h2 class="mb-4">Get In touch</h2>
            <p class="leads">{!! $contact->post_content !!}</p>
            <div class="field_form">
              {{ html()->form('POST', route('frontend.contact.send'))->open() }}
              <div class="form-group">
                {{ html()->text('name', optional(auth()->user())->name)
                ->class('form-control')
                ->placeholder(__('validation.attributes.frontend.name'))
                ->attribute('maxlength', 191)
                ->required()
                ->autofocus() }}
              </div>
              <div class="form-group">
                {{ html()->email('email', optional(auth()->user())->email)
                ->class('form-control')
                ->placeholder(__('validation.attributes.frontend.email'))
                ->attribute('maxlength', 191)
                ->required() }}
              </div>
              <div class="form-group">
                {{ html()->text('phone')
                ->class('form-control')
                ->placeholder(__('validation.attributes.frontend.phone'))
                ->attribute('maxlength', 191)
                ->required() }}
              </div>
              <div class="form-group">
                {{ html()->textarea('message')
                ->class('form-control')
                ->placeholder(__('validation.attributes.frontend.message'))
                ->attribute('rows', 5)
                ->required() }}
              </div>
              <div class="form-group">
                <button type="submit" title="Submit Your Message!" class="btn btn-block btn-fill-out" name="submit"
                  value="Submit">Send Message
                </button>
              </div>
              <div class="col-md-12">
                <div id="alert-msg" class="alert-msg text-center"></div>
              </div>

              {{ html()->form()->close() }}

            </div>
          </div>
        </div>

      </div>

      @if(get_setting('g_map_iframe_url'))
      <div class="col-lg-6 pt-2 pt-lg-0 mt-4 mt-lg-0">
        <div class="card">
          <div class="card-body">
            <div class="embed-responsive embed-responsive-4by3">
              <iframe class="embed-responsive-item" src="{{get_setting('g_map_iframe_url')}}"></iframe>
            </div>
          </div>
        </div>
      </div>
      @endif

    </div>
  </div>
</div>


</div>
<!-- END MAIN CONTENT -->

@endsection



@push('after-scripts')
@if(config('access.captcha.contact'))
{{-- @captchaScripts --}}
@endif
@endpush