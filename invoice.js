const invoicedata = document.getElementById("invoicedata");

// var data , invoiceid;

const headers = {
    'Content-Type': 'application/json',
};

$('#addinvoicebtn').click(function(){
    let formData = {
        products: []
    };

    function updateDataTable() {
        $('#invoiceTable').DataTable().clear().rows.add(formData.products).draw();

        const grandTotal = formData.products.reduce((total, item) => {
            return total + (item.quantity * item.rate);
        }, 0);

        $('#grandTotal').text(grandTotal.toFixed(2));
    }

    $('#invoiceForm').submit(function (e) {
        e.preventDefault();

        $('#partyDropdown').prop('disabled', true);
        formData.partyId = $('#partyDropdown').val();
        formData.products.push({
            productId: $('#productDropdown').val(),
            productName: $('#productDropdown option:selected').text(),
            quantity: parseFloat($('#quantity').val()),
            rate: parseInt($('#productRate').val()),
            total: parseInt($('#quantity').val()) * parseInt($('#productRate').val())
        });


        $('#partyName').text($('#partyDropdown option:selected').text());
        updateDataTable();
    });

    $('#invoiceTable').DataTable({
        data: formData.products,
        columns: [
            { data: 'productName', title: 'Product Name' },
            { data: 'quantity', title: 'Quantity' },
            { data: 'rate', title: 'Rate' },
            { data: 'total', title: 'total' },
        ]
    });

    $('#GenerateInvoice').click(function () {
        console.log(formData);

        $.ajax({
            url: 'https://localhost:7042/Invoice',
            type: 'POST',
            headers: headers,
            data: JSON.stringify({
                partyId: formData.partyId,
                invoiceProducts: formData.products
              }),
            success: function (data) {
               console.log(data)
            },
            error: function (error) {
                console.log(error);
            }
        });

    });

    

    fetch('https://localhost:7042/AssignParty', { headers: headers })
        .then(response => response.json())
        .then(data => {
            const uniqueParties = new Set();
            data.forEach(party => {
                if (!uniqueParties.has(party.partyId)) {
                    uniqueParties.add(party.partyId);
                    $('#partyDropdown').append(`<option value="${party.partyId}">${party.partyName}</option>`);
                }
            });
            loadInvoiceProducts();

        })
        .catch(error => console.error('Error fetching party data:', error));



    function loadInvoiceProducts() {
        let partyId = $('#partyDropdown').val();
        fetchInvoiceProducts(partyId);
    }
    function fetchInvoiceProducts(partyId) {
        fetch(`https://localhost:7042/invoice/InvoiceProducts/${partyId}`, { headers: headers })
            .then(response => response.json())
            .then(data => {
                $('#productDropdown').empty();
                data.forEach(product => {
                    $('#productDropdown').append(`<option value="${product.productId}">${product.productName}</option>`);
                });
                loadInvoiceProductRate();
            });
    }
    function loadInvoiceProductRate() {
        let productId = $('#productDropdown').val();
        fetchInvoiceProductRate(productId);
    }


    $('#productDropdown').change(function () {
        $('#productRate').empty();
        let productId = $('#productDropdown').val();
        fetchInvoiceProductRate(productId);
    });

    function fetchInvoiceProductRate(productId) {
        fetch(`https://localhost:7042/invoice/InvoiceProductRate/${productId}`, { headers: headers })
            .then(response => response.json())
            .then(data => {
                $('#productRate').val(data);
            });
    }


    $('#partyDropdown').change(function () {
        $('#productDropdown').empty();
        let partyId = $('#partyDropdown').val();
        fetchInvoiceProducts(partyId);
    });

    $('#closebtn').click(() => location.reload());

})


async function loadData(){
    invoicedata.innerHTML = '';
     data = await getInvoiceData();
     let tab ='';
     data.forEach(element => {
         tab += ` <tr>
                 <th scope="row">${element.id}</th>
                 <td>${element.partyName}</td>
                 <td>${element.date}</td> 
             </tr>
         </tbody>`
     });
     invoicedata.innerHTML = tab;
     $("#tbl").dataTable({
         data : data,
         columns: [
             {data : 'invoiceId'},
             {data : 'partyName'},
             {data : 'date'},
             {render: function (data, type, full) {
                 return `<td><button id="invoiceedit${full.invoiceId}" class="btn btn-outline-success" type="submit" onclick="viewData(this.id)">View</button>
                 <button id="invoicedelete${full.invoiceId}" class="btn btn-outline-danger" type="submit" onclick="deleteInvoice(this.id)">Delete</button>
             </td>`;
             
             }}
         ],
         paging: false
         
     });
 
 }
 loadData();

async function getInvoiceData() {
    const response = await fetch("https://localhost:7042/invoice")
    const data = await response.json();
    return data;
}

function viewData(id){
    var invoiceId = id.slice(11);
    window.location.href = 'viewInvoice.html?id=' + invoiceId;
}


async function fillPartyData(selectParty){
    document.getElementById(selectParty).innerHTML ="";
    const partydd = await fetch("https://localhost:7042/Party");
    Partydata = await partydd.json();
    let first = `<option selected>Select Party</option>`
    document.getElementById(selectParty).insertAdjacentHTML("beforeend",first)
  Partydata.forEach(element => {
      var html1=` <option value="${element.partyId}">${element.partyName}</option>`;
      document.getElementById(selectParty).insertAdjacentHTML("beforeend",html1)
  }) 
}


async function deleteInvoice(id){
    id = id.slice(13);
    console.log(id);
    let ans = confirm("Are you sure you want to delete?");
    if(ans){
        const response = await fetch(`https://localhost:7042/Invoice/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: null
        });
        location.reload();
    }
}

