const express = require('express')
const router = express.Router();
const dasboardController = require('../app/api/controllers/dashboard')

router.get('/', dasboardController.getDashboardPage)

module.exports = router