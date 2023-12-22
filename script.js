const topnav = document.getElementById("topnav");
const navparty = document.getElementById("navparty");
const navproduct = document.getElementById("navproduct");
const navassignparty = document.getElementById("navassignparty");
const navproductrate = document.getElementById("navproductrate");
const navinvoice = document.getElementById("navinvoice");
const partydata = document.getElementById("partydata");
const productdata = document.getElementById("productdata");
const tbl = document.getElementById("tbl");
const btncontainer = document.getElementById("btncontainer");
const topbtn = document.getElementById("topbtn");

topnav.addEventListener('click', async function (e) {
    e.preventDefault();

    const id = e.target.id;

    if (id === 'navparty') {
        tbl.innerHTML = '';
        const datas = await getPartyData();
        console.log(datas);
        let header = `
        <thead>
            <tr>
                <th scope="col">Id</th>
                <th scope="col">Party Name</th>
                <th scope="col">Actions</th>
            </tr>
        </thead>`
        tbl.insertAdjacentHTML("beforeend", header);

        datas.forEach(element => {

            let html = `
            
            <tbody id="partydata">
            <tr>
            <th scope="row">${element.partyId}</th>
            <td>${element.partyName}</td>
            <td id="btncontainer">
                <button id="partyedit${element.partyId}" class="btn btn-outline-success" type="submit" >Edit</button>
                <button id="partydelete${element.partyId}" class="btn btn-outline-danger" type="submit" onclick="deleteData(this)">Delete</button>
            </td>
            </tr>
            </tbody>
            `
            tbl.insertAdjacentHTML("beforeend", html);
        });
    }
    if (id === 'navproduct') {
        tbl.innerHTML = '';

        const datas = await getProductData();
        let header = `<thead>
        <tr>
            <th scope="col">Id</th>
            <th scope="col">Product Name</th>
            <th scope="col">Actions</th>
        </tr>
    </thead>
    <tbody id="productdata">
    `
    tbl.insertAdjacentHTML("beforeend",header)
        console.log(datas)
        datas.forEach(element => {
            let html = `
            <tr>
            <th scope="row">${element.productId}</th>
            <td>${element.productName}</td>
            <td>
                <button id="productedit${element.productId}" class="btn btn-outline-success" type="submit">Edit</button>
                <button id="productdelete${element.productId}" class="btn btn-outline-danger" type="submit" onclick="deleteData(this)">Delete</button>
            </td>
        </tr>
            `
            tbl.insertAdjacentHTML("beforeend", html);
        });
        let bodyend = `</tbody>`
        tbl.insertAdjacentHTML("beforeend",bodyend)
    }
    if (id === 'navassignparty') {
        tbl.innerHTML = '';
        const data = await getAssignPartyData();
        console.log(data)
        let assignpartyheader = `<thead>
        <tr>
            <th scope="col">Id</th>
            <th scope="col">Party Name</th>
            <th scope="col">Product Name</th>
            <th scope="col">Actions</th>
        </tr>
    </thead>
    <tbody>`
    tbl.insertAdjacentHTML("beforeend",assignpartyheader);
    data.forEach(element => {
        let html = `<tr >
        <th scope="row">${element.assignPartyId}</th>
        <td>${element.partyName}</td>
        <td>${element.productName}</td>
        <td><button id="assignpartyedit${element.assignPartyIdId}" class="btn btn-outline-success" type="submit">Edit</button>
            <button id="assignpartydelete${element.assignPartyIdId}" class="btn btn-outline-danger" type="submit" onclick="deleteData(this)">Delete</button>
        </td>
        </tr>
    </tbody>
    `
    tbl.insertAdjacentHTML("beforeend",html)
    })
    
    }
    if (id === 'navproductrate') {
        tbl.innerHTML = '';
        const data = await getProductRateData();
        console.log(data)
        let header = `<thead>
        <tr>
            <th scope="col">Id</th>
            <th scope="col">Product Name</th>
            <th scope="col">Product Rate</th>
            <th scope="col">Date</th>
            <th scope="col">Actions</th>
        </tr>
    </thead>
    <tbody>`
    tbl.insertAdjacentHTML("beforeend",header);
    data.forEach(element => {
        let html = `
        <tr>
            <th scope="row">${element.productRateId}</th>
            <td>${element.productName}</td>
            <td>${element.rate}</td>
            <td>${element.dateOfRate}</td>
            <td><button id="productrateedit${element.productRateId}" class="btn btn-outline-success" type="submit">Edit</button>
                <button id="productratedelete${element.productRateId}" class="btn btn-outline-danger" type="submit" onclick="deleteData(this)">Delete</button>
            </td>
        </tr>
    </tbody>
        `
        tbl.insertAdjacentHTML("beforeend",html)
    })
    }
    if (id === 'navinvoice') {
        tbl.innerHTML = '';
        const data = await getInvoiceData();
        let header = `<thead>
        <tr>
            <th scope="col">Id</th>
            <th scope="col">Party Name</th>
            <th scope="col">Product Name</th>
            <th scope="col">Current Rate</th>
            <th scope="col">Quantity</th>
            <th scope="col">Date</th>
            <th scope="col">Total</th>
            <th scope="col">Actions</th>
        </tr>
    </thead>
    <tbody>`
        tbl.insertAdjacentHTML("beforeend",header);
        data.forEach(element => {
           let html = ` <tr>
            <th scope="row">${element.id}</th>
            <td>${element.partyName}</td>
            <td>${element.productName}</td>
            <td>${element.currentRate}</td>
            <td>${element.quantity}</td>
            <td>${element.date}</td>
            <td>${element.currentRate * element.quantity}</td>
            <td><button id="invoiceedit${element.id}" class="btn btn-outline-success" type="submit">Edit</button>
                <button id="invoicedelete${element.id}" class="btn btn-outline-danger" type="submit" onclick="deleteData(this)">Delete</button>
            </td>
        </tr>
    </tbody>`
    tbl.insertAdjacentHTML("beforeend",html);
        })
    }
});



async function getPartyData() {
    const response = await fetch("https://localhost:7042/party")
    const data = await response.json();
    return data;
}

async function getProductData() {
    const response = await fetch("https://localhost:7042/product")
    const productdata = await response.json();
    return productdata;
}


async function getAssignPartyData() {
    const response = await fetch("https://localhost:7042/assignparty")
    const data = await response.json();
    return data;
}

async function getProductRateData(){
    const response = await fetch("https://localhost:7042/productrate")
    const data = await response.json();
    return data;
}

async function getInvoiceData(){
    const response = await fetch("https://localhost:7042/invoice")
    const data = await response.json();
    return data;
}

async function deleteData(e) {
    let id, tbl;
    if(e.id.includes("party")){
        id = e.id.slice(11);
        tbl = "party";
    }
    if(e.id.includes("product")){
        id = e.id.slice(13);
        tbl = "product";
    }
    if(e.id.includes("assignparty")){
        id = e.id.slice(17);
        tbl = "assignparty"
    }
    if(e.id.includes("productrate")){
        id = e.id.slice(17);
        tbl = "productrate";
    }
    if(e.id.includes("invoice")){
        id = e.id.slice(13);
        tbl = "invoice"
    }
    console.log(id+""+tbl)
    const response = await fetch(`https://localhost:7042/${tbl}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: null
    });
    console.log(response.status);
    location.reload();
}
