// CRIO_SOLUTION_START_MODULE_UNDERSTANDING_BASICS
// CRIO_SOLUTION_END_MODULE_UNDERSTANDING_BASICS
import App from '../components/Home'
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { shallow, mount } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';

let container = null;
let homeComponent = {};

beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

beforeAll(() => {
    window.matchMedia =
        window.matchMedia ||
        function () {
            return {
                matches: false,
                addListener: function () { },
                removeListener: function () { }
            };
        };

    homeComponent = mount(<BrowserRouter>
        <App />
    </BrowserRouter>);

});

describe('Check UI for Home page component (UI)', () => {
    it('should have an h1 header', () => {
        expect(homeComponent.find('h1').exists()).toBe(
            true
        );
    });

    it('should have two or three (including Browse products) buttons', () => {
        const matchArray = [2, 3]
        const numButtons = homeComponent.find('button').length
        expect(matchArray.includes(numButtons)).toBeTruthy();
    });
});

describe('Check if buttons in Home page redirects correctly', () => {
    it('should redirect to /register page on clicking Register button', () => {
        act(() => {
            render(homeComponent, container)
        });
        expect(container.querySelector("a[href='/register'] > button#register-button")).not.toBe(null)
    })

    it('should redirect to /login page on clicking Login button', () => {
        act(() => {
            render(homeComponent, container)
        });
        expect(container.querySelector("a[href='/login'] > button#login-button")).not.toBe(null)
    })
});
