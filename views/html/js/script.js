this.url = "http://localhost:3001/"

function response(response) {
    var header = ""
    var css = ""
    var message = ""
    if ("success" in response) {
        header = "Success"
        css = "success-modal-content"
        message = response.success
    } else if ("error" in response) {
        header = "Error"
        css = "error-modal-content"
        message = response.error
    }
    document.getElementById("response").innerHTML = `
    <div class="modal fade" id="successModal" tabindex="-1" role="dialog" aria-labelledby="errorModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content ${css}">
                <div class="modal-header">
                    <h5 class="modal-title" id="errorModalLabel">${header}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">${message}</div>
            </div>
        </div>
    </div>`
    $('#successModal').modal("show")
}

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
    if ("error" in response)
        document.getElementById("inputPassword").value = ""
    else if ("success" in response)
        window.location = "./admin/season.html"
}

function showPassword() {
    document.getElementById("inputPassword").type = "text"
}
function hidePassword() {
    document.getElementById("inputPassword").type = "password"
}

async function session(url) {
    var res = await fetch(`${this.url}session`, {
        method: "GET",
        credentials: "include"
    }).then(res => res.json())
    if ("error" in res) {
        if (url == "../index.html")
            window.location = url
        else if (url == "login.html")
            window.location = url
    } else if (url == "login.html")
        window.location = "./admin/season.html"
}

async function logout() {
    await fetch(`${this.url}logout`, {
        method: "POST",
        credentials: "include"
    })
    window.location = "../index.html"
}

async function getAllSeasonSelectOption() {
    var res = await fetch(`${this.url}seasonnotarchived`, {
        method: "GET"
    }).then(res => res.json())
    var x = ""
    if (res.length > 0) {
        res.forEach(i => {
            x += `
            <option value="${i.id}">${i.name}</option>
            `
        })
    }
    document.getElementById("selectOptionSeason").innerHTML += x
}

async function getPoints() {
    var res = await fetch(`${this.url}racerpoint`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seasonId: document.getElementById("selectOptionSeason").value })
    }).then(res => res.json())
    var x = ""
    if (res.length > 0) {
        var position = 1
        res.forEach(i => {
            x += `
                <tr>
                    <td>${position}.</td>
                    <td>${i.name}</td>
                    <td>${i.team}</td>
                    <td>${i.point}</td>
                </tr>`
            position++
        })

    } else {
        x += `<tr><td colspan="4">Még nem volt verseny</td></tr>`
    }
    document.getElementById("racerPoint").innerHTML += x

    // csapatok
    res = await fetch(`${this.url}teampoint`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seasonId: document.getElementById("selectOptionSeason").value })
    }).then(res => res.json())
    var x = ""
    if (res.length > 0) {
        var position = 1
        res.forEach(i => {
            x += `
                <tr>
                    <td>${position}.</td>
                    <td>${i.team}</td>
                    <td>${i.point}</td>
                </tr>
            `
            position++
        })

    } else {
        x += `<tr><td colspan="3">Még nem volt verseny</td></tr>`
    }
    document.getElementById("teamPoint").innerHTML += x
}

// admin
async function getAllSeasonAdmin() {
    document.getElementById("tbody").innerHTML = ""
    var res = await fetch(`${this.url}admin/season`, {
        method: "GET"
    }).then(res => res.json())
    var x = ""
    if (res.length > 0) {
        res.forEach(i => {
            x += `
            <tr>
                <td>
                    <p>${i.name}</p>
                </td>
                <td>
                    <select class="form-control" id="inputArchived${i.id}" onchange="modifyArchived('${i.id}')">`
                    if (i.archived == 1) {
                        x += `
                        <option value="1" selected>Igen</option>
                        <option value="0">Nem</option>`
                    } else {
                        x += `
                        <option value="1">Igen</option>
                        <option value="0" selected>Nem</option>`
                    }
                    x += `</select>
                </td>
                <td>
                    <button class="btn btn-warning" onclick="modifySeasonForm('${i.id}')">Módosítás</button>
                    <button class="btn btn-danger" onclick="deleteSeasonForm('${i.id}')">Törlés</button>
                </td>
            </tr>`
        })
    } else {
        x += `<tr><td colspan="3">Még nincs szezon felvéve.</td></tr>`
    }
    document.getElementById("tbody").innerHTML += x
}

