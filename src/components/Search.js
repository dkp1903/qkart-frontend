import { Input, message } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import { config } from "../App";
import Cart from "./Cart";
import Header from "./Header";
import Product from "./Product";
import { Row, Col } from "antd";
import Footer from "./Footer";
import "./Search.css";

/**
 * @typedef {Object} Product
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @class Search component handles the Products list page UI and functionality
 * 
 * Contains the following fields
 * @property {React.RefObject} cartRef 
 *    Reference to Cart component (to trigger certain methods within the cart component)
 * @property {number} debounceTimeout 
 *    Holds the return value from setTimeout() for the search bar debouncer
 * @property {Product[]} products 
 *    List of all the products fetched from backend
 * @property {boolean} state.loading 
 *    Indicates background action pending completion. When true, further UI actions might be blocked
 * @property {boolean} state.loggedIn 
 *    Indicated if user is logged in or not. Decides whether or not cart sidebar is shown
 * @property {Product[]} state.filteredProducts 
 *    List of products filtered by user's search query to display on website
 */
class Search extends React.Component {
  constructor() {
    super();
    // CRIO_SOLUTION_START_MODULE_CART
    this.cartRef = React.createRef();
    // CRIO_SOLUTION_END_MODULE_CART
    this.debounceTimeout = 0;
    this.products = [];
    this.state = {
      loading: false,
      loggedIn: false,
      filteredProducts: [],
    };
  }

  /**
   * Check the response of the API call to be valid and handle any failures along the way
   *
   * @param {boolean} errored
   *    Represents whether an error occurred in the process of making the API call itself
   * @param {Product[]|{ success: boolean, message: string }} response
   *    The response JSON object which may contain further success or error messages
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * If the API call itself encounters an error, errored flag will be true.
   * If the backend returns an error, then success field will be false and message field will have a string with error details to be displayed.
   * When there is an error in the API call itself, display a generic error message and return false.
   * When there is an error returned by backend, display the given message field and return false.
   * When there is no error and API call is successful, return true.
   */
  validateResponse = (errored, response) => {
    if (errored || (!response.length && !response.message)) {
      message.error(
        "Could not fetch products. Check that the backend is running, reachable and returns valid JSON."
      );
      return false;
    }

    if (!response.length) {
      message.error(response.message || "No products found in database");
      return false;
    }

    return true;
  };

