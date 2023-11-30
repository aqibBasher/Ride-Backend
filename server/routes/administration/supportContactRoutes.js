const router = require('express').Router();

const { getAllSupportContacts, getOneSupportContact, updateNewState, solved, counts } = require('../../controllers/administration/supportContactController');
const { protect } = require('../../middlewares/protect');

router.get('/get-all-support-contacts', protect, getAllSupportContacts);
router.get('/get-one-support-contact/:id', protect, getOneSupportContact);
router.put('/updates/:id', protect, updateNewState);
router.put('/solved/:id', protect, solved);
router.get('/counts/:id', protect, counts);

module.exports = router;