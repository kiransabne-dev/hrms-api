const express = require('express')
const router = express.Router();
const companyController = require('../app/api/controllers/companyController')

router.get('/', companyController.getAndAddCompanyInfo);
router.post('/', companyController.getAndAddCompanyInfo);

module.exports = router