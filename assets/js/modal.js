function showAddModal(type) {
  document.querySelector(
    ".modal-add__heading"
  ).innerHTML = `Create new: ${type}`;
  document.querySelector(".modal-add__heading").dataset.addCategory = `${type}`;
  document.querySelector(".modal-add-wrapper").classList.remove("hidden");
}
document.querySelector(".close-btn").addEventListener("click", () => {
  document.querySelector(".modal-details-wrapper").classList.add("hidden");
});
document.querySelector(".cancel-btn").addEventListener("click", () => {
  resetModalMain();
});

function cancelCategoryModel() {
  document.querySelector(".modal-category-wrapper").classList.add("hidden");
  document.querySelector("#input-category-name").value = "";
  document.querySelector("#input-category-img").value = "";
}