async function addSeason() {
    var res = await fetch(`${this.url}admin/season`, {
        method: "POST",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: document.getElementById("inputName").value })
    }).then(res => res.json())
    this.response(res)
    if (`success` in res) {
        document.getElementById("inputName").value = ""
        setTimeout(getAllSeasonAdmin(), 500)
    } else { // BS5
        $(document).ready(function() {
            $("#insertModal").modal("show")
        })
    }
}

async function modifySeasonForm(id) {
    var res = await fetch(`${this.url}admin/season/${id}`, {
        method: "GET"
    }).then(res => res.json())
    document.getElementById("modifyForm").innerHTML = ""
    x = `
    <div class="modal fade" id="modifyModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Módosítás</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div style="padding: 2%; margin:auto">
                        <div class="form-group">
                            <input class="form-control" type="text" id="inputModifyName" placeholder="Név" value="${res.name}">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" data-dismiss="modal" onclick="modifySeason('${id}')">Módosítás</button>
                </div>
            </div>
        </div>
    </div>`
    // jQuery-t ki kell váltani - BS5
    document.getElementById("modifyForm").innerHTML = x
    $(document).ready(function() {
        $("#modifyModal").modal("show")
    })
}

async function modifySeason(id) {
    var name = document.getElementById("inputModifyName").value
    var res = await fetch(`${this.url}admin/season/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name })
    }).then(res => res.json())
    this.response(res)
    if ("success" in res) {
        document.getElementById("inputModifyName").value = ""
        setTimeout(getAllSeasonAdmin(), 500)
    } else
        modifySeasonForm(id)
}

async function modifyArchived(id) {
    var archived = document.getElementById(`inputArchived${id}`).value
    var res = await fetch(`${this.url}admin/seasonarchived/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ archived: archived })
    }).then(res => res.json())
    this.response(res)
}

async function deleteSeasonForm(id) {
    var x = ""
    x = `
    <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Írd be a jelszavad a törléshez!</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div style="padding: 2%; margin:auto">
                        <div class="form-group">
                            <div class="input-group">
                                <input type="password" class="form-control" id="inputPassword" placeholder="Jelszó">
                                <div class="input-group-append">
                                    <button class="btn btn-secondary" onmousedown="showPassword()" onmouseup="hidePassword()">
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-eye" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.134 13.134 0 0 0 1.66 2.043C4.12 11.332 5.88 12.5 8 12.5c2.12 0 3.879-1.168 5.168-2.457A13.134 13.134 0 0 0 14.828 8a13.133 13.133 0 0 0-1.66-2.043C11.879 4.668 10.119 3.5 8 3.5c-2.12 0-3.879 1.168-5.168 2.457A13.133 13.133 0 0 0 1.172 8z"/>
                                            <path fill-rule="evenodd" d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        <small id="emailHelp" class="form-text text-muted">Ez a folyamat visszavonhatatlan lesz.</small>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" data-dismiss="modal" onclick="deleteSeason('${id}')">Törlés</button>
                </div>
            </div>
        </div>
    </div>`
    // jQuery-t ki kell váltani - BS5
    document.getElementById("deleteForm").innerHTML = x
    $(document).ready(function() {
        $("#deleteModal").modal("show")
    })
}

