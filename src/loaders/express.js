const express = require('express');
const routes = require('../api/routes');

module.exports = app => {
    app.use(express.json());
    routes(app);
};