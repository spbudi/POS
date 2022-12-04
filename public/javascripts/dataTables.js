// Users table
$(document).ready(function () {
  $('#users-table').DataTable({
    lengthMenu: [
      [3, 5, 10],
      [3, 5, 10, 'All'],
    ],
    processing: true,
    serverSide: true,
    ajax: '/users/datatable',
    columns: [
      { data: 'userid' },
      { data: 'email' },
      { data: 'name' },
      { data: 'role' },
      {
        data: 'userid',
        orderable: false,
        render: function (data) {
          return `
            <div class="d-grid gap-2 d-md-block">
              <a type="button" class="btn btn-success rounded-circle" href="/users/edit/${data}">
                <i class="fa-solid fa-circle-info"></i></a>
              <a type="button" class="btn btn-danger rounded-circle"
                onclick="$('#modal-delete${data}').modal('show')"
                title="Delete"><i class="fas fa-solid fa-trash"></i></a>
            </div>
          <div class="modal fade" id="modal-delete${data}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Deleted confirmation</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                    onclick="$('#modal-delete').modal('hide')">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <p>Are you sure, you want to delete it?</p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal"
                    onclick="$('#modal-delete').modal('hide')">No</button>
                  <a id="btn-delete" type="button" class="btn btn-primary"
                    href="users/delete/${data}">Yes</a>
                </div>
              </div>
            </div>
          </div>
          `;
        },
      },
    ],
  });
  // Units table
  $('#units-table').DataTable({
    lengthMenu: [
      [3, 5, 10],
      [3, 5, 10, 'All'],
    ],
    processing: true,
    serverSide: true,
    ajax: '/units/datatable',
    columns: [
      { data: 'unit' },
      { data: 'name' },
      { data: 'note' },
      {
        data: 'unit',
        orderable: false,
        render: function (data) {
          return `
            <div class="d-grid gap-2 d-md-block">
              <a type="button" class="btn btn-success rounded-circle" href="/units/edit/${data}">
                <i class="fa-solid fa-circle-info"></i></a>
              <a type="button" class="btn btn-danger rounded-circle"
                onclick="$('#modal-delete${data}').modal('show')"
                title="Delete"><i class="fas fa-solid fa-trash"></i></a>
            </div>
          <div class="modal fade" id="modal-delete${data}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Deleted confirmation</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                    onclick="$('#modal-delete').modal('hide')">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <p>Are you sure, you want to delete it?</p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal"
                    onclick="$('#modal-delete').modal('hide')">No</button>
                  <a id="btn-delete" type="button" class="btn btn-primary"
                    href="units/delete/${data}">Yes</a>
                </div>
              </div>
            </div>
          </div>
          `;
        },
      },
    ],
  });
  // Suppliers table
  $('#suppliers-table').DataTable({
    lengthMenu: [
      [3, 5, 10, 100],
      [3, 5, 10, 100],
    ],
    processing: true,
    serverSide: true,
    ajax: '/suppliers/datatable',
    columns: [
      { data: 'supplierid' },
      { data: 'name' },
      { data: 'address' },
      { data: 'phone' },
      {
        data: 'supplierid',
        orderable: false,
        render: (data) => {
          return `
          <div class="d-grid gap-2 d-md-block">
          <a type="button" class="btn btn-success rounded-circle" href="/suppliers/edit/${data}">
            <i class="fa-solid fa-circle-info"></i></a>
          <a type="button" class="btn btn-danger rounded-circle"
            onclick="$('#modal-delete${data}').modal('show')"
            title="Delete"><i class="fas fa-solid fa-trash"></i></a>
        </div>
      <div class="modal fade" id="modal-delete${data}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Deleted confirmation</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                onclick="$('#modal-delete').modal('hide')">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>Are you sure, you want to delete it?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal"
                onclick="$('#modal-delete').modal('hide')">No</button>
              <a id="btn-delete" type="button" class="btn btn-primary"
                href="suppliers/delete/${data}">Yes</a>
            </div>
          </div>
        </div>
      </div>
          `;
        },
      },
    ],
  });
  // Sales table
  $('#sales-table').DataTable({
    lengthMenu: [
      [3, 5, 10],
      [3, 5, 10],
    ],
    processing: true,
    serverSide: true,
    ajax: '/sales/datatable',
    columns: [
      { data: 'invoice' },
      {
        data: 'time',
        render: function (data) {
          return `${moment(data).format('DD MMM YYYY HH:mm:s')}`;
        },
      },
      {
        data: 'totalsum',
        render: function (data) {
          return currencyFormatter.format(data);
        },
      },
      {
        data: 'pay',
        render: function (data) {
          return currencyFormatter.format(data);
        },
      },
      {
        data: 'change',
        render: function (data) {
          return currencyFormatter.format(data);
        },
      },
      { data: 'name' },
      {
        data: 'invoice',
        orderable: false,
        render: function (data) {
          return `
            <div class="d-grid gap-2 d-md-block">
              <a type="button" class="btn btn-success rounded-circle" href="/sales/show/${data}">
                <i class="fa-solid fa-circle-info"></i></a>
              <a type="button" class="btn btn-danger rounded-circle"
                onclick="$('#modal-delete${data}').modal('show')"
                title="Delete"><i class="fas fa-solid fa-trash"></i></a>
            </div>
          <div class="modal fade" id="modal-delete${data}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Deleted confirmation</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                    onclick="$('#modal-delete').modal('hide')">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <p>Are you sure, you want to delete it?</p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal"
                    onclick="$('#modal-delete').modal('hide')">No</button>
                  <a id="btn-delete" type="button" class="btn btn-primary"
                    href="sales/delete/${data}">Yes</a>
                </div>
              </div>
            </div>
          </div>
          `;
        },
      },
    ],
  });
  // Purchases table
  $('#purchases-table').DataTable({
    lengthMenu: [
      [3, 5, 10],
      [3, 5, 10, 'All'],
    ],
    processing: true,
    serverSide: true,
    ajax: '/purchases/datatable',
    columns: [
      { data: 'invoice' },
      {
        data: 'time',
        render: function (data) {
          return `${moment(data).format('DD MMM YYYY HH:mm:s')}`;
        },
      },
      {
        data: 'totalsum',
        render: function (data) {
          return currencyFormatter.format(data);
        },
      },
      { data: 'name' },
      {
        data: 'invoice',
        orderable: false,
        render: function (data) {
          return `
            <div class="d-grid gap-2 d-md-block">
              <a type="button" class="btn btn-success rounded-circle" href="/purchases/show/${data}">
                <i class="fa-solid fa-circle-info"></i></a>
              <a type="button" class="btn btn-danger rounded-circle"
                onclick="$('#modal-delete${data}').modal('show')"
                title="Delete"><i class="fas fa-solid fa-trash"></i></a>
            </div>
          <div class="modal fade" id="modal-delete${data}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Deleted confirmation</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                    onclick="$('#modal-delete').modal('hide')">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <p>Are you sure, you want to delete it?</p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal"
                    onclick="$('#modal-delete').modal('hide')">No</button>
                  <a id="btn-delete" type="button" class="btn btn-primary"
                    href="purchases/delete/${data}">Yes</a>
                </div>
              </div>
            </div>
          </div>
          `;
        },
      },
    ],
  });
  // Goods table
  $('#goods-table').DataTable({
    lengthMenu: [
      [3, 5, 10],
      [3, 5, 10, 'All'],
    ],
    processing: true,
    serverSide: true,
    ajax: '/goods/datatable',
    columns: [
      { data: 'barcode' },
      { data: 'name' },
      { data: 'stock' },
      { data: 'unit' },
      {
        data: 'purchaseprice',
        render: function (data) {
          return currencyFormatter.format(data);
        },
      },
      {
        data: 'sellingprice',
        render: function (data) {
          return currencyFormatter.format(data);
        },
      },
      {
        data: 'picture',
        orderable: false,
        render: function (data) {
          return ` 
            <img src= "/images/upload/${data}" alt= "Preview" width= "100">
            `;
        },
      },
      {
        data: 'barcode',
        orderable: false,
        render: function (data) {
          return `
            <div class="d-grid gap-2 d-md-block">
              <a type="button" class="btn btn-success rounded-circle" href="/goods/edit/${data}">
                <i class="fa-solid fa-circle-info"></i></a>
              <a type="button" class="btn btn-danger rounded-circle"
                onclick="$('#modal-delete${data}').modal('show')"
                title="Delete"><i class="fas fa-solid fa-trash"></i></a>
            </div>
          <div class="modal fade" id="modal-delete${data}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Deleted confirmation</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                    onclick="$('#modal-delete').modal('hide')">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <p>Are you sure, you want to delete it?</p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal"
                    onclick="$('#modal-delete').modal('hide')">No</button>
                  <a id="btn-delete" type="button" class="btn btn-primary"
                    href="goods/delete/${data}">Yes</a>
                </div>
              </div>
            </div>
          </div>
          `;
        },
      },
    ],
  });
  // Customers table
  $('#customers-table').DataTable({
    lengthMenu: [
      [3, 5, 10],
      [3, 5, 10, 'All'],
    ],
    processing: true,
    serverSide: true,
    ajax: '/customers/datatable',
    columns: [
      { data: 'customerid' },
      { data: 'name' },
      { data: 'address' },
      { data: 'phone' },
      {
        data: 'customerid',
        orderable: false,
        render: function (data) {
          return `
            <div class="d-grid gap-2 d-md-block">
              <a type="button" class="btn btn-success rounded-circle" href="/customers/edit/${data}">
                <i class="fa-solid fa-circle-info"></i></a>
              <a type="button" class="btn btn-danger rounded-circle"
                onclick="$('#modal-delete${data}').modal('show')"
                title="Delete"><i class="fas fa-solid fa-trash"></i></a>
            </div>
          <div class="modal fade" id="modal-delete${data}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Deleted confirmation</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                    onclick="$('#modal-delete').modal('hide')">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <p>Are you sure, you want to delete it?</p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal"
                    onclick="$('#modal-delete').modal('hide')">No</button>
                  <a id="btn-delete" type="button" class="btn btn-primary"
                    href="customers/delete/${data}">Yes</a>
                </div>
              </div>
            </div>
          </div>
          `;
        },
      },
    ],
  });
  // Dashboard table - report
  $('#dashboards-table').DataTable({
    lengthMenu: [
      [3, 5, 10, 100],
      [3, 5, 10, 100],
    ],
    "ordering": false
  });
});
