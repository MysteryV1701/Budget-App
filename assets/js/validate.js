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
function validateMoney(money) {
  return money && item.value > 0 ? true : false;
}
document.querySelector(".confirm-btn").addEventListener("click", () => {
  let budgetType = document.querySelector('input[name="type"]:checked');
  let incomeType = document.querySelector("#modal-add__heading").dataset
    .addCategory;
  let head = document.querySelector("#input-heading");
  let description = document.querySelector(".input-description");
  let money = document.querySelector("#input-money");
  let income = JSON.parse(localStorage.getItem("income"));
  let cost = JSON.parse(localStorage.getItem("cost"));
  let balance =
    income.money.reduce((acc, item) => acc + item, 0) -
    cost.money.reduce((acc, item) => acc + item, 0) -
    parseInt(money.value);
  if (money <= 0) {
    alert("Money have to greater than 0$");
    return;
  } else if (balance < 0 && budgetType.value === "cost") {
    alert("The current amount of the budget is not enough");
    return;
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
