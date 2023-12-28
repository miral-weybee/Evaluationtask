const assignpartydata = document.getElementById("assignpartydata");
const modaloldassignpartyname = document.getElementById("modaloldassignpartyname");
const token = localStorage.getItem('token');
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
};
const options = {
    method: 'GET',
    headers: headers,
};

var data , assignpartyid;

async function loadData(){
   assignpartydata.innerHTML = '';
    data = await getAssignPartyData();

    data.forEach(element => {

        let html = `
         
        <tr>
        <th scope="row">${element.assignPartyId}</th>
        <td>${element.partyName}</td>
        <td>${element.productName}</td>
        <td id="btncontainer">
            <button id="partyedit${element.assignPartyId}" class="btn btn-outline-success" type="submit" data-bs-toggle="modal" data-bs-target="#staticBackdrop"  onclick="editAssignParty(this.id)">Edit</button>
            <button id="partydelete${element.assignPartyId}" class="btn btn-outline-danger" type="submit" onclick="deleteAssignParty(this.id)">Delete</button>
        </td>
        </tr>

        `
        assignpartydata.insertAdjacentHTML("beforeend", html);
    });
    fillPartyData('selectParty');
    fillProductData('selectProduct');
}
loadData();

async function getAssignPartyData() {
    const response = await fetch("https://localhost:7042/assignparty",options)
    const data = await response.json();
    return data;
}

async function fillPartyData(selectParty){
    document.getElementById(selectParty).innerHTML ="";
    const partydd = await fetch("https://localhost:7042/Party",options);
    Partydata = await partydd.json();
    let first = `<option selected>Select Party</option>`
    document.getElementById(selectParty).insertAdjacentHTML("beforeend",first)
  Partydata.forEach(element => {
      var html1=` <option value="${element.partyId}">${element.partyName}</option>`;
      document.getElementById(selectParty).insertAdjacentHTML("beforeend",html1)
  }) 
}



async function fillProductData(selectProduct){
    document.getElementById(selectProduct).innerHTML = '';
    const products = await fetch("https://localhost:7042/Product",options);
    Productdata = await products.json();
    let first = `<option selected>Select Product</option>`
    document.getElementById(selectProduct).insertAdjacentHTML("beforeend",first)
    Productdata.forEach(element => {
        var html=` <option value="${element.productId}">${element.productName}</option>`;
        document.getElementById(selectProduct).insertAdjacentHTML("beforeend",html);
    })
}


function addDataFromModal() {
    let PartyId = Number(document.getElementById('selectParty').value);
    let ProductId = Number(document.getElementById('selectProduct').value);
   
    if (!(Number.isNaN(PartyId)  || Number.isNaN(ProductId))) {
        fetch("https://localhost:7042/AssignParty", {
            method: "POST",
            body: JSON.stringify({
                partyId: PartyId,
                productId: ProductId
            }),
            headers: headers
        })
        location.reload();
    }
    else {
        alert("Select Proper Party And Product");
    }
}

async function editAssignParty(id){
    document.getElementById("selectPartye").innerHTML = '';
    document.getElementById("selectProducte").innerHTML = '';
    id =  id.slice(9);
    assignpartyid = id;
    fillPartyData('selectPartye');
    fillProductData('selectProducte');

}


function editDataFromModal() {
    var PartyId = Number(document.getElementById('selectPartye').value);
    var ProductId = Number(document.getElementById('selectProducte').value);
   
    if(!(Number.isNaN(PartyId)  || Number.isNaN(ProductId))){
        fetch(`https://localhost:7042/AssignParty/${assignpartyid}`, {
        method: "PUT",
        body: JSON.stringify({
            assignPartyId : assignpartyid,
                partyId: PartyId,
                productId:ProductId
            }),
              headers:headers
        })
            .then(res => {
                if(res.ok){
                    
                    return res.json();
                }
                throw new Error("Something went wrong");
            })
            .catch(error => console.log(error.body));
    
            $('.fade').hide();
            location.reload();
    }else{
        alert("Not a valid data");
    }
}

async function deleteAssignParty(id){
    id = id.slice(11);
   
    let ans = confirm("Are you sure you want to delete?");
    if(ans){
        const response = await fetch(`https://localhost:7042/AssignParty/${id}`, {
            method: 'DELETE',
            headers: headers,
            body: null
        });
        location.reload();
    }
}

