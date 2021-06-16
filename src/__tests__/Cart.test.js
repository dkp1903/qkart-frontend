
import { mount } from "enzyme";
import React from "react";
import Cart from "../components/Cart";

window.scrollTo = jest.fn();

let cartComponent = {};
let exampleProduct = {
  name: "OnePlus 6",
  category: "Phones",
  cost: 100,
  rating: 5,
  image: "https://i.imgur.com/lulqWzW.jpg",
  _id: "BW0jAAeDJmlZCF8i",
};
let exampleCartItem = {
  productId: exampleProduct._id,
  qty: 3,
};

beforeAll(() => {
  window.fetch = async (url, options) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          json: async () => {
            return new Promise((resolveNested) => {
              if (url.split("/")[url.split("/").length - 1] === "cart") {
                if (options.method.toUpperCase() === "GET") {
                  resolveNested([exampleCartItem]);
                } else if (options.method.toUpperCase() === "POST") {
                  exampleCartItem.qty = JSON.parse(options.body).qty;
                  resolveNested({ success: true });
                }
              }
            });
          },
          ok: true,
          status: 200
        });
      }, 500);
    });
  };

  cartComponent = mount(<Cart products={[exampleProduct]} />);
});

describe("Check UI for Cart component (UI)", () => {
  test("Product name exists in Cart component", async () => {
    await cartComponent.instance().refreshCart();
    expect(cartComponent.text()).toContain(exampleProduct.name);
  });

  test("Item cost is displayed correctly in Cart component", () => {
    expect(cartComponent.text()).toContain(
      exampleProduct.cost * exampleCartItem.qty
    );
  });

  test("Checkout button exists in Cart component", () => {
    expect(cartComponent.find("button").exists()).toBe(true);
  });
});

describe("Check flow for Cart component (flow)", () => {
  test("Changing quantity updates the total cost", async () => {
    await cartComponent.instance().pushToCart(exampleProduct._id, 10, false);
    expect(cartComponent.text()).toContain(exampleProduct.cost * 10);
  });

  test("Cart fetch api call changes loading state", () => {
    expect(cartComponent.state("loading")).toBe(false);
    cartComponent.instance().refreshCart();
    expect(cartComponent.state("loading")).toBe(true);
  });
});
