const router = require('express').Router();

const { emailLogin, googleLogin, logout, resend, verifyOtp, signup, getUser, getTermsVersion } = require('../../../controllers/webservices/xride/authController');

router.post('/EmailUserLogin', emailLogin);
router.post('/GoogleUserLogin',googleLogin)
router.post('/UserSignup', signup);
router.post('/UserLogout/:id', logout);
router.post('/SendVerificationCode/:email', resend);
router.post('/VerifyOtp', verifyOtp);
router.get('/GetUser/:id', getUser);
router.get('/GetTermsVersion', getTermsVersion);

module.exports = router;