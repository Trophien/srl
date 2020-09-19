this.url = "http://localhost:3001/"

async function login() {
    var username = document.getElementById("inputUsername").value
    var password = document.getElementById("inputPassword").value

    var response = await fetch(`${this.url}login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify({ username: username, password: password })
    }).then(response => response.json())
    if ("error" in response) {
        this.response(response)
        document.getElementById("inputPassword").value = ""
    } else if ("success" in response) {
        window.location = "admin.html"
    }
}

async function logout() {
    await fetch(`${this.url}logout`, {
        method: "POST",
        credentials: "include"
    })
    window.location = "index.html"
}

async function getAllSeason() {
    var res = await fetch(`${this.url}season`, {
        method: "GET"
    }).then(res => res.json())
    var x = ""
    if (res.length > 0) {
        res.forEach(i=> {
            x += `
            <option value="${i.id}">${i.name}</option>
            `
        })
    }
    console.log(x)
    document.getElementById("selectOptionSeason").innerHTML += x
}