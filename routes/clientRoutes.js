const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.post('/register', clientController.register);
router.get('/', clientController.getAllClients);
router.get('/search', clientController.searchClients);
router.patch('/use-coupon/:id', clientController.updateCouponStatus);
router.delete('/delete/:id', clientController.deleteClient);

module.exports = router;