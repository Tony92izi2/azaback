const express = require("express");
const productRoute = express.Router();
const fs = require("fs");
let multer = require("multer");

// Multer File upload settings
const DIR = "./public/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, fileName);
  },
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
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

// product model
let ProductModel = require("../models/Product");

// productRoute.route('/').get((req, res) => {
//     ProductModel.find({},null,{ skip: 3, limit: 5 },async (error, data) => {
//      if (error) {
//        return next(error)
//      } else {
//       let total =await ProductModel.countDocuments(); // count all
//       let result = {
//         total: total,
//         products: data
//       }
//       res.json(result);
//      }
//    })
//  })

// find with pagination
productRoute.route("/list/:pageId/:limit").get((req, res) => {
  let pageId = Number(req.params.pageId);
  let limit = Number(req.params.limit);
  ProductModel.find({}, null, { skip: pageId * limit - limit, limit: limit }, async (error, data) => {
    if (error) {
      return next(error);
    } else {
      let total = await ProductModel.countDocuments(); // count all
      let result = {
        total: total,
        products: data,
      };
      res.json(result);
    }
  });
});

// POST Product
productRoute.post("/create-product", upload.array("files", 3), async (req, res, next) => {
  // cpy file to vue JS assets
  // File destination.txt will be created or overwritten by default.
  // await new Promise((resolve) => setTimeout(resolve, 5000));

  let images = [req.body.image1, req.body.image2, req.body.image3];
  for (let index = 0; index < images.length; index++) {
    const image = images[index];
    if (image) {
      let image1 = "./public/" + image;
      let destination2 = "../aza-shop/src/assets/products/" + image;

      fs.copyFile(image1, destination2, (err) => {
        if (err) throw err;
        console.log("source image was copied to destination ");
        // Deleting source file
        fs.unlink(image1, (err) => {
          if (err) throw err;
          console.log(image1 + " was deleted ");
        });
      });
    }
  }

  ProductModel.create(req.body, (error, data) => {
    JSON.stringify(req.body);
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});
productRoute.route("/create-product-old").post((req, res, next) => {
  ProductModel.create(req.body, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

productRoute.route("/edit-product/:id").get((req, res) => {
  console.log("Product edition page ");
  ProductModel.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

productRoute.post("/update-product/:id", upload.array("files", 3), async (req, res, next) => {
  // cpy file to vue JS assets
  // File destination.txt will be created or overwritten by default.
  // await new Promise((resolve) => setTimeout(resolve, 5000));

  let imagesOld = [req.body.imageOld1, req.body.imageOld2, req.body.imageOld3];
  let imagesNew = [req.body.image1, req.body.image2, req.body.image3];
  for (let index = 0; index < imagesOld.length; index++) {
    const image = imagesOld[index];
    if (image) {
      let imageOld = "../aza-shop/src/assets/products/" + image;

      // Deleting old images
      fs.unlink(imageOld, (err) => {
        if (err) throw err;
        console.log(imageOld + " was deleted ");
      });

      let imageNew = "./public/" + imagesNew[index];
      let destinationNew = "../aza-shop/src/assets/products/" + imagesNew[index];
      // Moving new file
      fs.copyFile(imageNew, destinationNew, (err) => {
        if (err) throw err;
        console.log("source image was copied to destination ");
        // Deleting source file
        fs.unlink(imageNew, (err) => {
          if (err) throw err;
          console.log(imageNew + " was deleted ");
        });
      });
    }
  }

  ProductModel.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.json(data);
        console.log("product successfully updated!");
      }
    }
  );

  // ProductModel.create(req.body, (error, data) => {
  //   JSON.stringify(req.body);
  //   if (error) {
  //     return next(error);
  //   } else {
  //     res.json(data);
  //   }
  // });
});

// Delete product
productRoute.route("/delete-product/:id").delete((req, res, next) => {
  ProductModel.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data,
      });
    }
  });
});

module.exports = productRoute;
