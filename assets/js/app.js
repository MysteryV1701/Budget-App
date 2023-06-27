let currentTransform = 0;
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
  renderBudgetItemList();
  handleRenderCategory(budgetTypeList);
  calcDisplayTotal();
}
function handleRemoveItem(budgetType, typeOfCategory, indexOf) {
  removeBudgetItemByIdOfCategory(budgetType, typeOfCategory, indexOf);
  handleRenderBudgetItemList(typeOfCategory.id, budgetType, typeOfCategory);
  handleRenderBudgetList(budgetType);
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
          Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)
        )
      : null;
  const daysPassed = calcDaysPassed(new Date(), new Date(date));
  if (daysPassed === null) return "Invalid date";
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return date;
};

const calcDisplayTotal = function () {
  let income = JSON.parse(localStorage.getItem("income"));
  let cost = JSON.parse(localStorage.getItem("cost"));
  let balance =
    income.money.reduce((acc, mov) => acc + mov, 0) -
    cost.money.reduce((acc, mov) => acc + mov, 0);
  totalMoneyApp.textContent = formatCur(balance, locale, currency);
};
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
function removeBudgetItemListByCategory(budgetType, category) {
  if (calcTotalRemoveBudgetListIncome(category) < 0) {
    alert("This budget cannot be deleted, please reconsider.");
    return;
  }
  const propertyListOfBudgetType = JSON.parse(localStorage.getItem(budgetType));
  for (let i = 0; i < propertyListOfBudgetType.type.length; i++) {
    if (propertyListOfBudgetType.type[i] === category) {
      propertyListOfBudgetType.type.splice(i, 1);
      propertyListOfBudgetType.description.splice(i, 1);
      propertyListOfBudgetType.heading.splice(i, 1);
      propertyListOfBudgetType.money.splice(i, 1);
      propertyListOfBudgetType.date.splice(i, 1);
      i--;
    }
  }
  localStorage.setItem(budgetType, JSON.stringify(propertyListOfBudgetType));
}
function removeBudgetItemByIdOfCategory(budgetType, category, id) {
  console.log(category.id);
  const propertyListOfBudgetType = JSON.parse(localStorage.getItem(budgetType));
  for (let i = 0; i < propertyListOfBudgetType.type.length; i++) {
    if (propertyListOfBudgetType.type[i] === category.id && i == id) {
      propertyListOfBudgetType.type.splice(i, 1);
      propertyListOfBudgetType.description.splice(i, 1);
      propertyListOfBudgetType.heading.splice(i, 1);
      propertyListOfBudgetType.money.splice(i, 1);
      propertyListOfBudgetType.date.splice(i, 1);
      i--;
    }
  }
  localStorage.setItem(budgetType, JSON.stringify(propertyListOfBudgetType));
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
    <img src="./assets/img/bin.jpg" class = "budget-${budgetType}__item-delete" alt=""  id="${category}">
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
    <li class="budget-item">
        <div class="${budgetType}-item__img">
            <img src=${imgPath} alt="">
        </div>
        <img src="./assets/img/bin.jpg" class = "budget-item--delete" alt=""  id="${i}">
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
      htmls.push(html);
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
function handleTooltip(category) {}
function handleRenderCategory(list) {
  budgetCategoryList.innerHTML = "";
  list.forEach((category, i) => {
    const htmls = `
    <div class="budget-type__item" onclick="showAddModal('${category[0]}')">
        <img src="./assets/img/bin.jpg" alt="" class="delete-category" id ="${i}">
        <div class="item-img-container">
            <img src=${category[1]} alt="" class="item-img">
        </div>
        <h4 class="item-heading">${category[0]}</h4>
        <div class="tooltip tooltip-top" data-id="${category[0]}">
          
        </div>
    </div>
    `;
    budgetCategoryList.insertAdjacentHTML("beforeend", htmls);
  });
  handleChangeCategory();
  budgetCategoryList.innerHTML += `
      <div class="budget-type__item" id="add-category">
          <div class="item-img-container">
              <img src="./assets/img/add.png" alt="" class="item-img">
          </div>
          <h4 class="item-heading">Others</h4>
      </div>
    `;
  document.querySelectorAll(".tooltip").forEach((item) => {
    let htmls = "";
    let totalIncomeOfCategory = 0;
    let totalCostOfCategory = 0;
    let income = JSON.parse(localStorage.getItem("income"));
    let cost = JSON.parse(localStorage.getItem("cost"));
    for (let i = 0; i < income.type.length; i++) {
      if (income.type[i] === item.dataset.id) {
        totalIncomeOfCategory += income.money[i];
      }
    }
    htmls = `
        <div class="tooltip-budget-item">
          <p class="tooltip-text-income">INCOME</p>
          <span>${formatCur(totalIncomeOfCategory, locale, currency)}</span>
        <\div>
      `;
    item.insertAdjacentHTML("beforeend", htmls);
    for (let i = 0; i < cost.type.length; i++) {
      if (cost.type[i] === item.dataset.id) {
        totalCostOfCategory += cost.money[i];
      }
    }
    htmls = `
        <div class="tooltip-budget-item">
          <p class="tooltip-text-cost">COST</p>
          <span>-${formatCur(totalCostOfCategory, locale, currency)}</span>
        <\div>
      `;
    item.insertAdjacentHTML("beforeend", htmls);
  });
  document.querySelectorAll(".delete-category").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      if (
        confirm(
          "Warning: Delete this type will delete all data related to this type! This action can't be undone! Proceed?"
        )
      ) {
        const budgetTypeList = JSON.parse(
          localStorage.getItem("defaultBudgetType")
        );
        let indexCategory = e.target.id;
        let categoryToRemove = budgetTypeList[indexCategory][0];
        budgetTypeList.splice(indexCategory, 1);
        localStorage.setItem(
          "defaultBudgetType",
          JSON.stringify(budgetTypeList)
        );
        removeBudgetItemListByCategory("income", categoryToRemove);
        removeBudgetItemListByCategory("cost", categoryToRemove);
        updateUI();
      }
    });
  });
  document.getElementById("add-category").addEventListener("click", () => {
    document
      .querySelector(".modal-category-wrapper")
      .classList.remove("hidden");
    document.querySelector(".cancel-category").onclick = () => {
      cancelCategoryModel();
    };
    document.querySelector(".create-category").onclick = () => {
      let type = document.querySelector("#input-category-name");
      let imgType = document.querySelector("#input-category-img").files[0];
      addCategory(type, imgType);
    };
  });
}

