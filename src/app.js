const express = require('express');
const loaders = require('./loaders');
const { port } = require('./config');

const app = express();
const PORT = port || 8080;

(async() => {
    await loaders(app);
    app.listen(PORT, () => {
        console.log(`Server run on port ${PORT}`);
    });
})();
