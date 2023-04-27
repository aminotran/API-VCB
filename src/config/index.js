const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.docker') });

module.exports = {
    port: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    CLIENT_KEY_ANTI_CAPTCHA: process.env.CLIENT_KEY_ANTI_CAPTCHA,
    CLIENT_KEY_TWO_CAPTCHA: process.env.CLIENT_KEY_TWO_CAPTCHA,
};