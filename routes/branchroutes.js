const express = require('express');
const router = express.Router();
const branchController = require('../app/api/controllers/branchController')

router.get('/', branchController.getAllBranches)
router.post('/', branchController.getAllBranches)
router.post('/getBranch', branchController.getBranchForCompany)


module.exports = router