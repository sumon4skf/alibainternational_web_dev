<div class="card mb-3">
  {{ html()->form('POST', route('admin.setting.logoStore'))->attribute('enctype', 'multipart/form-data')->open() }}
  <div class="card-header with-border">
    <h3 class="card-title">Logo Settings <small class="ml-2">(update information anytime)</small></h3>
  </div>
  <div class="card-body">

    <div class="form-group">
      {{html()->label('Frontend logo Menu (205x90)')->for('frontend_logo_menu')}}
      {{html()->file('frontend_logo_menu')->class('form-control-file image d-none')->id('frontend_logo_menu')->acceptImage()}}
      <div class="d-block">
        <label for="frontend_logo_menu">
          <img src="{{asset(get_setting('frontend_logo_menu',$demoImg))}}" class="border img-fluid rounded holder" alt="Image upload">
        </label>
      </div>
    </div> <!-- form-group-->

    <div class="form-group">
      {{html()->label('Frontend logo Footer (205x90)')->for('frontend_logo_footer')}}
      {{html()->file('frontend_logo_footer')->class('form-control-file image d-none')->id('frontend_logo_footer')->acceptImage()}}
      <div class="d-block">
        <label for="frontend_logo_footer">
          <img src="{{asset(get_setting('frontend_logo_footer', $demoImg))}}" class="border img-fluid rounded holder"
               alt="Image upload">
        </label>
      </div>
    </div> <!-- form-group-->


    <div class="form-group">
      {{html()->label('Admin logo (100x100)')->for('admin_logo')}}
      {{html()->file('admin_logo')->class('form-control-file image d-none')->id('admin_logo')->acceptImage()}}
      <div class="d-block">
        <label for="admin_logo">
          <img src="{{asset(get_setting('admin_logo', $demoImg))}}" class="border img-fluid rounded holder" alt="Image upload">
        </label>
      </div> <!-- col-->
    </div> <!-- form-group-->

    <div class="form-group">
      {{html()->button('Update')->class('btn btn-block btn-primary')}}
    </div> <!-- form-group-->

  </div> <!--  .card-body -->
  {{ html()->form()->close() }}
</div> <!--  .card -->