function addCategory(type, imgType) {
  const budgetTypeList = JSON.parse(localStorage.getItem("defaultBudgetType"));
  if (
    budgetTypeList.some(
      (budgetType) =>
        budgetType[0].toLowerCase().trim() === type.value.toLowerCase().trim()
    )
  ) {
    alert(
      "Budget type already exist, please choose another name for budget type!"
    );
  } else {
    budgetTypeList.push([
      type.value.toLowerCase().trim(),
      "./assets/img/unavailable.png",
    ]);
    localStorage.setItem("defaultBudgetType", JSON.stringify(budgetTypeList));
    cancelCategoryModel();
    handleRenderCategory(budgetTypeList);
  }
}
function cancelCategoryModel() {
  document.querySelector(".modal-category-wrapper").classList.add("hidden");
  document.querySelector("#input-category-name").value = "";
  document.querySelector("#input-category-img").value = "";
}

function handleChangeCategory() {
  const prevBtn = document.querySelector(".slider__btn-left");
  const newPrevBtn = prevBtn.cloneNode(true);
  prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
  const nextBtn = document.querySelector(".slider__btn-right");
  const newNextBtn = nextBtn.cloneNode(true);
  nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
  let transformMax =
    Math.ceil(
      (document.querySelectorAll(".budget-type__item").length + 1) / 6
    ) *
      100 -
    100;
  if (currentTransform <= -transformMax) {
    newNextBtn.disabled = true;
  } else {
    newNextBtn.disabled = false;
  }
  if (currentTransform == 0) {
    newPrevBtn.disabled = true;
  } else {
    newPrevBtn.disabled = false;
  }
  newNextBtn.addEventListener("click", () => {
    currentTransform -= 100;
    document.querySelector(
      ".slider__budget-type"
    ).style.transform = `translateX(${currentTransform}%)`;
    newPrevBtn.disabled = false;
    if (currentTransform <= -transformMax) newNextBtn.disabled = true;
  });
  newPrevBtn.addEventListener("click", () => {
    currentTransform += 100;
    document.querySelector(
      ".slider__budget-type"
    ).style.transform = `translateX(${currentTransform}%)`;
    newNextBtn.disabled = false;
    if (currentTransform == 0) newPrevBtn.disabled = true;
  });
}

function addBudget(budgetType, incomeType, head, description, money) {
  let date = new Date();
  const newBudgetType = JSON.parse(localStorage.getItem(budgetType));
  newBudgetType.type.push(incomeType);
  newBudgetType.description.push(description);
  newBudgetType.heading.push(head);
  newBudgetType.money.push(money);
  newBudgetType.date.push(date.toLocaleDateString(locale, options));
  localStorage.setItem(budgetType, JSON.stringify(newBudgetType));
}
