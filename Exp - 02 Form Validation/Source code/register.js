document.getElementById("form").addEventListener("submit", function(e) {
  e.preventDefault();

  let fname = document.getElementById("fname").value.trim();
  let lname = document.getElementById("lname").value.trim();
  let password = document.getElementById("password").value.trim();
  let email = document.getElementById("email").value.trim();
  let mobile = document.getElementById("mobile").value.trim();
  let address = document.getElementById("address").value.trim();


  let namePattern = /^[A-Za-z]+$/;
  if (!namePattern.test(fname)) {
    alert("First Name must contain only alphabets");
    return;
  }
  if (fname.length < 6) {
    alert("First Name must be at least 6 characters");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!emailPattern.test(email)) {
    alert("Enter valid Email");
    return;
  }

  let mobilePattern = /^[0-9]{10}$/;
  if (!mobilePattern.test(mobile)) {
    alert("Mobile must be exactly 10 digits");
    return;
  }

  if (lname === "") {
    alert("Last Name cannot be empty");
    return;
  }

  if (address === "") {
    alert("Address cannot be empty");
    return;
  }

  localStorage.setItem("fname", fname);
  localStorage.setItem("lname", lname);
  localStorage.setItem("email", email);
  localStorage.setItem("mobile", mobile);
  localStorage.setItem("address", address);

  window.location.href = "success.html";
});