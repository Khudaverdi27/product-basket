import data from "./data.js"; // Adjust based on your export style

// selectors
const productsContainer = document.querySelector("#productsContainer");
const basketContainer = document.querySelector("#basket-container");
const basketCount = document.querySelector("#basketCount");

// variables
let basket = [];

// Function to create product UI
function createProducts(products) {
  const html = products
    .map((pData) => {
      const isInBasket = basket.some((item) => item.id === pData.id);
      return `<div class="space-y-3">
              <div class="relative">
                <figure class="size-60">
                  <img
                    class="size-full object-cover rounded-md"
                    src=${pData.image.desktop}
                    alt="${pData.name}"
                  />
                </figure>
               ${
                 !isInBasket
                   ? `<button data-id=${pData.id}
                  class='flex absolute translate-x-1/2 -bottom-4 items-center border rounded-full bg-white py-1 px-3 addBtn'>
                  <img src='./assets/images/icon-add-to-cart.svg' alt='' />
                  Add to cart
                </button>`
                   : `<div  class="flex absolute translate-x-1/2 -bottom-4 items-center border rounded-full text-white bg-[#c73a0f] py-1 px-3 justify-between w-32">
                    <button data-id=${pData.id} class="size-5 text-sm rounded-full border border-white flex items-center justify-center decreaseBtn">-</button>
                    <span>${pData.count}</span>
                    <button data-id=${pData.id} class="size-5 rounded-full border border-white flex items-center justify-center text-sm increaseBtn">+</button>
                    </div>`
               }
              </div>
              <div class="space-y-1">
                <span class="text-gray-500 text-sm">${pData.category}</span>
                <p class="font-bold">${pData.name}</p>
                <span class="text-[#c73a0f]">$${
                  pData.price.toString().includes(".")
                    ? pData.price
                    : pData.price + ".00"
                }</span>
              </div>
            </div>`;
    })
    .join("");
  productsContainer.innerHTML = html;
  selectCartBtns();
  increaseProduct();
  decreaseProduct();
}

createProducts(data);

// Add to basket function
function addBasket(productId) {
  const productInData = data.find((product) => product.id === productId);

  if (productInData) {
    // If the product is already in the basket, increase its count
    basket.push(productInData);
  }

  createProducts(data);
  createBasketUi(basket);
}

// Select "Add to Cart" buttons and attach event listeners
function selectCartBtns() {
  const addBtns = document.querySelectorAll(".addBtn");

  addBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = +btn.getAttribute("data-id");
      addBasket(productId);
    });
  });
}

// Increase product quantity
function increaseProduct() {
  const increaseBtns = document.querySelectorAll(".increaseBtn");
  increaseBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = +btn.getAttribute("data-id");
      const productInBasket = basket.find((item) => item.id === productId);

      if (productInBasket) {
        productInBasket.count += 1;

        createProducts(data);
        createBasketUi(basket);
      }
    });
  });
}

// Decrease product quantity
function decreaseProduct() {
  const decreaseBtns = document.querySelectorAll(".decreaseBtn");
  decreaseBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = +btn.getAttribute("data-id");
      const productInBasket = basket.find((item) => item.id === productId);

      if (productInBasket.count > 1) {
        productInBasket.count -= 1;
        createProducts(data);
        createBasketUi(basket);
      } else if (productInBasket.count === 1) {
        // Remove the product from the basket if the count is 1
        basket = basket.filter((item) => item.id !== productId);
        createProducts(data);
        createBasketUi(basket);
      }
    });
  });
}

// Create basket UI
function createBasketUi(basketData) {
  const sum = basketData.reduce((acc, next) => acc + next.count, 0);
  basketCount.textContent = sum;

  const html = basketData
    .map((basketD) => {
      return basketD.count > 0
        ? `<div class="flex items-center justify-between">
              <div>
                <p class="font-bold">${basketD.name}</p>
                <div>
                  <span class="font-bold text-[#c73a0f]">${
                    basketD.count
                  }x</span>
                  <span>${basketD.price}$</span>
                  <span>${(basketD.price * basketD.count).toFixed(2)}$</span>
                </div>
              </div>
              <button class="size-5 border border-gray-500 rounded-full flex items-center justify-center removeBtn" data-id=${
                basketD.id
              }>x</button>
            </div>`
        : "";
    })
    .join("");
  basketContainer.innerHTML = html;

  // Attach event listeners to remove buttons
  const removeBtns = document.querySelectorAll(".removeBtn");
  removeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = +btn.getAttribute("data-id");
      basket = basket.filter((item) => item.id !== productId);
      createProducts(data);
      createBasketUi(basket);
    });
  });
}
