
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {type: String,required: true},
  author: {type: String,required: true},
  publicationYear: {type: Number,required: true},
  createrId:{type: mongoose.Types.ObjectId, required: true}
});

const BookModel = mongoose.model('Book', bookSchema);

module.exports = BookModel
