import { mount } from "enzyme";
import React from "react";

import Cart from "../components/Cart";
import Checkout from "../components/Checkout";

window.scrollTo = jest.fn();

let checkoutComponent = {};
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
let exampleAddresses = [
  {
    _id: "9sW_60WkwrT7gDPmgUdoP",
    address: "221B Baker Street, London, England",
  },
];

beforeAll(() => {
  window.matchMedia =
    window.matchMedia ||
    function () {
      return {
        matches: false,
        addListener: function () {},
        removeListener: function () {},
      };
    };
  window.fetch = async (url, options) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          json: async () => {
            return new Promise((resolveNested) => {
              if (url.split("/")[url.split("/").length - 1] === "products") {
                resolveNested([exampleProduct]);
              }
              if (url.split("/")[url.split("/").length - 1] === "cart") {
                if (options.method.toUpperCase() === "GET") {
                  resolveNested([exampleCartItem]);
                } else if (options.method.toUpperCase() === "POST") {
                  exampleCartItem.qty = JSON.parse(options.body).qty;
                  resolveNested({ success: true });
                }
              }
              if (url.split("/")[url.split("/").length - 1] === "addresses") {
                if (options.method.toUpperCase() === "GET") {
                  resolveNested(exampleAddresses);
                } else if (options.method.toUpperCase() === "POST") {
                  exampleAddresses.push({
                    _id: "vsOEnUaYuH8mEb3Qk0VXz",
                    address: JSON.parse(options.body).address,
                  });
                  resolveNested({ success: true });
                }
              }
              if (
                url.split("/")[url.split("/").length - 1] ===
                "vsOEnUaYuH8mEb3Qk0VXz"
              ) {
                exampleAddresses.splice(exampleAddresses.length - 1, 1);
                resolveNested({ success: true });
              } else {
                resolveNested({
                  success: true,
                  token: "testtoken",
                  username: "test123",
                });
              }
            });
          },
          ok: true,
          status: 200
        });
      }, 500);
    });
  };

  checkoutComponent = mount(
    <Checkout.WrappedComponent
      history={{
        push: (value) => {},
      }}
    />
  );
});

describe("Check UI for Checkout page component (UI)", () => {
  test("Cart component exists in Checkout page", async () => {
    await checkoutComponent.instance().getProducts();
    await checkoutComponent.instance().getAddresses();
    checkoutComponent.setState({
      balance: localStorage.getItem("balance"),
    });
    expect(checkoutComponent.find(Cart).exists()).toBe(true);
  });

  test("Address is displayed correctly in Checkout page", () => {
    expect(checkoutComponent.text()).toContain(exampleAddresses[0].address);
  });

  test("Add new address field exists in Checkout page", () => {
    expect(checkoutComponent.find("textarea").length).toBeGreaterThanOrEqual(1);
  });

  test("Two buttons (submit for add new address, and place order) exist in Checkout page", () => {
    expect(checkoutComponent.find("button").length).toBeGreaterThanOrEqual(2);
  });
});

describe("Check flow for Checkout page component (flow)", () => {
  const newAddress = "Yet another new address to test for";
  test("Adding new address reflects in address list", async () => {
    checkoutComponent.setState({
      newAddress: newAddress,
    });
    await checkoutComponent.instance().addAddress();
    expect(checkoutComponent.text()).toContain(newAddress);
  });

  test("Deleting an address reflects in address list", async () => {
    await checkoutComponent.instance().deleteAddress("vsOEnUaYuH8mEb3Qk0VXz");
    expect(checkoutComponent.text()).not.toContain(newAddress);
  });

  test("Checkout fetch api call changes loading state", () => {
    expect(checkoutComponent.state("loading")).toBe(false);
    checkoutComponent.instance().getAddresses();
    expect(checkoutComponent.state("loading")).toBe(true);
  });
});
