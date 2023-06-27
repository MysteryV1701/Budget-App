function resetModalMain() {
  document.querySelector("#input-heading").value = "";
  document.querySelector("#input-money").value = "";
  document.querySelector(".input-description").value = "";
  document.querySelector(".modal-add-wrapper").classList.add("hidden");
}
function validateItem(item) {
  if (item && item.value) return true;
  return false;
}
document.querySelector(".confirm-btn").addEventListener("click", () => {
  let budgetType = document.querySelector('input[name="type"]:checked');
  let incomeType = document
    .querySelector("#modal-add__heading")
    .innerText.substring(
      document.querySelector("#modal-add__heading").innerText.lastIndexOf(" ") +
        1
    )
    .toLowerCase();
  let head = document.querySelector("#input-heading");
  let description = document.querySelector(".input-description");
  let money = document.querySelector("#input-money");
  let income = JSON.parse(localStorage.getItem("income"));
  let cost = JSON.parse(localStorage.getItem("cost"));
  let balance =
    income.money.reduce((acc, mov) => acc + mov, 0) -
    cost.money.reduce((acc, mov) => acc + mov, 0) -
    parseInt(money.value);
  if (money <= 0) {
    alert("Money have to greater than 0$");
  } else if (balance < 0 && budgetType.value === "cost") {
    alert("The current amount of the budget is not enough");
  } else if (
    validateItem(budgetType) &&
    validateItem(head) &&
    validateItem(description) &&
    validateItem(money)
  ) {
    addBudget(
      budgetType.value,
      incomeType,
      head.value,
      description.value,
      parseInt(money.value)
    );
    resetModalMain();
    document.querySelector('input[name="type"]:checked').checked = false;
    updateUI();
  } else {
    alert("Please fill out all infomations!");
  }
});
