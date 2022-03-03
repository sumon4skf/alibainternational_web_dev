@extends('frontend.layouts.app')

@section('title', app_name() . ' | Frequently asked Questions')

@section('content')


<!-- START SECTION BREADCRUMB -->
<div class="breadcrumb_section bg_gray page-title-mini">
  <div class="container">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="{{route('frontend.index')}}">Home</a></li>
      <li class="breadcrumb-item active">Frequently Asked Question</li>
    </ol>
  </div>
</div>
<!-- END SECTION BREADCRUMB -->

<!-- START MAIN CONTENT -->
<div class="main_content">

  <!-- STAT SECTION FAQ -->
  <div class="section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h2 class="mb-3">General questions</h2>
              <div id="accordion" class="accordion accordion_style1">
                @forelse($faqs->where('post_format', 'general_question') as $faq)
                <div class="card">
                  <div class="card-header" id="heading{{$faq->id}}">
                    <h6 class="mb-0">
                      <a class="collapsed" data-toggle="collapse" href="#collapse{{$faq->id}}"
                        aria-expanded="{{ $loop->first ? 'true' : 'false' }}" aria-controls="collapse{{$faq->id}}">
                        {{$faq->post_title}}
                      </a>
                    </h6>
                  </div>
                  <div id="collapse{{$faq->id}}" class="collapse @if($loop->first) show @endif"
                    aria-labelledby="heading{{$faq->id}}" data-parent="#accordion">
                    <div class="card-body">
                      {!! $faq->post_content !!}
                    </div>
                  </div>
                </div>
                @empty
                <div class="card">
                  <div class="card-header" id="headingTwo">
                    <h6 class="mb-0">
                      <a class="collapsed" data-toggle="collapse" href="#collapseTwo" aria-expanded="true"
                        aria-controls="collapseTwo">
                        How do I set Frequently asked question ?
                      </a>
                    </h6>
                  </div>
                  <div id="collapseTwo" class="collapse show" aria-labelledby="headingTwo" data-parent="#accordion">
                    <div class="card-body">
                      <p>
                        Your Frequently asked question not set yet. You can set your website frequently asked question
                        from
                        the link below.
                      </p>
                      <p><a href="{{url('admin/faq')}}">Manage Frequently Asked Question</a></p>
                    </div>
                  </div>
                </div>
                @endforelse
              </div>

            </div>
          </div> <!-- end card -->
        </div>
        <div class="col-md-6">
          <div class="card mt-4 mt-md-0">
            <div class="card-body">
              <h2 class="mb-3">Other questions</h2>
              <div id="accordion2" class="accordion accordion_style1">
                @forelse($faqs->where('post_format', 'other_question') as $faq)
                <div class="card">
                  <div class="card-header" id="heading{{$faq->id}}">
                    <h6 class="mb-0">
                      <a class="collapsed" data-toggle="collapse" href="#collapse{{$faq->id}}"
                        aria-expanded="{{ $loop->first ? 'true' : 'false' }}" aria-controls="collapse{{$faq->id}}">
                        {{$faq->post_title}}
                      </a>
                    </h6>
                  </div>
                  <div id="collapse{{$faq->id}}" class="collapse @if($loop->first) show @endif"
                    aria-labelledby="heading{{$faq->id}}" data-parent="#accordion2">
                    <div class="card-body">
                      {!! $faq->post_content !!}
                    </div>
                  </div>
                </div>
                @empty
                <div class="card">
                  <div class="card-header" id="headingTwo">
                    <h6 class="mb-0">
                      <a class="collapsed" data-toggle="collapse" href="#collapseTwo" aria-expanded="true"
                        aria-controls="collapseTwo">
                        How do I set Frequently asked question ?
                      </a>
                    </h6>
                  </div>
                  <div id="collapseTwo" class="collapse show" aria-labelledby="headingTwo" data-parent="#accordion">
                    <div class="card-body">
                      <p>
                        Your Frequently asked question not set yet. You can set your website frequently asked question
                        from
                        the link below.
                      </p>
                      <p><a href="{{url('admin/faq')}}">Manage Frequently Asked Question</a></p>
                    </div>
                  </div>
                </div>
                @endforelse

              </div>
            </div>
          </div> <!-- end card -->
        </div>
      </div>
    </div>
  </div>
  <!-- END SECTION FAQ -->

</div>
<!-- END MAIN CONTENT -->
@endsection