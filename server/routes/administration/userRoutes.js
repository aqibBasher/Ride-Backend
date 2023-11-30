const router = require('express').Router();

const { getAllUsers, getOneUser, updateNewState, verifyUser, editUser } = require('../../controllers/administration/userController');
const { protect } = require('../../middlewares/protect');

router.get('/get-all-users', protect, getAllUsers);
router.get('/get-one-user/:id', protect, getOneUser);
router.put('/updates/:id', protect, updateNewState);
router.put('/verify/:id', protect, verifyUser);
router.put('/edit/:id', protect, editUser);

module.exports = router;