const myForm = document.getElementById("my-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const mssg = document.querySelector(".msg");

myForm.addEventListener("submit", onSubmit);

async function onSubmit(e) {
  e.preventDefault();

  try {
    const email = emailInput.value;
    const password = passwordInput.value;

    const loginDetails = {
      email,
      password,
    };

    //Sending a POST Request to Backend
    const result = await axios.post(
      "http://localhost:8000/user/login",
      loginDetails
    );

    alert(result.data.message);
    console.log(result.data);

    emailInput.value = "";
    passwordInput.value = "";

    localStorage.setItem("token", result.data.token);
    window.location.href = "../Expense/expense.html";
  } catch (error) {
    console.log(JSON.stringify(error));
    mssg.classList.add("error");
    mssg.textContent = error.response.data.message;
  }

  setTimeout(() => {
    mssg.textContent = "";
    mssg.classList.remove("error");
  }, 3000);
}