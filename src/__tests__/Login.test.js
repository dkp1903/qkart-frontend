// CRIO_SOLUTION_START_MODULE_UNDERSTANDING_BASICS
// CRIO_SOLUTION_END_MODULE_UNDERSTANDING_BASICS
import React from "react";
import Login from '../components/Login'
import { render, unmountComponentAtNode } from "react-dom";
import { shallow, mount } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';
const fs = require('fs')

let container = null;
let loginComponent = {};


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

    window.fetch = async (url, options) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    json: async () => {
                        return new Promise((resolveNested) => {
                            if (url.split("/")[url.split("/").length - 1] === "login") {
                                resolveNested({
                                    success: true,
                                    token: "testtoken",
                                    username: "test123",
                                });
                            }
                        })
                    },
                    ok: true,
                    status: 200
                })
            }, 500);
        });
    }

    loginComponent = mount(
        <BrowserRouter>
            <Login.WrappedComponent
                history={{
                    push: (value) => {
                        expect(value).toBe('/products');
                    }
                }}
            />
        </ BrowserRouter>
    ).find("Login");
})

describe('Check UI for Login page component (UI)', () => {
    test('Username field exists in Login page', () => {
        expect(loginComponent.find('input[type="text"]').exists()).toBe(true);
    });

    test('Password field exists in Login page', () => {
        expect(loginComponent.find('input[type="password"]').exists()).toBe(
            true
        );
    });

    test('Submit button exists in Login page', () => {
        expect(loginComponent.find('button').exists()).toBe(true);
    });
});


describe('Test curl commmand in login.sh for login', () => {
    let curl;
    try {
        curl = fs.readFileSync('login.sh', 'utf8');
        // console.log(curl);
    } catch (e) {
        console.log('Error:', e.stack);
    }

    test('Check if request is of type POST', () => {
        const postPattern = /(?<=-X\s*)POST/
        const isPOST = postPattern.test(curl);
        expect(isPOST).toBe(true);
    });

    test('Check if correct login API is called', () => {
        const postPattern = /(\w+)?:8082\/api\/v1\/auth\/login/
        const isPOST = postPattern.test(curl);
        expect(isPOST).toBe(true);
    });

    test('Content-type header is set to application/json', () => {
        const headerPattern = /(?<=-H\s*).Content-Type:\s*application\/json\s*./i
        const isJSON = headerPattern.test(curl);
        expect(isJSON).toBe(true);
    });

})

describe('Check flow for Login page component (flow)', () => {
    test('Login failure flow', () => {
        loginComponent.setState({
            username: '',
            password: ''
        });
        loginComponent.instance().login();
        expect(loginComponent.state('loading')).toBe(false);
    });

    test('Login success flow', async () => {
        loginComponent.setState({
            username: 'test123',
            password: 'testpass'
        });
        await loginComponent.instance().login();
        expect(localStorage.getItem('token')).toBe('testtoken');
    });

    test('Login api call changes loading state', () => {
        expect(loginComponent.state('loading')).toBe(false);
        loginComponent.setState({
            username: 'test123',
            password: 'testpass'
        });
        loginComponent.instance().login();
        expect(loginComponent.state('loading')).toBe(true);
    });
});
