const myForm = document.getElementById("my-form");
const amountInput = document.getElementById("amount");
const descriptionInput = document.getElementById("description");
const categoryInput = document.getElementById("category");
const list = document.getElementById("list");
const premiumBtn = document.getElementById("premiumBtn");
const mssg = document.querySelector(".msg");
const mssg1 = document.querySelector(".message");

myForm.addEventListener("submit", onSubmit);

function onSubmit(e) {
  e.preventDefault();

  const amount = amountInput.value;
  const description = descriptionInput.value;
  const category = categoryInput.value;

  const expense = {
    amount,
    description,
    category,
  };

  const token = localStorage.getItem("token");
  axios
    .post("http://localhost:8000/expense/add-expense", expense, {
      headers: { Authorization: token },
    })
    .then((res) => {
      showExpenseOnScreen(res.data.newExpenseData);
      console.log(res);
    })
    .catch((error) => {
      mssg.classList.add("error");
      mssg.textContent = "Something went wrong";
      console.log(error);
    });
  setTimeout(() => {
    mssg.textContent = "";
    mssg.classList.remove("error");
  }, 3000);
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

function showPremiumUserMessage() {
  premiumBtn.style.visibility = "hidden";
  mssg1.classList.add("premium");
  mssg1.textContent = "You are a premium user ";
}

window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const decodedToken = parseJwt(token);
  console.log(decodedToken);
  const ispremiumuser = decodedToken.ispremiumuser;
  axios
    .get("http://localhost:8000/expense/get-expenses", {
      headers: { Authorization: token },
    })
    .then((res) => {
      console.log(res);

      if (ispremiumuser) {
        showPremiumUserMessage();
        showLeaderboard();
        adjustExpenceMargin(true);
      } else {
        adjustExpenceMargin(false);
      }

      for (var i = 0; i < res.data.allExpenses.length; i++) {
        showExpenseOnScreen(res.data.allExpenses[i]);
      }
    })
    .catch((error) => {
      mssg.classList.add("error");
      mssg.textContent = "Internal Server Error. Please try again later.";
      console.log(error);
    });
  setTimeout(() => {
    mssg.textContent = "";
    mssg.classList.remove("error");
  }, 3000);
});

function showExpenseOnScreen(expense) {
  const li = document.createElement("li");
  const details = document.createTextNode(
    `${expense.amount} : ${expense.description} : ${expense.category} `
  );

  // DELETE BUTTON
  const deleteBtn = document.createElement("input");
  deleteBtn.type = "button";
  deleteBtn.value = "Delete Expense";
  deleteBtn.style.color = "white";
  deleteBtn.style.backgroundColor = "Red";

  deleteBtn.onclick = () => {
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:8000/expense/delete-expense/${expense.id}`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        console.log("Expense deleted successfully");
        list.removeChild(li);
      })
      .catch((error) => {
        mssg.classList.add("error");
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          mssg.textContent = error.response.data.message;
        } else {
          mssg.textContent =
            "Oops! Something went wrong. Please try again later.";
        }
        console.log(error);
      });
    setTimeout(() => {
      mssg.textContent = "";
      mssg.classList.remove("error");
    }, 3000);
  };

  li.appendChild(details);
  li.appendChild(deleteBtn);
  list.appendChild(li);

  // Clear Fields
  amountInput.value = "";
  descriptionInput.value = "";
  categoryInput.value = "";
}

function showLeaderboard() {
  const leaderboardButton = document.createElement("input");
  leaderboardButton.type = "button";
  leaderboardButton.value = "Show Leaderboard";

  leaderboardButton.onclick = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8000/premium/showLeaderBoard", {
        headers: { Authorization: token },
      })
      .then((res) => {
        console.log(res.data);
        var leaderboardElem = document.querySelector(".list-group");
        leaderboardElem.innerHTML += "<h1>Leader Board</h1>";
        res.data.leaderboardOfUsers.forEach((userDetails) => {
          console.log(userDetails);
          leaderboardElem.innerHTML += `<li class="list-group-item">Name - ${userDetails.username} Total Expense - ${userDetails.totalExpenses} </li>`;
        });
        leaderboardElem.style.display = "block";
      })
      .catch((error) => {
        console.error("Error fetching leaderboard:", error);
      });
  };
  document.querySelector(".leaderboardBtn").appendChild(leaderboardButton);
  adjustExpenceMargin(true);
}

function adjustExpenceMargin(hasMargin) {
  const expenceDiv = document.querySelector(".expence");
  if (hasMargin) {
    expenceDiv.style.marginTop = "-25px";
  } else {
    expenceDiv.style.marginTop = "20px";
  }
}

premiumBtn.onclick = function (e) {
  const token = localStorage.getItem("token");
  axios
    .get("http://localhost:8000/purchase/premium-membership", {
      headers: { Authorization: token },
    })
    .then((res) => {
      console.log(res);
      var options = {
        key: res.data.key_id,
        order_id: res.data.result.orderid,
        handler: function (response) {
          axios
            .post(
              "http://localhost:8000/purchase/update-transactionStatus",
              {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
              },
              { headers: { Authorization: token } }
            )
            .then(function (res) {
              console.log(res);
              alert("You are a Premium User Now");
              showPremiumUserMessage();
              localStorage.setItem("token", res.data.token);
              showLeaderboard();
            })
            .catch(function (error) {
              console.error(error);
            });
        },
      };
      const rzp1 = new Razorpay(options);
      rzp1.open();
      e.preventDefault();

      rzp1.on("payment.failed", function (response) {
        console.log(response);
        alert("TRANSACTION FAILED");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};