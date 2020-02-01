const express = require('express')
const router = express.Router()
const designationController = require('../app/api/controllers/designationContoller')

router.get('/', designationController.getAndAddDesignation)
router.post('/', designationController.getAndAddDesignation)

module.exports = router