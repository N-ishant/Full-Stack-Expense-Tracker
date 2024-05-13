const myForm = document.getElementById("my-form");
const nameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const mssg = document.querySelector(".msg");

myForm.addEventListener("submit", onSubmit);

async function onSubmit(e) {
  e.preventDefault();

  try {
    const username = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    const signupDetails = {
      username,
      email,
      password,
    };

    //Sending a POST Request to Backend
    const result = await axios.post(
      "http://localhost:8000/user/signup",
      signupDetails
    );
    console.log(result);

    nameInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";

    window.location.href = "../Login/login.html";
  } catch (error) {
    mssg.classList.add("error");
    mssg.textContent = error.response.data.message;
  }

  setTimeout(() => {
    mssg.textContent = "";
    mssg.classList.remove("error");
  }, 5000);
}