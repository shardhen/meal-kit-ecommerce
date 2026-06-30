const mealkitUtil = require("../modules/mealkit-util");
const express = require('express');
const router = express.Router();
const mealkitModel = require("../models/mealkitModel");
const path = require("path");
const fs = require("fs");

router.get("/", (req, res) => {
    mealkitModel.find()
        .then(mealkits => {
            res.render("mealkits/on-the-menu", {
                allMealKits: mealkits,
                title: "On The Menu"
            });
        })  
        .catch(err => {
            console.log(err);
            res.status(500).render("error", { 
                statusCode: 500, 
                title: "Error", 
                message: "Could not retrieve the data."
            });
        });
});

router.get("/list", (req, res) => {

    if (req.session.user && req.session.user.role === "clerk") {
        mealkitModel.find()
            .then(mealkits => {
                res.render("mealkits/list", {
                    title: "List",
                    mealKits: mealkits
                });
            })
            .catch(err => {
                res.render("error", {
                    title: "Error",
                    statusCode: 500
                });
            });
    } else {
        res.render("error", {
            title: "Unauthorized",
            statusCode: 401
        });
    }
});


router.get("/add", (req, res) => {
    if (req.session.user && req.session.user.role === "clerk") {
        res.render("mealkits/add", { 
            title: "Add Meal Kit",
            values: {}, 
            errors: {}  
        });
    } else {
        res.status(401).render("error", { title: "Unauthorized", statusCode: 401 });
    }
});

router.post("/add", (req, res) => {
    if (req.session.user && req.session.user.role === "clerk") {
        const { title, includes, description, category, price, cookingTime, servings } = req.body;
        
        const newMealKit = new mealkitModel({
            title,
            includes,
            description,
            category,
            price: parseFloat(price),
            cookingTime: parseInt(cookingTime),
            servings: parseInt(servings),
            featuredMealKit: req.body.featuredMealKit ? true : false
        });

        if (req.files && req.files.imageUrl) {
            const imageFile = req.files.imageUrl;
            const imageName = Date.now() + "-" + imageFile.name;
            const uploadPath = path.join(__dirname, "../public/images/uploads/", imageName);
             
            
            // I applied the basic file upload logic if data is successfully saved, redirect the user to the list page
            // Reference: https://github.com/richardgirges/express-fileupload/tree/master/example
            imageFile.mv(uploadPath, (err) => {
             if (err) return res.status(500).send(err);
                
            newMealKit.imageUrl = "/images/uploads/" + imageName;
            newMealKit.save()
                   .then(() => res.redirect("/mealkits/list"))
                  .catch(err => res.render("mealkits/add", { values: req.body, errors: err.errors }));
        });
        } else {
            newMealKit.save()
            .then(() => res.redirect("/mealkits/list"))
            .catch(err => res.render("mealkits/add", { values: req.body, errors: err.errors }));
        }
    }
});

router.post("/add", (req, res) => {
    if (req.session.user && req.session.user.role == "clerk") {
        let { title, includes, description, category, price, cookingTime, servings } = req.body;
        let featured = req.body.featuredMealKit ? true : false;

        if (!req.files || !req.files.imageUrl) {
            return res.render("mealkits/add", { title: "Add Meal Kit", error: "Photo is required.", values: req.body, errors: {} });
        }

        const imageFile = req.files.imageUrl;
        const extension = path.extname(imageFile.name).toLowerCase(); 

        if (extension == ".jpg" || extension == ".jpeg" || extension == ".gif" || extension == ".png") {
            const imageName = Date.now() + extension;
            const uploadPath = path.join(__dirname, "../public/images/uploads/", imageName);

            imageFile.mv(uploadPath).then(() => {
                return mealkitModel.create({
                    title, includes, description, category,
                    price: parseFloat(price).toFixed(2),
                    cookingTime: parseInt(cookingTime),
                    servings: parseInt(servings),
                    imageUrl: "/images/uploads/" + imageName,
                    featuredMealKit: featured
            });
        }).then(() => {
            res.redirect("/mealkits/list");
         }).catch(err => res.send("Error saving: " + err));
     } else {
          res.render("mealkits/add", { title: "Add Meal Kit", error: "Invalid file type.", values: req.body, errors: {} });
     }
    }
});

router.get("/edit/:id", (req, res) => {
    if (req.session.user && req.session.user.role == "clerk") {
        mealkitModel.findById(req.params.id)
            .then(meal => {
                if (meal) {
        
                 res.render("mealkits/edit", { 
                     title: "Edit Meal Kit", 
                     mealKit: meal, 
                     errors: {}     
                  });
            } else {
                res.status(404).render("error", { title: "Not Found", statusCode: 404, message: "Meal kit not found." });
             }
        })
         .catch(err => {
              res.status(500).render("error", { title: "Error", statusCode: 500 });
         });
    } else {
        res.status(401).render("error", { title: "Access Denied", statusCode: 401, message: "Unauthorized." });
    }
});


