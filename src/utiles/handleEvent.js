const handleError = (error, req, res, next) => {
    const { statusCode, msg, e } = error;

    console.error(e);
    res.status(statusCode || 500).json({
        status: 'error',
        message: msg || error.message,
    });
};


module.exports = { handleError };
