// --- Event listeners for index.html ---
const refreshBtn = document.getElementById("refresh");
if (refreshBtn) {
    refreshBtn.addEventListener('click', fetchContacts);
}
const addContactBtn = document.getElementById("addContact");
if (addContactBtn) {
    addContactBtn.addEventListener('click', addContact);
}

// --- Event listeners for add-contact.html ---
if (window.location.pathname.includes("add-contact.html")) {
    const submitBtn = document.getElementById("submitForm");
    if (submitBtn && document.getElementById("editForm")) {
        document.getElementById("editForm").addEventListener('submit', submitForm);
    }
    const homeBtn = document.getElementById("homeLink");
    if (homeBtn) {
        homeBtn.addEventListener('click', homeLink);
    }
}

// --- Event listeners for edit-contact.html ---
if (window.location.pathname.includes("edit-contact.html")) {
    const editBtn = document.getElementById("editContact");
    if (editBtn) {
        editBtn.addEventListener('click', enableEditFields);
    }
    const deleteBtn = document.getElementById("deleteContact");
    if (deleteBtn) {
        deleteBtn.addEventListener('click', deleteContact);
    }
    const editForm = document.getElementById("editForm");
    if (editForm) {
        editForm.addEventListener('submit', submitEditForm);
    }
    const homeBtn = document.getElementById("homeLink");
    if (homeBtn) {
        homeBtn.addEventListener('click', homeLink);
    }
}

// --- Functions for index.html ---
function fetchContacts() {
    fetch(rootPath + "controller/get-contacts/")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            displayOutput(data);
        });
}

function displayOutput(data) {
    let output = "<table>";
    for (let a in data) {
        output +=
            `<tr onclick="goToEditContact(${data[a].id})">
                <td><img src="${rootPath}controller/uploads/${data[a].avatar}" width="40"/></td>
                <td><h5>${data[a].firstname}</h5></td>
                <td><h5>${data[a].lastname}</h5></td>
            </tr>`;
    }
    output += "</table>";
    const tableDiv = document.getElementById("table");
    if (tableDiv) tableDiv.innerHTML = output;
}

// Navigation function for table row click
function goToEditContact(id) {
    window.open("edit-contact.html?id=" + id, "_self");
}

function addContact() {
    window.open("add-contact.html", "_self");
}

// --- Functions for add-contact.html ---
function submitForm(e) {
    e.preventDefault();
    const form = new FormData(document.querySelector('#editForm'));
    form.append('apiKey', apiKey);

    fetch(rootPath + 'controller/insert-contact/', {
        method: 'POST',
        headers: {'Accept': 'application/json, *.*'},
        body: form
    })
    .then(function(response) {
        return response.text();
    })
    .then(function(data) {
        if (data == "1") {
            alert("Contact added.");
            homeLink();
        } else {
            alert(data);
            homeLink();
        }
    });
}

function homeLink() {
    window.open("index.html", "_self");
}

// --- Functions for edit-contact.html ---
function getId() {
    const url = window.location.href;
    const pos = url.search("=");
    return url.slice(pos + 1);
}

const id = window.location.pathname.includes("edit-contact.html") ? getId() : null;

function getContact() {
    fetch(rootPath + 'controller/get-contacts/?id=' + id)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            displayEditOutput(data);
        });
}

function displayEditOutput(data) {
    if (!data[0]) return;
    document.getElementById("avatarImage").innerHTML =
        `<img src="${rootPath}/controller/uploads/${data[0].avatar}" width="200" />`;
    document.getElementById("firstname").value = data[0].firstname;
    document.getElementById("lastname").value = data[0].lastname;
    document.getElementById("mobile").value = data[0].mobile;
    document.getElementById("email").value = data[0].email;
}

function enableEditFields() {
    document.getElementById("firstname").readOnly = false;
    document.getElementById("lastname").readOnly = false;
    document.getElementById("mobile").readOnly = false;
    document.getElementById("email").readOnly = false;
    document.getElementById("avatar").hidden = false;
    document.getElementById("submitForm").hidden = false;
    document.getElementById("avatarLabel").hidden = false;
}

function submitEditForm(e) {
    e.preventDefault();
    const form = new FormData(document.querySelector("#editForm"));
    form.append('apiKey', apiKey);
    form.append('id', id);

    fetch(rootPath + 'controller/edit-contact/', {
        method: 'POST',
        headers: {'Accept': 'application/json, *.*'},
        body: form
    })
    .then(function(response) {
        return response.text();
    })
    .then(function(data) {
        if (data == "1") {
            alert("Contact edited.");
            homeLink();
        } else {
            alert(data);
            homeLink();
        }
    });
}

function deleteContact()
{
    var confirmDelete = confirm("Delete contact. Are you sure?");

    if(confirmDelete)
    {
        fetch(rootPath + 'controller/delete-contact/?id=' + id)
        .then(function(response)
        {
            return response.text();
        })
        .then(function(data)
        {
            if(data=="1")
            {
                homeLink();
            }
            else
            {
                alert(data);
            }
        })
    }
}