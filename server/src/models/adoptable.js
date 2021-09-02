const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

ImageSchema.virtual('index').get(function () {
    return this.url.replace('/upload', '/upload/w_500,h_500,c_limit,f_auto,q_auto');
});

ImageSchema.virtual('show').get(function () {
    return this.url.replace('/upload', '/upload/w_500,h_500,c_limit/w_500,h_300,c_crop,f_auto,q_auto');
});


const opts = { toJSON: { virtuals: true } };

const AdoptableSchema = new Schema({
    title: String,
    images: [ImageSchema],
    description: String,
    location: String,
    timeStamp: Number,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, opts);


module.exports = mongoose.model('Adoptable', AdoptableSchema);