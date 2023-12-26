const productdata = document.getElementById("productdata");
const modaloldproductname = document.getElementById("modaloldproductname");


var data , productid;

async function loadData(){
   productdata.innerHTML = '';
    data = await getProductData();
    data.forEach(element => {
        let html = `
        <tr>
        <th scope="row">${element.productId}</th>
        <td>${element.productName}</td>
        <td>
            <button id="productedit${element.productId}" class="btn btn-outline-success" type="submit" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="editProduct(this.id)">Edit</button>
            <button id="productdelete${element.productId}" class="btn btn-outline-danger" type="submit" onclick="deleteProduct(this.id)">Delete</button>
        </td>
    </tr>
        `
        productdata.insertAdjacentHTML("beforeend", html);
    })
}
loadData();

async function getProductData() {
    const response = await fetch("https://localhost:7042/product")
    const productdata = await response.json();
    return productdata;
}

function addDataFromModal(){
    let productname = document.getElementById("modalnewproductname").value;
    if(productname.trim().length !== 0 ){
        fetch("https://localhost:7042/Product", {
            method: "POST",
            body: JSON.stringify({
              productName: productname
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
          })
            
          
            location.reload();
    }
    else{
        alert("Product Name is not valid");
    }
}

async function editProduct(id){
    id =  id.slice(11);
    productid = id;
    const response = await fetch(`https://localhost:7042/Product/${id}`);
    data = await response.json();
    modaloldproductname.innerText = data.productName;

}


function editDataFromModal() {
    let productname = document.getElementById("modalproductname").value;
    fetch(`https://localhost:7042/Product/${productid}`, {
        method: "PUT",
        body: JSON.stringify({
            productId : productid,
            productName: productname
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
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
}

async function deleteProduct(id){
    id = id.slice(13);
    let ans = confirm("Are you sure you want to delete?");
    if(ans){
        const response = await fetch(`https://localhost:7042/Product/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: null
        });
        location.reload();
    }
}

