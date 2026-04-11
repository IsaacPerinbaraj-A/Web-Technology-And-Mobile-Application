document.getElementById("fname").innerText = localStorage.getItem("fname");
document.getElementById("lname").innerText = localStorage.getItem("lname");
document.getElementById("email").innerText = localStorage.getItem("email");
document.getElementById("mobile").innerText = localStorage.getItem("mobile");
document.getElementById("address").innerText = localStorage.getItem("address");

function goBack() {
localStorage.clear();
window.location.href = "register.html";
}