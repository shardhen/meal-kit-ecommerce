const express = require("express");
const router = express.Router();
const mealkitModel = require("../models/mealkitModel");
const mealkitUtil = require("../modules/mealkit-util");

router.get("/mealkits", (req, res) => {
    
    if (req.session.user && req.session.user.role === "clerk") {
        
        mealkitModel.countDocuments()
            .then(count => {
                if (count === 0) {
                    const mealkitsAdd = mealkitUtil.getAllMealKits();

                    mealkitModel.insertMany(mealkitsAdd)
                        .then(() => {
                          res.render("error", { 
                             statusCode: 200,
                             title: "Success",
                             message: "Added meal kits to the database"
                                });
                        })
                        .catch(err => {
                            res.status(500).send("Error inserting data: " + err);
                        });
                } else {
                    res.render("error", { 
                        statusCode: 200,
                        title: "Meal kits have already been added to the database",
                        message: "Meal kits have already been added to the database"
                         });
                }
            })
            .catch(err => {
                res.status(500).send("Database error: " + err);
            });

    } else {
        res.status(403).render("error", { 
        statusCode: 403,                
        title: "Not Authorized",       
         message: "You are not authorized to add meal kits" 
});
    }
});

module.exports = router;