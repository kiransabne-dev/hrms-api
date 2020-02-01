const express = require('express');
const router = express.Router();
const ppltitleController = require('../app/api/controllers/ppltitleController')

router.get('/', ppltitleController.getAllTitles)
router.post('/', ppltitleController.addTitleInDb)

module.exports =  router