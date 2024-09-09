import data from "./data.js";

const productsContainer = document.querySelector("#productsContainer");
const basketContainer = document.querySelector("#basketContainer");
const main = document.querySelector("main");
const basketCount = document.querySelector("#basketCount");
const order = document.querySelector("#order");
const modal = document.querySelector("#modal");
const modalContent = document.querySelector("#modalContent");
const modalBtn = document.querySelector("#modalBtn");
let basket = [];

function createProducts(products) {
  const html = products

    .map((pData) => {
      const isInBasket = basket.find((item) => item.id === pData.id);
      const count = isInBasket ? isInBasket.count : 0;
      return `<div class="space-y-3">
              <div class="relative">
                <figure class="size-60">
                  <img
                    class="size-full object-cover rounded-md"
                    src=${pData.image.desktop}
                    alt=""
                  />
                </figure>
                ${
                  count === 0
                    ? `<button data-id=${pData.id}
                class="flex absolute translate-x-1/2 -bottom-4 items-center border rounded-full bg-white py-1 px-3 addBtns"
              >
                <img src="./assets/images/icon-add-to-cart.svg" alt="" />
                Add to cart
              </button>`
                    : `<div  class="flex absolute translate-x-1/2 -bottom-4 items-center border rounded-full text-white bg-[#c73a0f] py-1 px-3 justify-between w-32">
              <button data-id=${pData.id} class="size-5 text-sm rounded-full border border-white flex items-center justify-center decreaseBtn">-</button>
              <span>${count}</span>
              <button data-id=${pData.id} class="size-5 rounded-full border border-white flex items-center justify-center text-sm increaseBtn">+</button>
              </div>`
                }
               
               
              </div>
              <div class="space-y-1">
                <span class="text-gray-500 text-sm">${pData.category}</span>
                <p class="font-bold">${pData.name}</p>
                <span class="text-[#c73a0f]">$${pData.price.toFixed(2)}</span>
              </div>
            </div>`;
    })
    .join("");
  productsContainer.innerHTML = html;
  getAddBasketBtn(".addBtns");
  getAddBasketBtn(".increaseBtn");
  getDecrease();
  removeProduct();
}

createProducts(data);

function getAddBasketBtn(className) {
  const addBtns = document.querySelectorAll(className);
  addBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      const id = +btn.getAttribute("data-id");
      addBasket(id);
    })
  );
}

function addBasket(productId) {
  const findById = data.find((item) => item.id === productId);
  const existingProduct = basket.find((item) => item.id === productId);

  if (existingProduct) {
    existingProduct.count += 1;
  } else {
    basket.push({ ...findById, count: 1 });
  }

  createBasketUi(basket);
  createProducts(data);
}

function createBasketUi(basketData) {
  const sum = basket.reduce((acc, next) => (acc += next.count), 0);

  basketCount.textContent = sum;
  if (sum > 0) {
    const html = basketData
      .map((bData) => {
        if (bData.count > 0) {
          order.classList.remove("hidden");
          return `  <div class="flex items-center justify-between">
        <div>
          <p class="font-bold">${bData.name}</p>
          <div>
            <span class="font-bold text-[#c73a0f]">${bData.count}x</span>
            <span>${bData.price}$</span>
            <span>${bData.price * bData.count}$</span>
          </div>
        </div>
        <button data-id=${bData.id}
          class="size-7 border border-gray-500 rounded-full flex items-center justify-center removeBtn text-sm"
        >
          x
        </button>
      </div>
      `;
        }
      })
      .join("");
    basketContainer.innerHTML = html;
  } else {
    order.classList.add("hidden");
    basketContainer.innerHTML = `<div>
            <figure class="flex items-center justify-center">
              <img
                class="size-[200px]"
                src="./assets/images/illustration-empty-cart.svg"
                alt=""
              />
            </figure>
            <p class="text-[#c73a0f] font-bold text-center">
              Your added items will be appear here
            </p>
          </div> `;
  }
}

function getDecrease() {
  const decBtns = document.querySelectorAll(".decreaseBtn");
  decBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      const id = +btn.getAttribute("data-id");
      decreaseBasket(id);
    })
  );
}

function decreaseBasket(dId) {
  const existingProduct = basket.find((item) => item.id === dId);

  if (existingProduct) {
    if (existingProduct.count > 0) {
      existingProduct.count -= 1;
    } else if (existingProduct.count === 0) {
      basket = basket.filter((item) => item.id !== dId);
    }
  }

  createBasketUi(basket);
  createProducts(data);
}

function removeProduct() {
  const removBtns = document.querySelectorAll(".removeBtn");
  removBtns.forEach((rBtn) => {
    rBtn.addEventListener("click", () => {
      const id = +rBtn.getAttribute("data-id");

      basket = basket.filter((item) => item.id !== id);
      createBasketUi(basket);
      createProducts(data);
    });
  });
}

function showModal() {
  modal.classList.replace("scale-0", "scale-100");
  main.classList.remove("before:hidden");
  createModalContent(basket);
}

function createModalContent(modalB) {
  const html = modalB
    .map((m) => {
      return ` <div class="flex justify-between items-center">
            <div class="flex items-center">
              <figure class="size-14 me-2">
                <img
                  class="size-full object-cover"
                  src=${m.image.desktop}
                  alt=""
                />
              </figure>
              <div class="flex flex-col justify-between items-center h-14">
                <p>${m.name}</p>
                <div class="self-start">
                  <span>${m.count}x</span>
                  <span>${m.price}$</span>
                </div>
              </div>
            </div>
            <div>${m.count * m.price}$</div>
          </div>`;
    })
    .join("");
  modalContent.innerHTML = html;
}

function destroyModal() {
  modal.classList.replace("scale-100", "scale-0");
  main.classList.add("before:hidden");
}

order.addEventListener("click", showModal);
modalBtn.addEventListener("click", destroyModal);
