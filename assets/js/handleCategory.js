const budgetCategoryList = document.querySelector(".slider__budget-type");
function handleChangeCategory() {
  const prevBtn = document.querySelector(".slider__btn-left");
  const newPrevBtn = prevBtn.cloneNode(true);
  prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
  const nextBtn = document.querySelector(".slider__btn-right");
  const newNextBtn = nextBtn.cloneNode(true);
  nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
  const itemList = document.querySelectorAll(".budget-type__item");
  budgetCategoryList.style.transform = `translateX(0)`;
  const itemWidth = 100 / 6;
  let currentTransform = 0;
  let transformMax = Math.ceil(itemList.length - 5) * itemWidth - itemWidth;
  function updateButtonsVisibility() {
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
  }
  updateButtonsVisibility();
  newNextBtn.addEventListener("click", () => {
    currentTransform -= itemWidth * 2;
    document.querySelector(
      ".slider__budget-type"
    ).style.transform = `translateX(${currentTransform}%)`;
    updateButtonsVisibility();
  });
  newPrevBtn.addEventListener("click", () => {
    currentTransform += itemWidth * 2;

    document.querySelector(
      ".slider__budget-type"
    ).style.transform = `translateX(${currentTransform}%)`;
    updateButtonsVisibility();
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
    return;
  } else {
    if (imgType) {
      budgetTypeList.push([
        type.value.toLowerCase().trim(),
        URL.createObjectURL(imgType),
      ]);
    } else {
      budgetTypeList.push([
        type.value.toLowerCase().trim(),
        "./assets/img/unavailable.png",
      ]);
    }
    localStorage.setItem("defaultBudgetType", JSON.stringify(budgetTypeList));
    cancelCategoryModel();
    handleRenderCategory(budgetTypeList);
    document.querySelector(
      ".slider__budget-type"
    ).style.transform = `translateX(0)`;
  }
}
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

// Main function
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
  budgetCategoryList.innerHTML += `
        <div class="budget-type__item" id="add-category">
            <div class="item-img-container">
                <img src="./assets/img/add.png" alt="" class="item-img">
            </div>
            <h4 class="item-heading">Others</h4>
        </div>
      `;
  handleChangeCategory();
  // document.querySelectorAll(".tooltip").forEach((item) => {
  //   let htmls = "";
  //   let totalIncomeOfCategory = 0;
  //   let totalCostOfCategory = 0;
  //   let income = JSON.parse(localStorage.getItem("income"));
  //   let cost = JSON.parse(localStorage.getItem("cost"));
  //   for (let i = 0; i < income.type.length; i++) {
  //     if (income.type[i] === item.dataset.id) {
  //       totalIncomeOfCategory += income.money[i];
  //     }
  //   }
  //   htmls = `
  //       <div class="tooltip-budget-item">
  //         <p class="tooltip-text-income">INCOME</p>
  //         <span>${formatCur(totalIncomeOfCategory, locale, currency)}</span>
  //       <\div>
  //     `;
  //   item.insertAdjacentHTML("beforeend", htmls);
  //   for (let i = 0; i < cost.type.length; i++) {
  //     if (cost.type[i] === item.dataset.id) {
  //       totalCostOfCategory += cost.money[i];
  //     }
  //   }
  //   htmls = `
  //       <div class="tooltip-budget-item">
  //         <p class="tooltip-text-cost">COST</p>
  //         <span>-${formatCur(totalCostOfCategory, locale, currency)}</span>
  //       <\div>
  //     `;
  //   item.insertAdjacentHTML("beforeend", htmls);
  // });
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
        handleChangeCategory();
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
      updateUI();
    };
  });
}
function addBudget(budgetType, incomeType, head, description, money) {
  let date = new Date();
  const newBudgetType = JSON.parse(localStorage.getItem(budgetType));
  console.log(incomeType);
  newBudgetType.type.push(incomeType);
  newBudgetType.description.push(description);
  newBudgetType.heading.push(head);
  newBudgetType.money.push(money);
  newBudgetType.date.push(date.toLocaleDateString(locale, options));
  localStorage.setItem(budgetType, JSON.stringify(newBudgetType));
}