  /**
   * Perform the API call over the network and return the response
   *
   * @returns {Product[]|undefined}
   *    The response JSON object
   *
   * -    Set the loading state variable to true
   * -    Perform the API call via a fetch call: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
   * -    The call must be made asynchronously using Promises or async/await
   * -    The call must handle any errors thrown from the fetch call
   * -    Parse the result as JSON
   * -    Set the loading state variable to false once the call has completed
   * -    Call the validateResponse(errored, response) function defined previously
   * -    If response passes validation, return the response object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  performAPICall = async () => {
    let response = {};
    let errored = false;

    this.setState({
      loading: true,
    });

    try {
      response = await (await fetch(`${config.endpoint}/products`)).json();
    } catch (e) {
      errored = true;
    }

    this.setState({
      loading: false,
    });

    if (this.validateResponse(errored, response)) {
      return response;
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement the getProducts() method
  /**
   * Function to fetch list of products from backend and update state variable
   * -    Call the previously defined performAPICall() function asynchronously and capture the returned value in a variable
   * -    If the returned value exists,
   *      -   Update `products` member variable with the response
   *      -   Update `filteredProducts` state variable with a clone of `products`
   */
  getProducts = async () => {
    // CRIO_SOLUTION_START_MODULE_PRODUCTS
    const response = await this.performAPICall();

    if (response) {
      this.products = response;
      this.setState({
        filteredProducts: this.products.slice(),
      });
    }
    // CRIO_SOLUTION_END_MODULE_PRODUCTS
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement a lifecycle method which uses getProducts() to fetch data and update state if user's logged in, after the component is loaded
  /**
   * Function that runs when component has loaded
   * This is the function that is called when the user lands on the Search/Products page
   * This is a good place to check and set a state flag for whether the user is logged in so we can use it for conditional rendering later on in render()
   */
  // CRIO_SOLUTION_START_MODULE_PRODUCTS
  componentDidMount() {
    this.getProducts();

    if (localStorage.getItem("username") && localStorage.getItem("token")) {
      this.setState({
        loggedIn: true,
      });
    }
  }
  // CRIO_SOLUTION_END_MODULE_PRODUCTS

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement the search() method
  /**
   * Definition for search handler
   * This is the function that is called when the user clicks on the search button or the debounce timer is executed
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * -    Update filteredProducts state to show a filtered **subset of the products class property** based on the search text
   * -    The search filtering should be done on the name and category fields of the product
   * -    The search filtering should not take in to account the letter case of the search text or name/category fields
   */
  search = (text) => {
    // CRIO_SOLUTION_START_MODULE_PRODUCTS
    this.setState({
      filteredProducts: this.products.filter(
        (product) =>
          product.name.toUpperCase().includes(text.toUpperCase()) ||
          product.category.toUpperCase().includes(text.toUpperCase())
      ),
    });
    // CRIO_SOLUTION_END_MODULE_PRODUCTS
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement the debounceSearch() method
  /**
   * Definition for debounce handler
   * This is the function that is called whenever the user types or changes the text in the searchbar field
   * We need to make sure that the search handler isn't constantly called for every key press, so we debounce the logic
   * i.e. we make sure that only after a specific amount of time passes after the final keypress (with no other keypress event happening in between), we run the required function
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * -    Obtain the search query text from the JS event object
   * -    If the debounceTimeout class property is already set, use clearTimeout to remove the timer from memory: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/clearTimeout
   * -    Call setTimeout to start a new timer that calls below defined search() method after 300ms and store the return value in the debounceTimeout class property: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
   */
  debounceSearch = (event) => {
    // CRIO_SOLUTION_START_MODULE_PRODUCTS
    const value = event.target.value;

    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = setTimeout(() => {
      this.search(value);
    }, 300);
    // CRIO_SOLUTION_END_MODULE_PRODUCTS
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement getProductElement(). If not logged in, clicking on "Add to Cart" should redirect user to the login page
  // TODO: CRIO_TASK_MODULE_CART - Update getProductElement(). If logged in, clicking on "Add to Cart" should add the product to user's cart
  /**
   * Creates the responsive view for a product item
   *
   * @param {Product} product
   * @returns {JSX}
   *    HTML and JSX to be rendered
   */
  getProductElement = (product) => {
    return (
      <Col xs={24} sm={12} xl={6} key={product._id}>
        <Product
          product={product}
          addToCart={() => {
            if (this.state.loggedIn) {
              // CRIO_SOLUTION_START_MODULE_CART
              this.cartRef.current.pushToCart(product._id, 1, true);
              // CRIO_SOLUTION_END_MODULE_CART
            }
            // CRIO_SOLUTION_START_MODULE_PRODUCTS
            else {
              this.props.history.push("/login");
            }
            // CRIO_SOLUTION_END_MODULE_PRODUCTS
          }}
        />
      </Col>
    );
  };

  /**
   * JSX and HTML goes here
   * We require a text field as the search (optionally along with a button for submitting the search query)
   * We also iterate over the filteredProducts list and display each product as a component
   * Display Cart sidebar component if user is logged in
   */
  render() {
    return (
      <>
        {/* Display Header with Search bar */}
        <Header history={this.props.history}>
          {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}

          {/* CRIO_SOLUTION_START_MODULE_PRODUCTS */}
          <Input.Search
            placeholder="Search"
            onSearch={this.search}
            onChange={this.debounceSearch}
            enterButton={true}
          />
          {/* CRIO_SOLUTION_END_MODULE_PRODUCTS */}
        </Header>

        {/* Use Antd Row/Col components to display products and cart as columns in the same row*/}
        <Row>
          {/* Display products */}
          <Col
            xs={{ span: 24 }}
            // CRIO_SOLUTION_START_MODULE_CART
            md={{ span: this.state.loggedIn && this.products.length ? 18 : 24 }}
            // CRIO_SOLUTION_END_MODULE_CART
          >
            <div className="search-container ">
              {/* Display each product item wrapped in a Col component */}
              <Row>
                {this.products.length !== 0 ? (
                  this.state.filteredProducts.map((product) =>
                    this.getProductElement(product)
                  )
                ) : this.state.loading ? (
                  <div className="loading-text">Loading products...</div>
                ) : (
                  <div className="loading-text">No products to list</div>
                )}
              </Row>
            </div>
          </Col>

          {/* Display cart */}
          {this.state.loggedIn && this.products.length && (
            <Col
              xs={{ span: 24 }}
              // CRIO_SOLUTION_START_MODULE_CART
              md={{ span: 6 }}
              // CRIO_SOLUTION_END_MODULE_CART
              className="search-cart"
            >
              <div>
                {/* TODO: CRIO_TASK_MODULE_CART - Add a Cart to the products page */}
                {/* CRIO_SOLUTION_START_MODULE_CART */}
                <Cart
                  ref={this.cartRef}
                  products={this.products}
                  history={this.props.history}
                  token={localStorage.getItem("token")}
                />
                {/* CRIO_SOLUTION_END_MODULE_CART */}
              </div>
            </Col>
          )}
        </Row>

        {/* Display the footer */}
        <Footer></Footer>
      </>
    );
  }
}

export default withRouter(Search);
