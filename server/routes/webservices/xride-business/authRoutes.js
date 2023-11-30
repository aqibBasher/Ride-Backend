const router = require('express').Router();

const { login, logout, resend, verifyOtp } = require('../../../controllers/webservices/xride-business/authController');

router.post('/login', login);
router.post('/logout/:id', logout);
router.post('/resend-otp/:email', resend);
router.post('/login-verification', verifyOtp);

module.exports = router;