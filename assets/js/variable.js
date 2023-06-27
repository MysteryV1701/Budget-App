const totalMoneyApp = document.querySelector(".app__header-total");
const budgetCategoryList = document.querySelector(".slider__budget-type");
const defaultBudgetType = [
  ["salary", "./assets/img/salary.png"],
  ["gift", "./assets/img/gift.png"],
  ["friend", "./assets/img/friend.png"],
  ["invoice", "./assets/img/invoice.png"],
  ["shopping", "./assets/img/shopping.png"],
];

const income = {
  type: [],
  description: [],
  heading: [],
  money: [],
  date: [],
};
const cost = {
  type: [],
  description: [],
  heading: [],
  money: [],
  date: [],
};
const currency = "USD";
const locale = "en-US";
const options = {
  weekday: "short",
  year: "numeric",
  month: "long",
  day: "numeric",
};
