const router = require('express').Router();
const { verifyOtp, signup, login, me,
    counts,  secondPageAgreement,
    resend, credentials, profilePicture, verifyEmail, resendEmailVerification, updateAccountDetails, sendChangeEmailVerification, sendChangePasswordVerification, verifyChangeEmail, verifyJwt, changeEmail, verifyChangePassword, changePassword, updateStamp, completeSignup, addBranch, updateBranch
} = require('../../controllers/car rental/authController');
const { protectCarRental } = require('../../middlewares/protectCarRental');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
// });

router.post('/login/verify', verifyOtp);
router.post('/signup', signup);
router.post('/complete-signup',protectCarRental, upload.array('pictures'), completeSignup);
router.post('/login', login);
router.get('/verify-jwt/:token',verifyJwt)
router.get('/login/verify-email/:user_id/:token',verifyEmail)
router.post('/change-email',changeEmail)
router.post('/change-password',changePassword)
router.post('/send-change-email-verification/:email', sendChangeEmailVerification)
router.get('/verify-change-email/:user_id/:token',verifyChangeEmail)
router.get('/verify-change-password/:user_id/:token',verifyChangePassword)
router.post('/send-change-password-verification/:email',sendChangePasswordVerification)
router.post('/edit', protectCarRental,updateAccountDetails)
router.get('/me', protectCarRental, me);
router.get('/counts', protectCarRental, counts);
// router.get('/get-all', protectCarRental, getBranches);
router.post('/add-branch', protectCarRental, addBranch);
router.post('/update-branch', protectCarRental, updateBranch);
router.post('/edit-second-page-agreement', protectCarRental, secondPageAgreement);
router.post('/resend-email/:email', resend);
router.post('/resend-email-verification/:email', resendEmailVerification);
router.post('/credentials', credentials);
router.post('/account-profile-upload', upload.single('account_photo'), protectCarRental, profilePicture);
router.post('/account-stamp-upload', upload.single('account_stamp'), protectCarRental, updateStamp);

module.exports = router;