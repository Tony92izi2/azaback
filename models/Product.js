const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productSchema = new Schema({
  name: {
    type: String
  },
  type: {
    type: String
  },
  price: {
    type: Number
  },
  description: {
    type: String
  },
  image1: {
    type: String
  }
}, {
  collection: 'products'
})

module.exports = mongoose.model('Product', productSchema)