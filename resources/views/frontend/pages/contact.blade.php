@extends('frontend.layouts.app')

@section('title', __('labels.frontend.contact.box_title'))

@section('content')

<div class="breadcrumb_section bg_gray page-title-mini">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-md-6">
        <div class="page-title">
          <h1>Contact</h1>
        </div>
      </div>
      <div class="col-md-6">
        <ol class="breadcrumb justify-content-md-end">
          <li class="breadcrumb-item"><a href="{{route('frontend.index')}}">Home</a></li>
          <li class="breadcrumb-item active">Contact</li>
        </ol>
      </div>
    </div>
  </div>
</div> <!-- END SECTION BREADCRUMB -->

<!-- START MAIN CONTENT -->
<div class="main_content">

  <div class="section">
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          <div class="heading_s1">
            <h2>Get In touch</h2>
          </div>
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
        @if(get_setting('g_map_iframe_url'))
        <div class="col-lg-6 pt-2 pt-lg-0 mt-4 mt-lg-0">
          <div class="embed-responsive embed-responsive-4by3">
            <iframe class="embed-responsive-item" src="{{get_setting('g_map_iframe_url')}}"></iframe>
          </div>
        </div>
        @endif
      </div>
    </div>
  </div>
</div>
<!-- END SECTION CONTACT -->


</div>
<!-- END MAIN CONTENT -->

@endsection



@push('after-scripts')
@if(config('access.captcha.contact'))
{{-- @captchaScripts --}}
@endif
@endpush