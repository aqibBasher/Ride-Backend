const router = require('express').Router();

const { verifyOtp, signup, resend, login, me } = require('../../controllers/administration/authController');
const { protect } = require('../../middlewares/protect');

router.post('/login/verify', verifyOtp);
router.post('/signup', protect, signup);
router.post('/login', login);
router.get('/me', protect, me);
router.post('/resend-email/:email', resend);

module.exports = router;