async function deleteSeason(id) {
    var password = document.getElementById("inputPassword").value
    var res = await fetch(`${this.url}admin/season/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: password })
    }).then(res => res.json())
    this.response(res)
    if ("success" in res)
        setTimeout(getAllSeasonAdmin(), 500)
    else
        deleteSeasonForm(id)
}

// track

async function getAllTrack() {
    document.getElementById("table").classList.remove("hidden")
    var seasonId = document.getElementById("selectOptionSeason").value
    document.getElementById("tbody").innerHTML = ""
    var res = await fetch(`${this.url}admin/track/${seasonId}`, {
        method: "GET"
    }).then(res => res.json())
    var x = ""
    if (res.length > 0) {
        res.forEach(i => {
            x += `
            <tr>
                <td>
                    <p>${i.number}</p>
                </td>
                <td>
                    <p>${i.code}</p>
                </td>
                <td>
                    <p>${i.name}</p>
                </td>
                <td>
                    <button class="btn btn-warning" onclick="modifyTrackForm('${i.id}')">Módosítás</button>
                    <button class="btn btn-danger" onclick="deleteTrackForm('${i.id}')">Törlés</button>
                </td>
            </tr>
            `
        })
    } else {
        x += `<tr><td colspan="4">Még nincs verseny felvéve.</td></tr>`
    }
    document.getElementById("tbody").innerHTML += x
}

async function addTrack() {
    var res = await fetch(`${this.url}admin/track`, {
        method: "POST",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            seasonId: document.getElementById("selectOptionSeason").value,
            number: document.getElementById("inputNumber").value,
            code: document.getElementById("inputCode").value,
            name: document.getElementById("inputName").value
        })
    }).then(res => res.json())
    this.response(res)
    if ("success" in res) {
        document.getElementById("inputNumber").value = ""
        document.getElementById("inputCode").value = ""
        document.getElementById("inputName").value = ""
        setTimeout(getAllTrack(), 500)
    } else {
        $(document).ready(function() {
            $("#insertModal").modal("show")
        })
    }
}

async function modifyTrackForm(id) {
    var res = await fetch(`${this.url}admin/track/one/${id}`, {
        method: "GET"
    }).then(res => res.json())
    document.getElementById("modifyForm").innerHTML = ""
    x = `
    <div class="modal fade" id="modifyModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Módosítás</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div style="padding: 2%; margin:auto">
                        <div class="form-group">
                            <input class="form-control" type="number" min="1" max="99" maxlength="2" id="inputModifyNumber" placeholder="Sorszám" value="${res.number}">
                        </div>
                        <div class="form-group">
                            <input class="form-control" type="text" id="inputModifyCode" placeholder="Kód" value="${res.code}">
                        </div>
                        <div class="form-group">
                            <input class="form-control" type="text" id="inputModifyName" placeholder="Név" value="${res.name}">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" data-dismiss="modal" onclick="modifyTrack('${id}')">Módosítás</button>
                </div>
            </div>
        </div>
    </div>`
    // jQuery-t ki kell váltani - BS5
    document.getElementById("modifyForm").innerHTML = x
    $(document).ready(function() {
        $("#modifyModal").modal("show")
    })
}

async function modifyTrack(id) {
    var number = document.getElementById("inputModifyNumber").value
    var code = document.getElementById("inputModifyCode").value
    var name = document.getElementById("inputModifyName").value
    var res = await fetch(`${this.url}admin/track/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            number: number,
            code: code,
            name: name
        })
    }).then(res => res.json())
    this.response(res)
    if ("success" in res) {
        document.getElementById("inputModifyNumber").value = ""
        document.getElementById("inputModifyCode").value = ""
        document.getElementById("inputModifyName").value = ""
        setTimeout(getAllTrack(), 500)
    } else
        modifyTrackForm(id)
}

async function deleteTrackForm(id) {
    var x = ""
    x = `
    <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Írd be a jelszavad a törléshez!</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div style="padding: 2%; margin:auto">
                        <div class="form-group">
                            <div class="input-group">
                                <input type="password" class="form-control" id="inputPassword" placeholder="Jelszó">
                                <div class="input-group-append">
                                    <button class="btn btn-secondary" onmousedown="showPassword()" onmouseup="hidePassword()">
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-eye" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.134 13.134 0 0 0 1.66 2.043C4.12 11.332 5.88 12.5 8 12.5c2.12 0 3.879-1.168 5.168-2.457A13.134 13.134 0 0 0 14.828 8a13.133 13.133 0 0 0-1.66-2.043C11.879 4.668 10.119 3.5 8 3.5c-2.12 0-3.879 1.168-5.168 2.457A13.133 13.133 0 0 0 1.172 8z"/>
                                            <path fill-rule="evenodd" d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        <small id="emailHelp" class="form-text text-muted">Ez a folyamat visszavonhatatlan lesz.</small>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" data-dismiss="modal" onclick="deleteTrack('${id}')">Törlés</button>
                </div>
            </div>
        </div>
    </div>`
    // jQuery-t ki kell váltani - BS5
    document.getElementById("deleteForm").innerHTML = x
    $(document).ready(function() {
        $("#deleteModal").modal("show")
    })
}

