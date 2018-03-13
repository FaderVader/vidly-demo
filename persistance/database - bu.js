const mongoose = require('mongoose').set('debug', true);

mongoose.connect('mongodb://localhost/vidly')
.then( () => console.log('Connection succesfully established.'))
.catch( err => console.error(err.message));

const genreSchema = new mongoose.Schema({
    genreName: String,
    tags: {
        type: [ String ],
        required: true,
        enum: ['children', 'family', 'adult', 'nsfw'],
        minlength: 4,
        maxlength: 255
    },
    genreId: Number
});

const Genre = mongoose.model('Genre', genreSchema);

runOperation();

async function runOperation() {
    // createGenre('Some New Shit', 'nsfw');
    // createGenre('Adult entertainment', ['nsfw', 'adult']);
    // createGenre('Science Fiction', 'family')

    const result = await getGenreCount();
    console.log('Number of records before: ', result);

    // const result = await getGenres();
    // console.log(result);

    // const result = await findGenre('Fiction');
    // console.log(result);

    // try {
    //     const result = await updateGenre(1, 'New Name');
    //     console.log('Success! ', result)
    // } catch (error) {
    //     console.log('FAIL! ', error.message);
    // };

    // try {
    //     const result = await deleteGenre(3);
    //     console.log('Result from operation: ', result);
    // } catch (error) {
    //     console.log(error.message);
    // };

};




// create genre
async function createGenre(genrename, genreTags){
    var recordCount = await getGenreCount();
    var newGenreId = recordCount+1;
    console.log('recordCount:', recordCount);
    console.log('New Genre ID: ', newGenreId);

    const genreToPersist = new Genre({
        genreName: genrename,
        tags: genreTags,
        genreId: newGenreId
    });
    const result = await genreToPersist.save();
    console.log(result);
};

// get number of records in DB
async function getGenreCount() {
    const count = await Genre
        .find()
        .count();
    return count;
};

// list genres
async function getGenres() {
    return await Genre
    .find();
};

// find genre
async function findGenre(search) {    
    const searchRegExp = new RegExp('.*' + search + '.*', "i");

    const foundGenre = await Genre
        .find({ genreName: searchRegExp }); 
    return foundGenre;
};

// update genre - works
// async function updateGenre(genreId, newGenreName) {
//     const genreFound = await Genre.findOne({genreId: genreId});
//     if (!genreFound) {
//         console.log('No result found for ID:', id);
//         return;
//     };
//     genreFound.set({genreName: newGenreName});
//     const result = await genreFound.save();   

//     return new Promise((resolve, reject) => {
//         if (!result) { reject(new Error('Failed to get a result'))};
//         resolve(result);
//     }) 
// };

// update genre - trying to get a returned result via promise
async function updateGenre(genreId, newGenreName) {
    const genreFound = await Genre.findOne({ genreId: genreId });

    if (genreFound) {
        try {
            genreFound.set({ genreName: newGenreName });
            const result = await genreFound.save();

            return new Promise((resolve, reject) => {
                resolve(result);
            });

        } catch (error) {
            console.log('Error: ', error.message);

            return new Promise((resolve, reject) => {
                reject(new Error(error.message));
            });
        };
    };
    return new Promise((resolve, reject) => {
        reject(new Error('No result found!'));
    })
};

// delete genres
async function deleteGenre(genreIdToDelete) {
    const foundGenre = await Genre
    .findOne({genreId: genreIdToDelete});

    if (foundGenre) {
        console.log('Found one: ', foundGenre._id);
        const result = await Genre.deleteOne({_id: foundGenre._id});
        return new Promise((resolve, reject) => {
            resolve(result);
        });
    }    
    return new Promise((resolve, reject) => {
        reject(new Error('No entry found at: ' + genreIdToDelete));
    });
};

module.exports = database;



