let editData;
const headers = {
  'Content-Type': 'application/json'
};

$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const invoiceId = urlParams.get('id');


  fetch(`https://localhost:7042/invoice/list/${invoiceId}`,
    {
      method: 'GET',
      headers: headers
    })
    .then(response => response.json())
    .then(data => {
      editData = data;
      console.log(data)
      $('#invoiceId').text(data.id);
      $('#partyName').text(data.partyName);
      $('#invoiceDate').text(data.date);
      let grandTotal = 0;

      data.forEach(x => {
        $('#productsBody').append(`
        <tr>
            <td>${x.productId}</td>
            <td>${x.productName}</td>
            <td>${x.quantity}</td>
            <td>${x.rate}</td>
            <td>${x.total}</td>
        </tr>
    `);

        grandTotal += x.total;
      })



      $('#productsBody').append(`
                <tr>
                    <td colspan="4"><strong>Grand Total:</strong></td>
                    <td>${grandTotal}</td>
                </tr>
            `);


      $('#invoiceForm').submit(function (e) {
        e.preventDefault();

        $('#partyDropdown').prop('disabled', true);
        editData.partyId = $('#partyDropdown').val();
        editData.products.push({
          productId: $('#productDropdown').val(),
          productName: $('#productDropdown option:selected').text(),
          quantity: parseFloat($('#quantity').val()),
          rate: parseFloat($('#productRate').val()),
          total: parseFloat($('#quantity').val()) * parseFloat($('#productRate').val())
        });


        $('#partyName').text($('#partyDropdown option:selected').text());
        updateDataTable();
      });

      

      $('#invoiceTable').DataTable({
        data: editData,
        columns: [
          { data: 'productName', title: 'Product Name' },
          { data: 'quantity', title: 'Quantity' },
          { data: 'rate', title: 'Rate' },
          { data: 'total', title: 'Total' },
          {
            title: 'Action',
            render: function (data, type, row) {
              return '<button class="btn btn-warning btn-sm edit-btn">Edit</button> ' +
                '<button class="btn btn-danger btn-sm delete-btn">Delete</button>';
            }
          }
        ]
      });

    })
    .catch(error => {
      console.error('Error:', error);
    });



  $('#invoiceTable').on('click', '.edit-btn', function () {
    var row = $('#invoiceTable').DataTable().row($(this).parents('tr'));
    var rowData = row.data();
    var index = row.index();

    row.remove().draw();
    editData.products.splice(index, 1);
    updateDataTable();

    $('#quantity').val(rowData.quantity);
    $('#productRate').val(rowData.rate);

    var productNameToSelect = rowData.productName; 
    $('#productDropdown option').each(function () {
      if ($(this).text() === productNameToSelect) {
        $(this).prop('selected', true);
      } else {
        $(this).prop('selected', false);
      }
    });
  });

  $('#invoiceTable').on('click', '.delete-btn', function () {
    var row = $('#invoiceTable').DataTable().row($(this).parents('tr'));
    var index = row.index();
    row.remove().draw();
    editData.products.splice(index, 1);
    updateDataTable();

  });

  $('#GenerateInvoice').click(function () {
    console.log(editData);

    $.ajax({
      url: `https://localhost:7042/Invoice/${editData.id}`,
      type: 'DELETE',
      // headers: {
      //   'Authorization': 'Bearer ' + localStorage.getItem('token')
      // },
      success: function () {
        $.ajax({
          url: 'https://localhost:7042/Invoice',
          type: 'POST',
          // headers: {
          //   'Authorization': 'Bearer ' + localStorage.getItem('token')
          // },
          contentType: 'application/json',
          data: JSON.stringify(editData),
          success: function (data) {
            console.log(data);
            window.location.href = `viewInvoice.html?id=${data}`;
          },
          error: function (error) {
            console.log(error);
          }
        });
      },
      error: function (error) {
        console.log(error);
      }
    });
  });

});


$("#PrintInvoice").click(function (e) {
  e.preventDefault();
  printInvoice();
});

function printInvoice(){
  window.print();
}

$("#EditInvoice").click(function (e) {
  e.preventDefault();
  editInvoice();
});


// function editInvoice() {
//   $('#editModel').show();
//   $('#overlay').show();

//   fetch('https://localhost:7042/AssignParty',
//     {
//       method: 'GET',
//       headers: headers
//     })
//     .then(response => response.json())
//     .then(data => {
//       const uniqueParties = new Set();
//       data.forEach(party => {
//         if (!uniqueParties.has(party.partyId)) {
//           uniqueParties.add(party.partyId);
//           $('#partyDropdown').append(`<option value="${party.partyId}">${party.partyName}</option>`);
//         }
//       });
//       $('#partyDropdown').val(editData.partyId);
//       $('#partyDropdown').attr('disabled', true);
//       loadInvoiceProducts();

//     })
//     .catch(error => console.error('Error fetching party data:', error));

//   function fetchInvoiceProductRate(productId) {
//     fetch(`https://localhost:7042/invoice/InvoiceProductRate/${productId}`,
//       {
//         method: 'GET',
//         headers: headers
//       })
//       .then(response => response.json())
//       .then(data => {
//         $('#productRate').val(data);
//       });
//   }

//   function loadInvoiceProductRate() {
//     let productId = $('#productDropdown').val();
//     fetchInvoiceProductRate(productId);
//   }


//   $('#productDropdown').change(function () {
//     $('#productRate').empty();
//     let productId = $('#productDropdown').val();
//     fetchInvoiceProductRate(productId);

//   });


//   function loadInvoiceProducts() {
//     let partyId = $('#partyDropdown').val();
//     console.log('load invoice', partyId);
//     fetchInvoiceProducts(partyId);
//   }

//   $('#partyDropdown').change(function () {
//     $('#productDropdown').empty();
//     let partyId = $('#partyDropdown').val();
//     fetchInvoiceProducts(partyId);
//   });

//   function fetchInvoiceProducts(partyId) {
//     fetch(`https://localhost:7042/invoice/InvoiceProducts/${partyId}`,
//     {
//       method: 'GET',
//       headers: headers
//     })
//       .then(response => response.json())
//       .then(data => {
//         $('#productDropdown').empty();
//         data.forEach(product => {
//           $('#productDropdown').append(`<option value="${product.productId}">${product.productName}</option>`);
//         });
//         loadInvoiceProductRate();
//       });
//   }

//   $('#partyDropdown').val(editData.partyId);
//   $('#partyDropdown').attr('disabled', true);
// }


function updateDataTable() {
  $('#invoiceTable').DataTable().clear().rows.add(editData.products).draw();

  const grandTotal = editData.products.reduce((total, item) => {
    return total + (item.quantity * item.rate);
  }, 0);

  $('#grandTotal').text(grandTotal.toFixed(2));
}
