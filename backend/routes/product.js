// CRIO_SOLUTION_START_MODULE_UNDERSTANDING_BASICS
// CRIO_SOLUTION_END_MODULE_UNDERSTANDING_BASICS
var express = require('express');
var router = express.Router();
const { handleError, getProduct } = require('../utils');
var { products } = require('../db');

router.get('/', (req, res) => {
    console.log("Request received for retrieving products list");
    
    products.find({}, (err, docs) => {
        if (err) {
            return handleError(res, err);
        }
        return res.status(200).json(docs);
    });
});

router.get('/:id', async (req, res) => {
    console.log(`Request received for retrieving product with id: ${req.params.id}`)

    try {
        product = await getProduct(req.params.id);
    } catch (error) {
        handleError(res, error);
    }

    if (product) {
        return res.status(200).json(product);
    } else {
        return res.status(404).json();
    }
});

module.exports = router;