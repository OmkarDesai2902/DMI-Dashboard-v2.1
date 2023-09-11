const express = require('express')
const router = express.Router()
const { getIndex, getInsertDmi, getDmi, getDmiHrms, getSessions, getLogout } = require('../controllers/htmlpages')


router.route('/').get(getIndex)
router.route('/index.html').get(getIndex)
router.route('/insertDmi.html').get(getInsertDmi)
router.route('/dmi.html').get(getDmi)
router.route('/dmi-hrms.html').get(getDmiHrms)
router.route('/checkS').get(getSessions)
router.route('/logout').get(getLogout)


module.exports = router


