
import { mount } from "enzyme";
import React from "react";
import Product from "../components/Product";
import { Button, Rate } from "antd";

window.scrollTo = jest.fn()

let productComponent = {};

let exampleProduct = {
    name: "OnePlus 6",
    category: "Phones",
    cost: 100,
    rating: 5,
    image: "https://i.imgur.com/lulqWzW.jpg",
    _id: "BW0jAAeDJmlZCF8i",
};

beforeAll(() => {
    productComponent = mount(<Product product={exampleProduct} />);
});

describe("Check UI for Product component (UI)", () => {
    test("Product card contains Add to cart button", () => {
        expect(productComponent.find("button").exists()).toBe(true);
    });

    test("Product card contains product fields as text", () => {
        expect(productComponent.text()).toContain(exampleProduct.name);
        expect(productComponent.text()).toContain(exampleProduct.cost);
        expect(productComponent.text()).toContain(exampleProduct.category);
    });

    test("Product card contains product image", () => {
        expect(productComponent.find("img").prop("src")).toBe(exampleProduct.image);
    });
});

describe("Rate in Product component (UI)", () => {
    it("should be an antd component", () => {
        expect(productComponent.find(Rate).exists()).toBe(true);
    })

    it("should be read only", () => {
        expect(productComponent.find(Rate).prop('disabled')).toBe(true);
    })
})
