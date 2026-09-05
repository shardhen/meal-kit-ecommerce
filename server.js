require('dotenv').config({ path: './config/.env' });

const mealkitUtil = require("./modules/mealkit-util");
const mealkitModel = require("./models/mealkitModel");

const path = require("path");
const express = require("express");
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require("mongoose");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const MongoStore = require("connect-mongo").default;

// Set up Body Parser
app.use(express.urlencoded({extended: false})); 

// file-upload
app.use(fileUpload());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_CONNECTION_STRING }) 
}));

app.use((req,res,next) =>{
    res.locals.user = req.session.user;
    next();
});

//EJS
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, "views"));
app.set("layout", "layouts/main");
app.use(expressLayouts);

// Add your routes here
const generalController = require("./controllers/general");
const mealkitController = require("./controllers/mealkits");
const loadDataController = require("./controllers/load-data");

app.use("/",generalController);
app.use("/mealkits",mealkitController);
app.use("/load-data", loadDataController);



// MongoDB connection Setting
mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
.then(async () => {
    console.log("Connected to MongoDB");

    const count = await mealkitModel.countDocuments();

    if (count === 0) {
        const initialMealKits = mealkitUtil.getAllMealKits();
        await mealkitModel.insertMany(initialMealKits);

        console.log("Initial meal kits added to MongoDB");
    } else {
        console.log("Meal kits already exist in MongoDB");
    }
})
.catch(err => {
    console.error("MongoDB connection error:", err);
});

module.exports = app;

// This use() will not allow requests to go beyond it
// so we place it at the end of the file, after the other routes.
// This function will catch all other requests that don't match
// any other route handlers declared before it.
// This means we can use it as a sort of 'catch all' when no route match is found.
// We use this function to handle 404 requests to pages that are not found.
app.use((req, res) => {
    res.status(404).render("error", { 
        title: "Page Not Found", 
        statusCode: 404 });
});

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).render("error", { 
        title: "Internal Server Error",
        statusCode: 500
    });
});


// *** DO NOT MODIFY THE LINES BELOW ***

// Define a port to listen to requests on.
const HTTP_PORT = process.env.PORT || 8080;

// Call this function after the http server starts listening for requests.
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}
  
// Listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
