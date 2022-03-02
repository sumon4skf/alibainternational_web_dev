<div class="row">
  @forelse ($addresses as $address)
  <div class="col-md-4">
    <div class="card mb-3">
      <div class="card-header">
        <h4 class="d-inline-block">Address #{{$loop->iteration}}</h4>
        <a href="{{route('frontend.ajax.customer.address.edit', $address)}}" class="btn btn-link ml-2 btn-edit-address"><i class="fas fa-edit"></i></a>
      </div>
      <div class="card-body defaultAddressCardBody p-2 px-3">
        <p class="m-0"><b>Name: </b><span class="name">{{$address->name}}</span></p>
        <p class="m-0"><b>Phone: </b><span class="phone_one">{{$address->phone_one}}<br></span></p>
        <p class="m-0"><b>Phone: </b><span class="phone_two">{{$address->phone_two}}<br></span></p>
        <p class="m-0"><b>Address: </b><span class="address">{{$address->address}}</span></p>
      </div>
    </div>
  </div>
  @empty
  <div class="col-md-4">
    <div class="card mb-3">
      <div class="card-header">
        <h4>Address Not Found</h4>
      </div>
      <div class="card-body defaultAddressCardBody p-2 px-3">
        <p class="m-0"><b>Name: </b><span class="name">No Name</span></p>
        <p class="m-0"><b>Phone: </b><span class="phone_one">No Phone<br></span></p>
        <p class="m-0"><b>Phone: </b><span class="phone_two">No Phone<br></span></p>
        <p class="m-0"><b>Address: </b><span class="address">No Address</span></p>
      </div>
    </div>
  </div>
  @endforelse

</div>



<div class="modal fade" id="editAddressModal" tabindex="-1" aria-labelledby="editAddressModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="editAddressModalLabel">Edit Address</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        ...
      </div>
    </div>
  </div>
</div>