router.post("/edit/:id", (req, res) => {

    if (req.session.user && req.session.user.role === "clerk") {

        const { title, includes, description, category, price, cookingTime, servings } = req.body;
        const isFeatured = req.body.featuredMealKit ? true : false;

        mealkitModel.findById(req.params.id)
            .then(mealKit => {
                if (!mealKit) {
                    return res.status(404).render("error", { title: "Not Found", statusCode: 404 });
                }

                mealKit.title = title;
                mealKit.includes = includes;
                mealKit.description = description;
                mealKit.category = category;
                mealKit.price = parseFloat(price);
                mealKit.cookingTime = parseInt(cookingTime);
                mealKit.servings = parseInt(servings);
                mealKit.featuredMealKit = isFeatured;

                if (req.files && req.files.imageUrl) {
                    const imageFile = req.files.imageUrl;
                    const imageName = Date.now() + "-" + imageFile.name;
                    const uploadPath = path.join(__dirname, "../public/images/uploads/", imageName);


                    // I applied the basic file upload logic if data is successfully saved, redirect the user to the list page
                    // Reference: https://github.com/richardgirges/express-fileupload/tree/master/example
                    imageFile.mv(uploadPath, (err) => {
                    if (err) {
                           return res.status(500).render("error", { title: "Upload Error", statusCode: 500 });
                     }
                        
                     mealKit.imageUrl = "/images/uploads/" + imageName;
                    mealKit.save()
                           .then(() => {
                              res.redirect("/mealkits/list"); 
                         })
                         .catch(dbErr => {
                              res.render("error", { title: "Error", statusCode: 500 });
                          });
                        });
                } else {
                    mealKit.save()
                        .then(() => 
                        {
                            res.redirect("/mealkits/list"); 
                        })
                        .catch(dbErr => 
                        {
                            res.render("error", { title: "Error", statusCode: 500 });
                        });
                }
            })
            .catch(err => {
                res.status(500).render("error", { title: "Error", statusCode: 500 });
            });
    } else {
        res.status(401).render("error", { title: "Unauthorized", statusCode: 401 });
    }
});

router.get("/remove/:id", (req, res) => {
    mealkitModel.findById(req.params.id).then(meal => {
        res.render("mealkits/remove", {
            title: "Remove Confirmation",
            mealKit: meal 
        });
    });
});

router.post("/remove/:id", (req, res) => {
    if (req.session.user && req.session.user.role == "clerk") {
        mealkitModel.findById(req.params.id).then(meal => {
            if (meal) {
                // Reference tag
                // I used the fs.unlink method reference to delete the file. 
                // from https://www.w3schools.com/nodejs/nodejs_filesystem.asp
                const imagePath = path.join(__dirname, "../public", meal.imageUrl);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }

                return mealkitModel.deleteOne({ _id: req.params.id });
            }
        }).then(() => {
            res.redirect("/mealkits/list");
        }).catch(err => res.send("Delete Error: " + err));
    }
});
router.post("/remove/:id", (req, res) => {
    if (req.session.user && req.session.user.role == "clerk") {
        
        mealkitModel.findById(req.params.id).then(meal => {
            if (meal) {
                const imagePath = path.join(__dirname, "../public", meal.imageUrl);

                // Reference tag
                // I used the fs.unlink method reference to delete the file. 
                // from https://www.w3schools.com/nodejs/nodejs_filesystem.asp
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.log("Error during file deletion: " + err);
                    } else {
                        console.log("Successfully removed image file from the server.");
                    }

                    mealkitModel.deleteOne({ _id: req.params.id })
                        .then(() => 
                        {
                            res.redirect("/mealkits/list");
                        })
                        .catch(err => 
                        {
                            console.log("Database deletion error: " + err);
                            res.redirect("/mealkits/list");
                        });
                });
            } else 
            {
                res.redirect("/mealkits/list");
            }
        });

    } else {
        res.status(401).render("error", { 
            title: "Access Denied", 
            statusCode: 401, 
            message: "You are not authorized to perform this action." 
        });
    }
});

router.get("/mealkits/add-mealkit/:id", (req, res) => {
    let message;
    const mealkitId = req.params.id;

    if (req.session.user && req.session.user.role == "customer") {

        let cart = req.session.cart = req.session.cart || [];

        mealkitModel.findById(mealkitId).then(mealkit => {
            if (mealkit) {

                let found = false;

                cart.forEach(cartItem => {
                    if (cartItem.id == mealkitId) {
                        found = true;
                        cartItem.qty++; 
                    }
                });

                if (found) {
                    message = `The meal kit "${mealkit.title}" was already in the cart.`;
                }
                else 
                {
                cart.push({
                    id: mealkitId,
                    qty: 1,
                    mealkit 
                });

                    cart.sort((a, b) => a.mealkit.title.localeCompare(b.mealkit.title));

                    message = `The meal kit "${mealkit.title}" was added to the cart.`;
                }


                res.render("/cart", {
                    title: "Your Shopping Cart",
                    message: message,
                    cart: cart
                });

            }
            else {
                message = `The meal kit with ID ${mealkitId} doesn't exist.`;
                res.render("error", { title: "Error", message });
            }
        }).catch(err => {
            console.log("Error finding meal kit: " + err);
            res.redirect("/mealkits/on-the-menu");
        });

    } else {
        message = "You must be logged in as a customer to purchase.";
        res.render("accounts/login", { title: "Login", error: message });
    }
});

module.exports = router;