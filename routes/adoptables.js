const express = require('express');
const router = express.Router();
const adoptables = require('../controllers/adoptables')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateAdoptable, validId } = require('../middleware');
const multer = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Adoptable = require('../models/adoptable');

router.route('/')
    .get(catchAsync(adoptables.index))
    .post(isLoggedIn, upload.array('image'), validateAdoptable, catchAsync(adoptables.createAdoptable));

router.get('/new', isLoggedIn, adoptables.renderNewForm);

router.route('/:id')
    .get(validId, catchAsync(adoptables.showAdoptable))
    .put(validId, isLoggedIn, isAuthor, upload.array('image'), validateAdoptable, catchAsync(adoptables.updateAdoptable))
    .delete(validId, isLoggedIn, isAuthor, catchAsync(adoptables.deleteAdoptable));

router.get('/:id/edit', validId, isLoggedIn, isAuthor, catchAsync(adoptables.renderEditForm))

module.exports = router;