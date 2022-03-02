<?php
$Scores = $sellerInformation["Scores"] ?? '';
$DeliveryScore = $Scores["DeliveryScore"] ?? 0 ;
$ItemScore = $Scores["ItemScore"] ?? 0 ;
$ServiceScore = $Scores["ServiceScore"] ?? 0 ;
?>

<div class="row d-flex justify-content-center">
  <div class="col-sm-6">
    <table class="table table-bordered">
      <tr>
        <td class="text-capitalize">Seller Name</td>
        <td class="text-capitalize">{{$sellerInformation['Name'] ?? "N/A"}}</td>
      </tr>
      <tr>
        <td class="text-capitalize">Seller ID</td>
        <td class="text-capitalize">{{$sellerInformation['Id'] ?? "N/a"}}</td>
      </tr>
      <tr>
        <td class="text-capitalize">Shop Name</td>
        <td class="text-capitalize">{{$sellerInformation['ShopName'] ?? "N/a"}}</td>
      </tr>
      <tr>
        <td class="text-capitalize">Delivery Score</td>
        @php
            $dClass = $DeliveryScore >= 4 ? 'badge-danger' : 'badge-secondary';
        @endphp
        <td class="text-capitalize"><span class="badge {{$dClass}}">{{$DeliveryScore}}</span></td>
      </tr>
      <tr>
        <td class="text-capitalize">Item Score</td>
        @php
            $dClass = $ItemScore >= 4 ? 'badge-danger' : 'badge-secondary';
        @endphp
        <td class="text-capitalize"><span class="badge {{$dClass}}">{{$ItemScore}}</span></td>
      </tr>
      <tr>
        <td class="text-capitalize">Service Score</td>
        @php
            $dClass = $ItemScore >= 4 ? 'badge-danger' : 'badge-secondary';
        @endphp
        <td class="text-capitalize"><span class="badge {{$dClass}}">{{$ServiceScore}}</span></td>
      </tr>
    </table>
  </div>
</div>