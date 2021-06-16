// CRIO_SOLUTION_START_MODULE_UNDERSTANDING_BASICS
// CRIO_SOLUTION_END_MODULE_UNDERSTANDING_BASICS
import React from "react";
import Register from '../components/Register'
import { render, unmountComponentAtNode } from "react-dom";
import { shallow, mount } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';

const fs = require('fs')

let container = null;
let registerComponent = {};


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
                      resolveNested({
                        success: true,
                        token: "testtoken",
                        username: "test123",
                      });
                    });
                  },
                  ok: true,
                  status: 200,
                });
            }, 500);
        });
    }
    registerComponent = mount(
        <BrowserRouter>
            <Register.WrappedComponent
                history={{
                    push: (value) => {
                        expect(value).toBe('/login');
                    }
                }}
            />
        </BrowserRouter>
    ).find("Register");
});


describe('Check UI for Register page component (UI)', () => {
    it('should have a username field', () => {
        expect(registerComponent.find('input[type="text"]').exists()).toBe(
            true
        );
    });

    it('should have 2 password fields (Password and Confirm Password)', () => {
        expect(registerComponent.find('input[type="password"]').length).toBe(2);
    });

    it('should have a placeholder "Password" for the Password field', () => {
        expect(registerComponent.find('input[type="password"]').get(0).props.placeholder).toBe("Password");
    });

    it('should have lock icon at start of the Password and Confirm Password fields', () => {
        expect(registerComponent.find('span.anticon.anticon-lock').length).toBe(2);
    });

    it('should have a submit button', () => {
        expect(registerComponent.find('button').exists()).toBe(true);
    });
});

describe('Check flow for Register page component (flow)', () => {
    test('Register failure flow (no input)', () => {
        registerComponent.setState({
            username: '',
            password: '',
            confirmPassword: ''
        });
        registerComponent.instance().register();
        expect(registerComponent.state('loading')).toBe(false);
    });

    test("Register failure flow (passwords don't match)", () => {
        registerComponent.setState({
            username: 'test123',
            password: 'testpass',
            confirmPassword: 'differentpassword'
        });
        registerComponent.instance().register();
        expect(registerComponent.state('loading')).toBe(false);
    });

    test('Register success flow', async () => {
        registerComponent.setState({
            username: 'test123',
            password: 'testpass',
            confirmPassword: 'testpass'
        });
        await registerComponent.instance().register();
    });

    test('Register api call changes loading state', () => {
        expect(registerComponent.state('loading')).toBe(false);
        registerComponent.setState({
            username: 'test123',
            password: 'testpass',
            confirmPassword: 'testpass'
        });
        registerComponent.instance().register();
        expect(registerComponent.state('loading')).toBe(true);
    });
});

describe('Test curl commmand in register.sh for register', () => {
    let curl;
    try {
        curl = fs.readFileSync('register.sh', 'utf8');
        // console.log(curl);    
    } catch (e) {
        console.log('Error:', e.stack);
    }

    test('Check if request is of type POST', () => {
        const postPattern = /(?<=-X\s*)POST/
        const isPOST = postPattern.test(curl);
        expect(isPOST).toBe(true);
    });

    test('Check if correct register API is called', () => {
        const postPattern = /(\w+)?:8082\/api\/v1\/auth\/register/
        const isPOST = postPattern.test(curl);
        expect(isPOST).toBe(true);
    });

    test('Content-type header is set to application/json', () => {
        const headerPattern = /(?<=-H\s*).Content-Type:\s*application\/json\s*./i;
        const isJSON = headerPattern.test(curl);
        expect(isJSON).toBe(true);
    });

})
