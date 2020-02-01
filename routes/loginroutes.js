const express = require('express')
const router = express.Router()
const loginController = require('../app/api/controllers/loginController')

router.get('/', loginController.loginForTenantProcess)
router.post('/', loginController.loginForTenantProcess)

module.exports = router