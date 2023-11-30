const {testConnection} = require('../../controllers/database/dbController');

const router = require('express').Router()

router.get('/test', testConnection);


  module.exports = router