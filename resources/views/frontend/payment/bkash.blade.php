<!DOCTYPE html>
<html>

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>Bkash Checkout</title>
  <meta name="viewport" content="width=device-width" ,="" initial-scale="1.0/">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrom=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/10.16.6/sweetalert2.min.css">
  <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>

  @if(config('bkash.sandbox_mode') === 'sandbox')
  <script id="myScript" src="{{config('bkash.sandbox_script')}}"></script>
  @else
  <script id="myScript" src="{{config('bkash.live_script')}}"></script>
  @endif
  <script src="https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/10.16.6/sweetalert2.all.min.js"></script>

</head>

<body>

  <button type="button" id="bKash_button" style="display: none">Pay With bKash</button>

  <script type="text/javascript">
    var accessToken = '';
   $(document).ready(function () {
      $.ajax({
         url: "/bkash/token",
         type: 'POST',
         headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
         },
         contentType: 'application/json',
         success: function (data) {
            // console.log('got data from token  ..');
            // console.log(JSON.stringify(data.id_token));
            // accessToken = JSON.stringify(data.id_token);
            $('#bKash_button').trigger('click');
         },
         error: function () {
            console.log('error');
         }
      });

      var paymentConfig = {
         createCheckoutURL: '/bkash/checkout',
         executeCheckoutURL: "/bkash/execute",
      };


      var paymentRequest;
      paymentRequest = {amount: '{{$data["amount"]}}', intent: 'sale', ref_no: '{{$data["ref_no"]}}',};
      // console.log(JSON.stringify(paymentRequest));

      bKash.init({
         paymentMode: 'checkout',
         paymentRequest: paymentRequest,
         createRequest: function (request) {
            // console.log('=> createRequest (request) :: ');
            // console.log(request);
            $.ajax({
               url: paymentConfig.createCheckoutURL + "?amount=" + paymentRequest.amount + "&intent=" + paymentRequest.intent + "&ref_no=" + paymentRequest.ref_no,
               type: 'GET',
               contentType: 'application/json',
               success: function (data) {
                  // console.log('got data from create  ..');
                  // console.log(JSON.stringify(data));

                  var obj = JSON.parse(data);

                  if (data && obj.paymentID != null) {
                     paymentID = obj.paymentID;
                     bKash.create().onSuccess(obj);
                  console.log(obj);
                  } else {
                     console.log('error');
                     bKash.create().onError();
                  }
               },
               error: function () {
                  console.log('error');
                  bKash.create().onError();
               }
            });
         },

         executeRequestOnAuthorization: function () {
            // console.log('=> executeRequestOnAuthorization');
            $.ajax({
               url: paymentConfig.executeCheckoutURL + "?paymentID=" + paymentID,
               type: 'GET',
               contentType: 'application/json',
               success: function (data) {
                  data = JSON.parse(data);
                  console.log('data', data);
                  if (data && data.paymentID) {
                     // alert('[SUCCESS] data : ' + JSON.stringify(data));
                    //  console.log('data', data);
                     setTimeout(() => {
                      window.location.href = "/bkash/success?n_type=success&paymentID="+data.paymentID+"&trxID="+data.trxID;
                     }, 5000);
                  } else {
                     window.location.href = "/bkash/failed";
                    //  bKash.execute().onError(); 
                  }
               },
               error: function () {
                  bKash.execute().onError();
               }
            });
         }
      });

      // console.log("Right after init ");


   });

   function callReconfigure(val) {
      bKash.reconfigure(val);
   }

   function clickPayButton() {
      $("#bKash_button").trigger('click');
   }


  </script>

</body>

</html>