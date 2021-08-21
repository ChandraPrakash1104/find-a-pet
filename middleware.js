const { adoptableSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Adoptable = require('./models/adoptable');
const mongoose = require('mongoose');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed n');
        return res.redirect('/login');
    }
    next();
}

module.exports.validId = async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash('error', 'Entity Not Exists!');
        return res.redirect(`/adoptables`);
    }
    next();
}

module.exports.validateAdoptable = (req, res, next) => {
    const { error } = adoptableSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join('.');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const adoptable = await Adoptable.findById(id);
    if (!adoptable.author.equals(req.user._id)) {
        req.flash('error', 'Not allowed!');
        return res.redirect(`/adoptables/${id}`);

    }
    next();
}