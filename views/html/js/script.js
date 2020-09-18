this.url = "http://localhost:3001/"

function login() {
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

function logout() {
    await fetch(`${this.url}logout`, {
        method: "POST",
        credentials: "include"
    })
    window.location = "index.html"
}