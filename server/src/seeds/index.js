const mongoose = require('mongoose');
const cities = require('./cities');
const { animal, size, color, age } = require('./seedHelpers');
const Adoptable = require('../models/adoptable');

mongoose.connect('mongodb://localhost:27017/adopt', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Adoptable.deleteMany({});
    for (let i = 0; i < 20; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const pet = new Adoptable({
            author: '6117c39c6fb16225e09996db',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            image: "https://source.unsplash.com/collection/8501158",
            title: `${sample(color)} ${sample(age)} ${sample(size)} ${sample(animal)} `,
            timeStamp: Date.now(),
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum aliquam optio ut error quos molestiae eum itaque asperiores natus nemo, exercitationem deserunt vel nesciunt accusantium animi. Earum neque enim quas.',
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dbw2qcmn0/image/upload/v1629131678/Adopt/ny6vu9suksicghslztza.jpg',
                    filename: 'Adopt/ny6vu9suksicghslztza'
                },
                {
                    url: 'https://res.cloudinary.com/dbw2qcmn0/image/upload/v1629131678/Adopt/mugzslxcqxffkxnyyx1d.jpg',
                    filename: 'Adopt/mugzslxcqxffkxnyyx1d'
                }
            ]
        })
        await pet.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
});
