const express = require('express');
const userRoute = express.Router();
const createError = require('http-errors');

// user model
let UserModel = require('../models/User');

userRoute.route('/').get((req, res) => {
    UserModel.find((error, data) => {
     if (error) {
       return next(error)
     } else {
       res.json(data)
     }
   })
 })

 userRoute.route('/create-user').post((req, res, next) => {
    UserModel.create(req.body, (error, data) => {
    if (error) {
      let errorMsg = {errorMessage:""};
      if(error.code && error.code==11000){
        errorMsg.errorMessage = "Un compte existe dejà avec cette adresse email , veuillez saisir une autre adresse mail valide : ";

      }else{
        errorMsg.errorMessage = error;
      }
      res.json(errorMsg)
    } else {
      res.json(data)
    }
  })
});

userRoute.route('/edit-user/:id').get((req, res) => {
   UserModel.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  }) 
})

userRoute.route('/login').post((req, res) => {
  UserModel.findOne({'email': req.body.email, 'password': req.body.password}, function(err, data){
    if (err) {
      console.log("err")
      return next(err)
    } else {
      res.json(data)
    }
});
})

// Update user
userRoute.route('/update-user/:id').post((req, res, next) => {
  UserModel.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data)
      console.log('user successfully updated!')
    }
  })
})

// Delete user
userRoute.route('/delete-user/:id').delete((req, res, next) => {
  UserModel.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = userRoute;