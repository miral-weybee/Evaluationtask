const partydata = document.getElementById("partydata");
const modaloldpartyname = document.getElementById("modaloldpartyname");
const token = localStorage.getItem('token');
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
};
const options = {
    method: 'GET',
    headers: headers
};
var data, partyid;

async function loadData() {
    if(!token){
        window.location = "http://127.0.0.1:5500/Evaluationtask/index.html"
    }
    partydata.innerHTML = '';
    data = await getPartyData();

    data.forEach(element => {

        let html = `
         
        <tr>
        <th scope="row">${element.partyId}</th>
        <td>${element.partyName}</td>
        <td id="btncontainer">
            <button id="partyedit${element.partyId}" class="btn btn-outline-success" type="submit" data-bs-toggle="modal" data-bs-target="#staticBackdrop"  onclick="editParty(this.id)">Edit</button>
            <button id="partydelete${element.partyId}" class="btn btn-outline-danger" type="submit" onclick="deleteParty(this.id)">Delete</button>
        </td>
        </tr>

        `
        partydata.insertAdjacentHTML("beforeend", html);
    });
}
loadData();

async function getPartyData() {

    const response = await fetch("https://localhost:7042/party", options)
    const data = await response.json();
    return data;
}

function addDataFromModal() {
    let partyname = document.getElementById("modalnewpartyname").value;
    if (partyname.trim().length !== 0) {
        fetch("https://localhost:7042/Party", {
            method: "POST",
            body: JSON.stringify({
                partyName: partyname
            }),
            headers: headers
        })
            .then((response) => response.json())
            .then(() => location.reload());
    }
    else {
        alert("Party Name is not valid");
    }
}

async function editParty(id) {
    id = id.slice(9);
    partyid = id;
    const response = await fetch(`https://localhost:7042/Party/${id}`, options);
    data = await response.json();
    document.getElementById("modalpartyname").value = data.partyName;
}


function editDataFromModal() {
    let partyname = document.getElementById("modalpartyname").value;
    fetch(`https://localhost:7042/Party/${partyid}`, {
        method: "PUT",
        body: JSON.stringify({
            partyId: partyid,
            partyName: partyname
        }),
        headers: headers
    })
        .then(res => {
            if (res.ok) {
                $('.fade').hide();
                location.reload();
                return res.json();
            }
            throw new Error("Something went wrong");
        }) 
        .catch(error => console.log(error.body));

   
}

async function deleteParty(id) {
    id = id.slice(11);

    let ans = confirm("Are you sure you want to delete?");
    if (ans) {
        const response = await fetch(`https://localhost:7042/Party/${id}`, {
            method: 'DELETE',
            headers: headers,
            body: null
        });
        location.reload();
    }
}

