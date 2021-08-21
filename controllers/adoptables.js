const Adoptable = require('../models/adoptable');
const { cloudinary } = require("../cloudinary")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const adoptables = await Adoptable.find({});
    res.render('adoptables/index', { adoptables })
}

module.exports.renderNewForm = (req, res) => {
    res.render('adoptables/new')
}

module.exports.createAdoptable = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.adoptable.location,
        limit: 1
    }).send()
    const adoptable = new Adoptable(req.body.adoptable);
    adoptable.geometry = geoData.body.features[0].geometry;
    adoptable.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    adoptable.author = req.user._id;
    await adoptable.save();
    req.flash('success', 'Successfull!')
    res.redirect(`/adoptables/${adoptable._id}`)

}

module.exports.showAdoptable = async (req, res) => {
    const adoptable = await Adoptable.findById(req.params.id).populate('author');
    if (!adoptable) {
        req.flash('error', 'Cannot find!');
        return res.redirect('/adoptables');
    }
    res.render('adoptables/show', { adoptable });
}
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const adoptable = await Adoptable.findById(id)
    if (!adoptable) {
        req.flash('error', 'Cannot find!');
        return res.redirect('/adoptables');
    }
    res.render('adoptables/edit', { adoptable });
}

module.exports.updateAdoptable = async (req, res) => {
    const { id } = req.params;
    const adoptable = await Adoptable.findByIdAndUpdate(id, { ...req.body.adoptable })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    adoptable.images.push(...imgs);
    await adoptable.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await adoptable.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated!');
    res.redirect(`/adoptables/${adoptable._id}`)
}

module.exports.deleteAdoptable = async (req, res) => {
    const { id } = req.params;
    await Adoptable.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted!');
    res.redirect('/adoptables')
}