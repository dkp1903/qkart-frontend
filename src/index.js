// CRIO_SOLUTION_START_MODULE_UNDERSTANDING_BASICS
// CRIO_SOLUTION_END_MODULE_UNDERSTANDING_BASICS
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  // TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Add Target container ID (refer public/index.html)
  // CRIO_UNCOMMENT_START_MODULE_UNDERSTANDING_BASICS
  // document.getElementById('')
  // CRIO_UNCOMMENT_END_MODULE_UNDERSTANDING_BASICS
  // CRIO_SOLUTION_START_MODULE_UNDERSTANDING_BASICS
  document.getElementById("root")
  // CRIO_SOLUTION_END_MODULE_UNDERSTANDING_BASICS
);
