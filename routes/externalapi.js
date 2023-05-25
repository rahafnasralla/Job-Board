// JavaScript source code
const axios = require('axios');
const express = require("express");
const companies = express.Router()


companies.get('/companies', async (req, res) => {
    const endpoint = 'https://api.thecompaniesapi.com/v1/companies';
    const token = 'guNBlQqB';
    const url = ${ endpoint }?token = ${ token };

    try {
        const response = await axios.get(url);
        const companiesData = response.data;
        res.json(companiesData);



    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch companies data' });
    }
});

module.exports = companies// JavaScript source code
