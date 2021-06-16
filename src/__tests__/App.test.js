// CRIO_SOLUTION_START_MODULE_UNDERSTANDING_BASICS
// CRIO_SOLUTION_END_MODULE_UNDERSTANDING_BASICS

import { mount } from "enzyme";
import React from "react";
import { act } from "react-dom/test-utils";
import { render, unmountComponentAtNode } from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from '../App'

let container = null;
let appComponent = {};

window.scrollTo = jest.fn()

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
  // initialize the App component instance
  appComponent = mount(<BrowserRouter><App /></BrowserRouter>);
});

describe('Check routes in the App component', () => {
  it('should display Home component on visiting / path', () => {
    act(() => {
      appComponent.find('Router').props().history.push('/')
      render(appComponent, container)
    });
    expect(container.querySelector('.home-container')).not.toBe(null);
  })

  it('should display Home component on visiting any unknown path', () => {
    act(() => {
      appComponent.find('Router').props().history.push('/some-unknown-path')
      render(appComponent, container)
    });
    expect(container.querySelector('.home-container')).not.toBe(null);
  })

  it('should display Register component on visiting /register', () => {
    act(() => {
      appComponent.find('Router').props().history.push('/register')
      render(appComponent, container)
    });
    expect(container.querySelector('.register-container')).not.toBe(null);
  })

  it('should not display Home component on visiting /register', () => {
    act(() => {
      appComponent.find('Router').props().history.push('/register')
      render(appComponent, container)
    });
    expect(container.querySelector('.home-container')).toBe(null);
  })

  it('should display Login component on visiting /login', () => {
    act(() => {
      appComponent.find('Router').props().history.push('/login')
      render(appComponent, container)
    });
    expect(container.querySelector('.login-container')).not.toBe(null);
  })

  it('should not display Home component on visiting /login', () => {
    act(() => {
      appComponent.find('Router').props().history.push('/login')
      render(appComponent, container)
    });
    expect(container.querySelector('.home-container')).toBe(null);
  })
})