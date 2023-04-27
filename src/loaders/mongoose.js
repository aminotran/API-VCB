const mongoose = require('mongoose');
const { DATABASE_URL } = require('../config');

module.exports = async () => {
    try {
        await mongoose.connect(DATABASE_URL, {
            dbName: 'server-vcb',
        });
        console.log('Connect database successfully !');
    } catch (error) {
        console.error(`Connect database failure !`);
        process.exit(0);
    }
};
