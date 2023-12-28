const productratedata = document.getElementById("productratedata");

const token = localStorage.getItem('token');
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
};
const options = {
    method: 'GET',
    headers: headers,
};
var data , productrateid;

async function loadData(){
   productratedata.innerHTML = '';
    data = await getProductRateData();

    data.forEach(element => {

        let html = `
         
        <tr>
        <th scope="row">${element.productRateId}</th>
        <td>${element.productName}</td>
        <td>${element.rate}</td>
        <td>${element.dateOfRate.slice(0,10)}</td>
        <td id="btncontainer">
            <button id="productrateedit${element.productRateId}" class="btn btn-outline-success" type="submit" data-bs-toggle="modal" data-bs-target="#staticBackdrop"  onclick="editProductRate(this.id)">Edit</button>
            <button id="productratedelete${element.productRateId}" class="btn btn-outline-danger" type="submit" onclick="deleteProductRate(this.id)">Delete</button>
        </td>
        </tr>

        `
        productratedata.insertAdjacentHTML("beforeend", html);
    });
    fillProductData('selectProductRate');
}
loadData();

async function getProductRateData() {
    const response = await fetch("https://localhost:7042/productrate",options)
    const data = await response.json();
    return data;
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

function addDataFromModal(){
    var ProductId = Number(document.getElementById('selectProductRate').value);
    var rateOfProduct = Number(document.getElementById('rate').value);
    var date = document.getElementById('date').value;
    if(ProductId && rateOfProduct && date ){
        fetch("https://localhost:7042/ProductRate", {
            method: "POST",
            body: JSON.stringify({
                productId:ProductId,
                rate:rateOfProduct,
                dateOfRate:date
              }),
              headers: headers
          })
          
            location.reload();
    }
    else{
        alert("Data is not valid");
    }
}

async function editProductRate(id){
    id =  id.slice(15);
    productrateid = id;
    const response = await fetch(`https://localhost:7042/ProductRate/${id}`,options);
    data = await response.json();
    fillProductData('selectProductRatee');
    document.getElementById('ratee').value=data.rate;

}


function editDataFromModal() {
    let ProductId = Number(document.getElementById('selectProductRatee').value);
    let rateOfProduct=Number(document.getElementById('ratee').value);
    let date = document.getElementById('datee').value;
    if(ProductId && rateOfProduct && date ){
        fetch(`https://localhost:7042/ProductRate/${productrateid}`, {
            method: "PUT",
            body: JSON.stringify({
                productRateId: productrateid,
                productId : ProductId,
                rate : rateOfProduct,
                dateOfRate : date
            }),
            headers: headers
        })
            location.reload();
    }else{
        alert("Invalid Data");
    }
   
}

async function deleteProductRate(id){
    id = id.slice(17);
    let ans = confirm("Are you sure you want to delete?");
    if(ans){
        const response = await fetch(`https://localhost:7042/ProductRate/${id}`, {
            method: 'DELETE',
            headers: headers,
            body: null
        });
        location.reload();
    }
}