async function deleteTrack(id) {
    var password = document.getElementById("inputPassword").value
    var res = await fetch(`${this.url}admin/track/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: password })
    }).then(res => res.json())
    this.response(res)
    if ("success" in res)
        setTimeout(getAllTrack(), 500)
    else
        deleteTrackForm(id)
}

// team

async function getAllTeam() {
    document.getElementById("table").classList.remove("hidden")
    var seasonId = document.getElementById("selectOptionSeason").value
    document.getElementById("tbody").innerHTML = ""
    var res = await fetch(`${this.url}admin/team/${seasonId}`, {
        method: "GET"
    }).then(res => res.json())
    var x = ""
    if (res.length > 0) {
        res.forEach(i => {
            x += `
            <tr>
                <td>
                    <p>${i.name}</p>
                </td>
                <td style="background-color: ${i.color}"></td>
                <td>
                    <button class="btn btn-warning" onclick="modifyTeamForm('${i.id}')">Módosítás</button>
                    <button class="btn btn-danger" onclick="deleteTeamForm('${i.id}')">Törlés</button>
                </td>
            </tr>
            `
        })
    } else {
        x += `<tr><td colspan="3">Még nincs csapat felvéve.</td></tr>`
    }
    document.getElementById("tbody").innerHTML += x
}

async function addTeam() {
    var res = await fetch(`${this.url}admin/team`, {
        method: "POST",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            seasonId: document.getElementById("selectOptionSeason").value,
            name: document.getElementById("inputName").value,
            color: document.getElementById("inputColor").value
        })
    }).then(res => res.json())
    this.response(res)
    if ("success" in res) {
        document.getElementById("inputName").value = ""
        document.getElementById("inputColor").value = "#000000"
        setTimeout(getAllTeam(), 500)
    } else {
        $(document).ready(function() {
            $("#insertModal").modal("show")
        })
    }
}

async function modifyTeamForm(id) {
    var res = await fetch(`${this.url}admin/team/one/${id}`, {
        method: "GET"
    }).then(res => res.json())
    document.getElementById("modifyForm").innerHTML = ""
    x = `
    <div class="modal fade" id="modifyModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Módosítás</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div style="padding: 2%; margin:auto">
                        <div class="form-group">
                            <label class="d-block-inline">Szín:</label>
                            <input class="form-control d-block-inline" type="color" id="inputModifyColor" value="${res.color}">
                        </div>
                        <div class="form-group">
                            <input class="form-control" type="text" id="inputModifyName" placeholder="Név" value="${res.name}">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" data-dismiss="modal" onclick="modifyTeam('${id}')">Módosítás</button>
                </div>
            </div>
        </div>
    </div>`
    // jQuery-t ki kell váltani - BS5
    document.getElementById("modifyForm").innerHTML = x
    $(document).ready(function() {
        $("#modifyModal").modal("show")
    })
}

async function modifyTeam(id) {
    var res = await fetch(`${this.url}admin/team/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: document.getElementById("inputModifyName").value,
            color: document.getElementById("inputModifyColor").value
        })
    }).then(res => res.json())
    this.response(res)
    if ("success" in res) {
        document.getElementById("inputModifyName").value = ""
        document.getElementById("inputModifyColor").value = "#000000"
        setTimeout(getAllTeam(), 500)
    } else
        modifyTeamForm(id)
}

async function deleteTeamForm(id) {
    var x = ""
    x = `
    <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Írd be a jelszavad a törléshez!</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div style="padding: 2%; margin:auto">
                        <div class="form-group">
                            <div class="input-group">
                                <input type="password" class="form-control" id="inputPassword" placeholder="Jelszó">
                                <div class="input-group-append">
                                    <button class="btn btn-secondary" onmousedown="showPassword()" onmouseup="hidePassword()">
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-eye" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.134 13.134 0 0 0 1.66 2.043C4.12 11.332 5.88 12.5 8 12.5c2.12 0 3.879-1.168 5.168-2.457A13.134 13.134 0 0 0 14.828 8a13.133 13.133 0 0 0-1.66-2.043C11.879 4.668 10.119 3.5 8 3.5c-2.12 0-3.879 1.168-5.168 2.457A13.133 13.133 0 0 0 1.172 8z"/>
                                            <path fill-rule="evenodd" d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        <small id="emailHelp" class="form-text text-muted">Ez a folyamat visszavonhatatlan lesz.</small>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" data-dismiss="modal" onclick="deleteTeam('${id}')">Törlés</button>
                </div>
            </div>
        </div>
    </div>`
    // jQuery-t ki kell váltani - BS5
    document.getElementById("deleteForm").innerHTML = x
    $(document).ready(function() {
        $("#deleteModal").modal("show")
    })
}

