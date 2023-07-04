function handlePagination(htmls) {
  document.querySelector(".modal-details__list").innerHTML = htmls.join("");
  document
    .querySelector(".modal-details__list")
    .style.setProperty("--transformValue", `0%`);
  document
    .querySelector(".modal-details__list")
    .style.setProperty(
      "--widthValue",
      `${
        Math.ceil(htmls.length / 3) * 100 > 0
          ? Math.ceil(htmls.length / 3) * 100
          : 100
      }%`
    );
  let currentTransform = 0;
  let maxWidth = 100;
  let step = 100 / Math.ceil(htmls.length / 3);
  const prevPagination = document.querySelector(".modal-pagination__left");
  const nextPagination = document.querySelector(".modal-pagination__right");
  if (currentTransform == 0) prevPagination.classList.add("disabled");
  else prevPagination.classList.remove("disabled");

  if (currentTransform == -maxWidth + Math.ceil(htmls.length / 3) * 100)
    nextPagination.classList.add("disabled");
  else nextPagination.classList.remove("disabled");
  nextPagination.onclick = (e) => {
    currentTransform -= step;
    document
      .querySelector(".modal-details__list")
      .style.setProperty("--transformValue", `${currentTransform}%`);
    if (currentTransform < 0) prevPagination.classList.remove("disabled");
    if (currentTransform <= -maxWidth + step)
      nextPagination.classList.add("disabled");
  };
  prevPagination.onclick = (e) => {
    currentTransform += step;
    document
      .querySelector(".modal-details__list")
      .style.setProperty("--transformValue", `${currentTransform}%`);
    if (currentTransform >= -maxWidth)
      nextPagination.classList.remove("disabled");
    if (currentTransform == 0) prevPagination.classList.add("disabled");
  };
}
const calcTotalRemoveBudgetListIncome = function (category) {
  let income = JSON.parse(localStorage.getItem("income"));
  let cost = JSON.parse(localStorage.getItem("cost"));
  let totalMoneyOfCategory = 0;
  for (let i = 0; i < income.type.length; i++) {
    if (income.type[i] === category) {
      totalMoneyOfCategory += income.money[i];
    }
  }
  return (
    income.money.reduce((acc, mov) => acc + mov, 0) -
    totalMoneyOfCategory -
    cost.money.reduce((acc, mov) => acc + mov, 0)
  );
};
function handleRemoveItem(budgetType, typeOfCategory, indexOf) {
  console.log(typeOfCategory);
  removeBudgetItemByIdOfCategory(budgetType, typeOfCategory, indexOf);
  let checkRemainingElement = 0;
  const propertyListOfBudgetType = JSON.parse(localStorage.getItem(budgetType));
  for (let i = 0; i < propertyListOfBudgetType.type.length; i++) {
    if (propertyListOfBudgetType.type[i] === typeOfCategory.id)
      checkRemainingElement++;
  }
  console.log(checkRemainingElement);
  if (checkRemainingElement == 0) {
    document.querySelector(".modal-details-wrapper").classList.add("hidden");
    updateUI();
  } else {
    handleRenderBudgetItemList(typeOfCategory.id, budgetType, typeOfCategory);
    updateUI();
  }
}
function handleRenderBudgetItemList(category, budgetType, budgetItem) {
  let htmls = [];
  let total = 0;
  let typeHandle = JSON.parse(localStorage.getItem(budgetType));
  const budgetTypeList = JSON.parse(localStorage.getItem("defaultBudgetType"));
  let imgPath = budgetTypeList.filter((e) => category === e[0])[0][1];
  for (let i = 0; i < typeHandle.type.length; i++) {
    if (typeHandle.type[i] === category) {
      total += parseInt(typeHandle.money[i]);
      let html = `
      <li class="budget-item " >
          <div class="${budgetType}-item__img">
              <img src=${imgPath} alt="">
          </div>
          <img src="./assets/img/bin.jpg" class = "budget-item--delete" id="${i}" >
          <div class="budget-content">
              <div class="budget-heading">
                  <span class="budget-name">${typeHandle.heading[i]}</span>
                  <span class="budget-money">
                    : ${typeHandle.money[i]}$
                  </span> 
              </div>
              <p class="budget-description">${typeHandle.description[i]}</p>
              <p class="budget-create-date">Create at: ${formatBudgetDate(
                typeHandle.date[i]
              )}</p>
          </div>
        </li>
      `;
      htmls.unshift(html);
    }
  }
  document.querySelector(".modal-details__heading").innerHTML = `
      <span class="total-money">
          ${formatCur(total, locale, currency)}
      </span> 
      <span class="modal-details__title">
        ${budgetItem.id}  ${budgetType}
      </span>
    `;
  handlePagination(htmls);
}

