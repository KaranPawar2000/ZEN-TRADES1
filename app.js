// app.js
const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.get('/', async (req, res) => {
    try {
        // Fetch JSON data from the API
        const api_url = "https://s3.amazonaws.com/open-to-cors/assignment.json";
        const response = await axios.get(api_url);
        const data = response.data;

        // Ensure data is an object with a 'products' property before sorting
        if (!data || !data.products || typeof data.products !== 'object') {
            throw new Error('Invalid data format');
        }

        // Convert the object to an array of products
        const productsArray = Object.keys(data.products).map(key => ({
            id: key,
            ...data.products[key]
        }));

        // Sort products by descending popularity
        const sortedProducts = productsArray.sort((a, b) => b.popularity - a.popularity);

        res.render('index', { products: sortedProducts });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});