async function deleteTeam(id) {
    var password = document.getElementById("inputPassword").value
    var res = await fetch(`${this.url}admin/team/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: password })
    }).then(res => res.json())
    this.response(res)
    if ("success" in res)
        setTimeout(getAllTeam(), 500)
    else
        deleteTeamForm(id)
}

// racer

async function getAllRacer() {
    document.getElementById("table").classList.remove("hidden")
    var seasonId = document.getElementById("selectOptionSeason").value
    document.getElementById("tbody").innerHTML = ""
    var res = await fetch(`${this.url}admin/racer/${seasonId}`, {
        method: "GET"
    }).then(res => res.json())
    var x = ""
    if (res.length > 0) {
        res.forEach(i => {
            x += `
            <tr>
                <td>
                    <p>${i.rname}</p>
                </td>
                <td>
                    <p>${i.tname}</p>
                </td>
                <td>
                    <button class="btn btn-warning" onclick="modifyRacerForm('${i.rid}')">Módosítás</button>
                    <button class="btn btn-danger" onclick="deleteRacerForm('${i.rid}')">Törlés</button>
                </td>
            </tr>
            `
        })
    } else {
        x += `<tr><td colspan="3">Még nincs versenyző felvéve.</td></tr>`
    }
    document.getElementById("tbody").innerHTML += x
}

async function getAllTeamSelectOption() {
    var seasonId = document.getElementById("selectOptionSeason").value
    var res = await fetch(`${this.url}admin/team/${seasonId}`, {
        method: "GET"
    }).then(res => res.json())
    document.getElementById("selectOptionTeam").innerHTML = ""
    var x = "<option value='' disabled selected>Válassz csapatot...</option>"
    if (res.length > 0) {
        res.forEach(i => {
            x += `
            <option value="${i.id}">${i.name}</option>`
        })
    }
    document.getElementById("selectOptionTeam").innerHTML += x
}

async function addRacer() {
    var res = await fetch(`${this.url}admin/racer`, {
        method: "POST",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            seasonId: document.getElementById("selectOptionSeason").value,
            name: document.getElementById("inputName").value,
            teamId: document.getElementById("selectOptionTeam").value
        })
    }).then(res => res.json())
    this.response(res)
    if ("success" in res) {
        document.getElementById("inputName").value = ""
        setTimeout(getAllRacer(), 500)
    } else {
        $(document).ready(function() {
            $("#insertModal").modal("show")
        })
    }
}

async function getAllTeamSelectOptionModify(teamId) {
    var seasonId = document.getElementById("selectOptionSeason").value
    var res = await fetch(`${this.url}admin/team/${seasonId}`, {
        method: "GET"
    }).then(res => res.json())
    document.getElementById("selectOptionModifyTeam").innerHTML = ""
    var x = "<option disabled>Válassz csapatot...</option>"
    if (res.length > 0) {
        res.forEach(i => {
            if (i.id == teamId)
                x += `<option value="${i.id}" selected>${i.name}</option>`
            else
                x += `<option value="${i.id}">${i.name}</option>`
        })
    }
    document.getElementById("selectOptionModifyTeam").innerHTML += x
}

async function modifyRacerForm(id) {
    var res = await fetch(`${this.url}admin/racer/one/${id}`, {
        method: "GET"
    }).then(res => res.json())
    getAllTeamSelectOptionModify(res.tid)
    document.getElementById("modifyForm").innerHTML = ""
    x = `
    <div class="modal fade" id="modifyModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Módosítás</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div style="padding: 2%; margin:auto">
                        <div class="form-group">
                            <input class="form-control" type="text" id="inputModifyName" placeholder="Név" value="${res.rname}">
                        </div>
                        <div class="form-group">
                            <select class="form-control" id="selectOptionModifyTeam">
                            </select>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" data-dismiss="modal" onclick="modifyRacer('${id}')">Módosítás</button>
                </div>
            </div>
        </div>
    </div>`
    // jQuery-t ki kell váltani - BS5
    document.getElementById("modifyForm").innerHTML = x
    $(document).ready(function() {
        $("#modifyModal").modal("show")
    })
}

async function modifyRacer(id) {
    var res = await fetch(`${this.url}admin/racer/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: document.getElementById("inputModifyName").value,
            teamId: document.getElementById("selectOptionModifyTeam").value
        })
    }).then(res => res.json())
    this.response(res)
    if ("success" in res) {
        document.getElementById("inputModifyName").value = ""
        setTimeout(getAllRacer(), 500)
    } else
        modifyRacerForm(id)
}

