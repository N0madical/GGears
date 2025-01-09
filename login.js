login = false
name = "Aiden C"

function updateLogin() {
  login = !login
  if(login) {
    document.getElementById("profileButton").src = "icons/outline.svg"
    document.getElementById("userName").textContent = name
  } else {
    document.getElementById("profileButton").src = ""
    document.getElementById("userName").textContent = ""
    document.getElementById("profileButton").src = "icons/profile.svg"
  }
}