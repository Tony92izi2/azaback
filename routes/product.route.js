const express = require('express');
const productRoute = express.Router();
const fs = require('fs');
let multer = require('multer');

// Multer File upload settings
const DIR = './public/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName)
  }
});

// Multer Mime Type Validation
var upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 1024 * 1024 * 5
  // },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

// product model
let ProductModel = require('../models/Product');

productRoute.route('/').get((req, res) => {
    ProductModel.find((error, data) => {
     if (error) {
       return next(error)
     } else {
       res.json(data)
     }
   })
 })

 // POST Product
 productRoute.post('/create-product', upload.single('avatar'), (req, res, next) => {
  // cpy file to vue JS assets
  // File destination.txt will be created or overwritten by default.
  let image1 = './public/' + req.body.image1;
  let destination2 = '../azashop/src/assets/products/'  + req.body.image1;

  fs.copyFile(image1, destination2, (err) => {
    if (err) throw err;
    console.log('source image was copied to destination ');
    // Deleting source file
    fs.unlink(image1, (err) => {
      if (err) throw err;
      console.log(image1 + ' was deleted ');
    });
  });

  ProductModel.create(req.body, (error, data) => {
    JSON.stringify(req.body)
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})
 productRoute.route('/create-product-old').post((req, res, next) => {
    ProductModel.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

productRoute.route('/edit-product/:id').get((req, res) => {
   ProductModel.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Update product
// productRoute.route('/update-product/:id').post((req, res, next) => {
productRoute.post('/update-product/:id', upload.single('avatar'), (req, res, next) => {

  // let image1 = './public/' + req.body.image1;
  // let destination2 = '../azashop/src/assets/products/'  + req.body.image1;

  // fs.copyFile(image1, destination2, (err) => {
  //   if (err) throw err;
  //   console.log('source image was copied to destination ');
  // });
  
  ProductModel.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data)
      console.log('product successfully updated!')
    }
  })
})

// Delete product
productRoute.route('/delete-product/:id').delete((req, res, next) => {
  ProductModel.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = productRoute;