async function deleteRacerForm(id) {
    var x = ""
    x = `
    <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Írd be a jelszavad a törléshez!</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div style="padding: 2%; margin:auto">
                        <div class="form-group">
                            <div class="input-group">
                                <input type="password" class="form-control" id="inputPassword" placeholder="Jelszó">
                                <div class="input-group-append">
                                    <button class="btn btn-secondary" onmousedown="showPassword()" onmouseup="hidePassword()">
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-eye" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.134 13.134 0 0 0 1.66 2.043C4.12 11.332 5.88 12.5 8 12.5c2.12 0 3.879-1.168 5.168-2.457A13.134 13.134 0 0 0 14.828 8a13.133 13.133 0 0 0-1.66-2.043C11.879 4.668 10.119 3.5 8 3.5c-2.12 0-3.879 1.168-5.168 2.457A13.133 13.133 0 0 0 1.172 8z"/>
                                            <path fill-rule="evenodd" d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        <small id="emailHelp" class="form-text text-muted">Ez a folyamat visszavonhatatlan lesz.</small>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" data-dismiss="modal" onclick="deleteRacer('${id}')">Törlés</button>
                </div>
            </div>
        </div>
    </div>`
    // jQuery-t ki kell váltani - BS5
    document.getElementById("deleteForm").innerHTML = x
    $(document).ready(function() {
        $("#deleteModal").modal("show")
    })
}

async function deleteRacer(id) {
    var password = document.getElementById("inputPassword").value
    var res = await fetch(`${this.url}admin/racer/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: password })
    }).then(res => res.json())
    this.response(res)
    if ("success" in res)
        setTimeout(getAllRacer(), 500)
    else
        deleteTeamForm(id)
}

// point

async function getAllTrackSelectOption() {
    var seasonId = document.getElementById("selectOptionSeason").value
    var res = await fetch(`${this.url}admin/track/${seasonId}`, {
        method: "GET"
    }).then(res => res.json())
    document.getElementById("selectOptionTrack").innerHTML = ""
    var x = "<option disabled selected>Válassz versenyt...</option>"
    if (res.length > 0) {
        res.forEach(i => {
            x += `
            <option value="${i.id}">${i.number} - ${i.name} (${i.code})</option>
            `
        })
    }
    document.getElementById("selectOptionTrack").innerHTML += x
}

async function getAllRacerSelectOption() {
    // benne van-e a ponttáblázatba?
    var seasonId = document.getElementById("selectOptionSeason").value
    var res = await fetch(`${this.url}admin/racer/${seasonId}`, {
        method: "GET"
    }).then(res => res.json())
    document.getElementById("selectOptionRacer").innerHTML = ""
    var x = "<option disabled selected>Válassz versenyzőt...</option>"
    if (res.length > 0) {
        res.forEach(i => {
            x += `
            <option value="${i.rid}">${i.rname} (${i.tname})</option>`
        })
    }
    document.getElementById("selectOptionRacer").innerHTML += x
}

async function getOnePoint() {
    document.getElementById("form").classList.remove("hidden")
    var seasonId = document.getElementById("selectOptionSeason").value
    var trackId = document.getElementById("selectOptionTrack").value
    var racerId = document.getElementById("selectOptionRacer").value
    var res = await fetch(`${this.url}admin/point/${trackId}/${racerId}`, {
        method: "GET"
    }).then(res => res.json())

    document.getElementById("racerName").innerHTML = res.rname
    getAllTeamSelectOptionModify(res.team)
    
    if (res.position != undefined && res.point != undefined) {
        document.getElementById("inputPosition").value = res.position
        document.getElementById("inputPoint").value = res.point
    }
}

function btnAddPoint() {
    if (document.getElementById("inputPosition").value != "" && document.getElementById("inputPoint").value != "")
        document.getElementById("btnAddPoint").disabled = false
    else
        document.getElementById("btnAddPoint").disabled = true
}