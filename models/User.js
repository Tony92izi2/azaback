const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
  nom: {
    type: String
  },
  prenom: {
    type: String
  },
  email: {
    type: String, required: true, index: true, unique: true
  },
  password: {
    type: String
  },
  phone: {
    type: Number
  },
  adresse: {
    type: String
  }
}, {
  collection: 'users'
})

const Users = mongoose.model('User', userSchema);
Users.createIndexes();

module.exports = Users;