function removeBudgetItemByIdOfCategory(budgetType, category, id) {
  const propertyListOfBudgetType = JSON.parse(localStorage.getItem(budgetType));
  const categoryIndex = propertyListOfBudgetType.type.findIndex(
    (type, index) => type === category.id && index === parseInt(id)
  );
  if (categoryIndex !== -1) {
    propertyListOfBudgetType.type.splice(categoryIndex, 1);
    propertyListOfBudgetType.description.splice(categoryIndex, 1);
    propertyListOfBudgetType.heading.splice(categoryIndex, 1);
    propertyListOfBudgetType.date.splice(categoryIndex, 1);
    propertyListOfBudgetType.money.splice(categoryIndex, 1);
  }
  localStorage.setItem(budgetType, JSON.stringify(propertyListOfBudgetType));
}

function handleRenderBudgetList(budgetType) {
  let htmls = [];
  let typeHandle = JSON.parse(localStorage.getItem(budgetType));
  const budgetTypeList = JSON.parse(localStorage.getItem("defaultBudgetType"));
  let categories = typeHandle.type.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });
  categories.forEach((category, i) => {
    let date = typeHandle.date[typeHandle.type.indexOf(category)];
    const totalCategoryBudget = typeHandle.money.reduce((acc, mov, index) => {
      if (typeHandle.type[index] !== category) return acc;
      return acc + mov;
    }, 0);
    let match = budgetTypeList.filter((e) => category === e[0])[0];
    let imgPath = match ? match[1] : undefined;
    let formatTotal =
      budgetType === "income"
        ? formatCur(totalCategoryBudget, locale, currency)
        : `-${formatCur(totalCategoryBudget, locale, currency)}`;
    let html = `
      <li class="budget-${budgetType}__item" id = "${category}">
      <img src="./assets/img/bin.jpg" class = "budget-${budgetType}__item-delete"  id="${category}">
            <div class="${budgetType}-item__img">
              <img src=${imgPath} alt="" class="item-img">
            </div>
            <div class="${budgetType}-item__details">
                <h4 class="${budgetType}-item__heading">
                    ${category} ${budgetType}
                </h4>
                <p class="${budgetType}-item__money">${formatTotal}</p>
                <p class="${budgetType}-item__create-date">Create at: ${date}</p>
            </div>
        </li>
      `;
    htmls.push(html);
  });
  document.querySelector(`.budget-${budgetType}__list`).innerHTML =
    htmls.join("");
}
function renderBudgetItemList() {
  //Income
  handleRenderBudgetList("income");
  document
    .querySelectorAll(".budget-income__item-delete")
    .forEach((element) => {
      element.addEventListener("click", (e) => {
        e.stopPropagation();
        if (confirm("Delete this list?")) {
          removeBudgetItemListByCategory("income", e.target.id);
          renderBudgetItemList();
          calcDisplayTotal();
        }
      });
    });
  let budgetIncomeList = document.querySelectorAll(".budget-income__item");
  budgetIncomeList.forEach((budgetIncome) => {
    budgetIncome.addEventListener("click", (e) => {
      let type = budgetIncome;
      document
        .querySelector(".modal-details-wrapper")
        .classList.remove("hidden");
      handleRenderBudgetItemList(budgetIncome.id, "income", type);
      document.querySelectorAll(".budget-item--delete").forEach((element) => {
        element.addEventListener("click", (e) => {
          e.stopPropagation();
          if (confirm(`Delete this item in your budget?`)) {
            handleRemoveItem("income", type, e.target.id);
          }
        });
      });
    });
  });
  //Cost
  handleRenderBudgetList("cost");
  document.querySelectorAll(".budget-cost__item-delete").forEach((element) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm("Delete this list?")) {
        removeBudgetItemListByCategory("cost", e.target.id);
        renderBudgetItemList();
        calcDisplayTotal();
      }
    });
  });
  let budgetCostList = document.querySelectorAll(".budget-cost__item");
  budgetCostList.forEach((budgetCost) => {
    let type = budgetCost;
    budgetCost.addEventListener("click", (e) => {
      document
        .querySelector(".modal-details-wrapper")
        .classList.remove("hidden");
      handleRenderBudgetItemList(budgetCost.id, "cost", budgetCost);
      document.querySelectorAll(".budget-item--delete").forEach((element) => {
        element.addEventListener("click", (e) => {
          e.stopPropagation();
          if (confirm(`Delete this item in your budget?`)) {
            handleRemoveItem("cost", type, e.target.id);
          }
        });
      });
    });
  });
}
