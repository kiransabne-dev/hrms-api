const express = require('express')
const router = express.Router();
const employeeController = require('../app/api/controllers/employeeController')

router.get('/quickadd', employeeController.quickAddForm) //form for quick add

 module.exports = router