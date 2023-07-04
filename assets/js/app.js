window.onload = () => {
  if (!localStorage.getItem("defaultBudgetType")) {
    localStorage.setItem(
      "defaultBudgetType",
      JSON.stringify(defaultBudgetType)
    );
  }
  if (!localStorage.getItem("income")) {
    localStorage.setItem("income", JSON.stringify(income));
  }
  if (!localStorage.getItem("cost")) {
    localStorage.setItem("cost", JSON.stringify(cost));
  }
  updateUI();
};
function updateUI() {
  const budgetTypeList = JSON.parse(localStorage.getItem("defaultBudgetType"));
  handleRenderCategory(budgetTypeList);
  renderBudgetItemList();
  calcDisplayTotal();
}
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 1,
  }).format(value);
};
const formatBudgetDate = function (date) {
  const isDate = (date) =>
    Object.prototype.toString.call(date) === "[object Date]";
  const calcDaysPassed = (date1, date2) =>
    isDate(date1) && isDate(date2)
      ? Math.round(
          Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24)
        )
      : null;
  const daysPassed = calcDaysPassed(new Date(), new Date(date));

  // Return the appropriate string based on the number of days passed
  if (daysPassed === null) return "Invalid date";
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return date;
};
const calcDisplayTotal = function () {
  const totalMoneyApp = document.querySelector(".app__header-total");
  let income = JSON.parse(localStorage.getItem("income"));
  let cost = JSON.parse(localStorage.getItem("cost"));
  let balance =
    income.money.reduce((acc, mov) => acc + mov, 0) -
    cost.money.reduce((acc, mov) => acc + mov, 0);
  totalMoneyApp.textContent = formatCur(balance, locale, currency);
};
