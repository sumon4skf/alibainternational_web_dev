<div class="card mb-3">
  {{ html()->form('POST', route('admin.setting.socialStore'))->open() }}
  <div class="card-header with-border">
    <h3 class="card-title">Payment Seetings <small class="ml-2">(update information anytime)</small></h3>
  </div>
  <div class="card-body">
    <input type="hidden" name="payment_settings" value="yes">

    <div class="form-group">
      <div class="form-check form-check-inline">
        {{html()->checkbox('sslcommerz_active', get_setting('sslcommerz_active'), date('Y-m-d
        H:i:s'))->class('form-check-input')}}
        {{ html()->label("SSLCOMMERZ")->class('form-check-label')->for('sslcommerz_active') }}
      </div>
      <div class="form-check form-check-inline">
        {{html()->checkbox('smanager_active', get_setting('smanager_active'), date('Y-m-d
        H:i:s'))->class('form-check-input')}}
        {{ html()->label("Smanager")->class('form-check-label')->for('smanager_active') }}
      </div>
      <div class="form-check form-check-inline">
        {{html()->checkbox('cash_payment', get_setting('cash_payment'), date('Y-m-d
        H:i:s'))->class('form-check-input')}}
        {{ html()->label("Cash Payment")->class('form-check-label')->for('cash_payment') }}
      </div>
    </div> <!-- form-group-->

    <div class="card p-3 @if(!get_setting('sslcommerz_active')) d-none @endif" style="border: 1px dashed #eee">
      <div class="form-group">
        <div class="form-check form-check-inline">
          {{html()->radio('sslcommerz_env', get_setting('sslcommerz_env') == 'sslcommerz_live',
          'sslcommerz_live')->id('sslcommerz_live')->class('form-check-input')}}
          {{ html()->label("SSLCOMMERZ Live")->class('form-check-label')->for('sslcommerz_live')}}
        </div>
        <div class="form-check form-check-inline">
          {{html()->radio('sslcommerz_env', get_setting('sslcommerz_env') == 'sslcommerz_demo',
          'sslcommerz_demo')->id('sslcommerz_demo')->class('form-check-input')}}
          {{ html()->label("SSLCOMMERZ Demo")->class('form-check-label')->for('sslcommerz_demo')}}
        </div>
      </div> <!-- form-group-->
      <div class="form-group">
        {{html()->label('SSLCOMMERZ Client Id')->for('sslcommerz_store_id')}}
        {{html()->text('sslcommerz_store_id',
        get_setting('sslcommerz_store_id'))->class('form-control')->placeholder('SSLCOMMERZ Store Id')}}
      </div> <!-- form-group-->
      <div class="form-group">
        {{html()->label('SSLCOMMERZ Store Password')->for('sslcommerz_store_password')}}
        {{html()->text('sslcommerz_store_password',
        get_setting('sslcommerz_store_password'))->class('form-control')->placeholder('SSLCOMMERZ Store Password')}}
      </div> <!-- form-group-->
    </div>

    <div class="card mt-3 p-3 @if(!get_setting('smanager_active')) d-none @endif" style="border: 1px dashed #eee">
      <div class="form-group">
        <div class="form-check form-check-inline">
          {{html()->radio('smanager_env', get_setting('smanager_env'),
          'smanager_live')->id('smanager_live')->class('form-check-input')}}
          {{ html()->label("Smanager Live")->class('form-check-label')->for('smanager_live')}}
        </div>
        <div class="form-check form-check-inline">
          {{html()->radio('smanager_env', get_setting('smanager_env', true),
          'smanager_demo')->id('smanager_demo')->class('form-check-input')}}
          {{ html()->label("Smanager Demo")->class('form-check-label')->for('smanager_demo')}}
        </div>
      </div> <!-- form-group-->
      <div class="form-group">
        {{html()->label('Smanager Client Id')->for('smanager_client_id')}}
        {{html()->text('smanager_client_id',
        get_setting('smanager_client_id'))->class('form-control')->placeholder('Smanager Client Id')}}
      </div> <!-- form-group-->
      <div class="form-group">
        {{html()->label('Smanager Client Secret')->for('smanager_client_secret')}}
        {{html()->text('smanager_client_secret',
        get_setting('smanager_client_secret'))->class('form-control')->placeholder('Smanager Client Secret')}}
      </div> <!-- form-group-->
    </div>



    <div class="form-group">
      {{html()->button('Update')->class('btn btn-block btn-primary')}}
    </div> <!-- form-group-->

  </div> <!--  .card-body -->
  {{ html()->form()->close() }}
</div> <!--  .card -->