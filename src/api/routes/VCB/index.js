const { Router } = require('express');
const VCB = require('../../controllers/VCB.controller');
const VCBMiddleware = require('../../middlewares/VCB.middleware');

const router = Router();

router.get('/list-bank', VCB.getListBank);

router.post('/get-balance', VCBMiddleware.setToken, VCB.postGetBalance);

router.post('/get-transaction', VCBMiddleware.setToken, VCB.postGetTransaction);

router.post('/transfer-money-init', VCBMiddleware.setToken, VCB.postInitTransferMoney);

router.post('/transfer-money-confirm', VCBMiddleware.setToken, VCB.postTransferMoneyConfirm);

// router.use(handleEvent.handleError);

module.exports = router;
