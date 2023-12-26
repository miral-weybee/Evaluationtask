const invoicedata = document.getElementById("invoicedata");

var data , invoiceid;

async function loadData(){
   invoicedata.innerHTML = '';
    data = await getInvoiceData();
    let tab ='';
    data.forEach(element => {
        tab += ` <tr>
                <th scope="row">${element.id}</th>
                <td>${element.partyName}</td>
                <td>${element.date}</td>
                <td>${element.total}</td> 
            </tr>
        </tbody>`
    });
    invoicedata.innerHTML = tab;
    $("#tbl").dataTable({
        data : data,
        columns: [
            {data : 'id'},
            {data : 'partyName'},
            {data : 'date'},
            {data : 'total'},
            {render: function (data, type, full) {
                return `<td><button id="invoiceedit${full.id}" class="btn btn-outline-success" type="submit" onclick="viewData(this.id)">View</button>
                <button id="invoicedelete${full.id}" class="btn btn-outline-danger" type="submit" onclick="deleteData(this)">Delete</button>
            </td>`;
            
            }}
        ],
        paging: false,
        "autoWidth": false
        
    });
}
loadData();

async function getInvoiceData() {
    const response = await fetch("https://localhost:7042/invoice")
    const data = await response.json();
    return data;
}
// $('#invoiceHistory').on('click', '.view-btn', function () {
   
// });
function viewData(id){
    var invoiceId = id.slice(11);

    window.location.href = 'viewInvoice.html?id=' + invoiceId;
}

// // function addDataFromModal(){
// //     let partyname = document.getElementById("modalnewpartyname").value;
// //     if(partyname.trim().length !== 0 ){
// //         fetch("https://localhost:7042/Party", {
// //             method: "POST",
// //             body: JSON.stringify({
// //               partyName: partyname
// //             }),
// //             headers: {
// //               "Content-type": "application/json; charset=UTF-8"
// //             }
// //           })
// //             .then((response) => response.json())
// //             .then((json) => console.log(json));
          
// //             location.reload();
// //     }
// //     else{
// //         alert("Party Name is not valid");
// //     }
// // }

// // async function editParty(id){
// //     id =  id.slice(9);
// //     partyid = id;
// //     const response = await fetch(`https://localhost:7042/Party/${id}`);
// //     data = await response.json();
// //     modaloldpartyname.innerText = data.partyName;

// // }


// // function editDataFromModal() {
// //     console.log(partyid);
// //     let partyname = document.getElementById("modalpartyname").value;
// //     fetch(`https://localhost:7042/Party/${partyid}`, {
// //         method: "PUT",
// //         body: JSON.stringify({
// //             partyId : partyid,
// //             partyName: partyname
// //         }),
// //         headers: {
// //             "Content-type": "application/json; charset=UTF-8"
// //         }
// //     })
// //         .then(res => {
// //             if(res.ok){
                
// //                 return res.json();
// //             }
// //             throw new Error("Something went wrong");
// //         })
// //         .catch(error => console.log(error.body));

// //         $('.fade').hide();
// //         location.reload();
// // }

// // async function deleteParty(id){
// //     id = id.slice(11);
   
// //     let ans = confirm("Are you sure you want to delete?");
// //     if(ans){
// //         const response = await fetch(`https://localhost:7042/Party/${id}`, {
// //             method: 'DELETE',
// //             headers: {
// //                 'Content-Type': 'application/json'
// //             },
// //             body: null
// //         });
// //         location.reload();
// //     }
// // }