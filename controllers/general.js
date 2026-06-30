const mealkitUtil = require("../modules/mealkit-util");
const express = require('express');
const router = express.Router();
const userModel = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const mealkitModel = require("../models/mealkitModel");
 const FormData = require("form-data");
 const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(FormData);
router.get("/", (req, res) => {
    res.render("general/home", {
        featuredMealKits: mealkitUtil.getFeaturedMealKits(mealkitUtil.getAllMealKits()),
        title: "Home",
    });
});

router.get("/welcome", (req, res) => {
    res.render("general/welcome", {
        title: "Welcome",
    });
});

router.get("/sign-up", (req, res) => {
    res.render("general/sign-up", {
        title: "Sign up",
        validationMessages:{},
        values:{
            firstName:'',
            lastName:'',
            email:'',
            passWord:'',
        }
    });
});

router.post("/sign-up", (req, res) => {

    const{firstName, lastName, email, passWord} = req.body;
    console.log(req.body);

    let passedValidation = true;
    let validationMessages = {};

    if (firstName.trim().length  == 0)
    {
        passedValidation = false;
        validationMessages.firstName = "The First Name is required";
    }
    if (lastName.trim().length  == 0)
    {
        passedValidation = false;
        validationMessages.lastName = "The Last Name is required";
    }
    // <!-- Base code in Line number from 44 and 59 which are presenting Email and password validation from AI(Gemini) modifed by Chanhee Han-->
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim().length == 0) {
        passedValidation = false;
        validationMessages.email = "Email is required";
    } else if (!emailRegex.test(email)) {
        passedValidation = false;
        validationMessages.email = "Please enter a valid email address";
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
    if (passWord.trim().length == 0) {
        passedValidation = false;
        validationMessages.passWord = "Password is required";
    } else if (!passwordRegex.test(passWord)) {
        passedValidation = false;
        validationMessages.passWord = "Password must be 8-12 characters and include uppercase, lowercase, a number, and a symbol";
    }

   if (passedValidation)
{
    userModel.findOne({ email: email })
    .then(user => {
        if (user) {
            res.render("general/sign-up", {
                title: "Sign up",
                validationMessages: { email: "This email is already registered." },
                values: req.body
            });
        } else {
            const newUser = new userModel({
                firstName, lastName, email, passWord 
            });

            newUser.save()
            .then(savedUser => {
                console.log(`User ${savedUser.firstName} has been added to the collection.`);

                const mg = mailgun.client({
                    username: "api",
                    key: process.env.MAILGUN_API_KEY
                });

                mg.messages.create("sandbox2c476e0bf1584eae8621c7218145aa43.mailgun.org", {
                    from: "Mailgun Sandbox <postmaster@sandbox2c476e0bf1584eae8621c7218145aa43.mailgun.org>",
                    to: [`${email}`],
                    subject: `Hello ${firstName} ${lastName}, Welcome to rean.`,
                    html: `Welcome! ${firstName} ${lastName}<br>
                           Email Address: ${email}<br>
                           This is Chanhee Han from rean. We are happy to welcome you to our store!`
                })
                .then(data => {
                    console.log(data);
                    res.redirect("/welcome");
                });
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.render("general/sign-up", {
            title: "Sign up",
            validationMessages,
            values: req.body
        });
    });
}
else
{
    res.render("general/sign-up", {
        title: "Sign up",
        validationMessages,
        values: req.body
    });
}
});

router.get("/log-in", (req, res) => {
    res.render("general/log-in", {
        title: "Log In",
        validationMessages: {},
        values: {}
    });
});

router.post("/log-in", (req, res) => {
    const { email, passWord, role } = req.body;
    let passedValidation = true;
    let validationMessages = {};

    if (!email || email.trim().length == 0) {
        passedValidation = false;
        validationMessages.email = "Please enter your email.";
    }
    if (!passWord || passWord.trim().length == 0) {
        passedValidation = false;
        validationMessages.passWord = "Please enter your password.";
    }

    if (passedValidation) {
        userModel.findOne({ email: email })
            .then(user => {
                if (user) {
                     bcryptjs.compare(passWord, user.passWord)
                      .then(matched => {
                         if (matched) {
                               req.session.user = user.toObject();
                               const selectedRole = req.body.identificationLogIn;
                               req.session.user.role = selectedRole;
                            if (selectedRole === "clerk") {
                                 res.redirect("/mealkits/list");
                             } else {
                              res.redirect("/cart");
                             }
                            } else {
                               validationMessages.email = "Invalid email and/or password.";
                                res.render("general/log-in", {
                                   title: "Log In",
                                   validationMessages,
                                   values: req.body
                               });
                          }
                       });
             } else {
                 validationMessages.email = "Invalid email and/or password.";
                    res.render("general/log-in", {
                    title: "Log In",
                    validationMessages,
                    values: req.body
                    });
                }
            })
            .catch(err => {
                console.log("Database error: " + err);
                return res.render("general/log-in", { title: "Log In", values: req.body });
            });
    } else {
        return res.render("general/log-in", {
            title: "Log In",
            validationMessages,
            values: req.body
        });
    }
});

router.get("/log-out",(req,res) =>{
    req.session.destroy();
    res.redirect("/log-in");
});

router.get("/cart", (req, res) => {
    if (req.session.user && req.session.user.role === "customer") {
        
        let cart = req.session.cart || [];
        
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.mealkit.price * item.qty;
        });

        let tax = subtotal * 0.10;
        let finaltotal = subtotal + tax;

        res.render("general/cart", {
            title: "Cart",
            cart: cart,
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            finaltotal: finaltotal.toFixed(2)
        });

    } else {
        res.status(401).render("error", {
            title: "401 - Unauthorized",
            statusCode: 401,
            message: "You must be logged in as a customer to view the cart."
        });
    }
});


router.get("/add-to-cart/:id", (req, res) => {
    const mealkitId = req.params.id;

    if (req.session.user && req.session.user.role === "customer") {
        mealkitModel.findById(mealkitId)
            .then(product => {
                if (product) {
                    let cart = req.session.cart = req.session.cart || [];
                    let found = false;

                cart.forEach(item => 
                    {
                    if (item.id == mealkitId) 
                        {
                        found = true;
                           item.qty++;
                        }
                });

                if (!found) 
                    {
                        cart.push({ id: mealkitId, qty: 1, mealkit: product });
                    }
                    
                    res.redirect("/cart");
                } else 
                    {
                    res.status(404).send("Meal Kit not found.");
                    }
            })
            .catch(err => {
                console.log("Error finding mealkit: " + err);
                res.redirect("/");
            });
    } else {
        res.redirect("/log-in");
    }
});

// Reference Tag
// I used a 'for' loop and 'splice()' to directly remove the item from the session array by its index
// This ensures precise manual control over the cart array before redirecting the user back to the updated view.
// Reference URL: https://www.webslesson.info/2023/03/how-to-make-shopping-cart-in-nodejs.html
router.get("/cart/remove/:id", (req, res) => {
    const itemId = req.params.id;
    let cart = req.session.cart || [];

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === itemId) {
            cart.splice(i, 1); 
            i--;
        }
    }
    req.session.cart = cart;

    res.redirect("/cart");
});
router.post("/cart/place-order", (req, res) => {
    if (req.session.user && req.session.user.role === "customer") {
        const cart = req.session.cart || [];
        const user = req.session.user;

        if (cart.length > 0) {
            let emailHtml = `<h2>Order Confirmation</h2><table style="width:100%; border-collapse: collapse;">`;
            let subtotal = 0;

            cart.forEach(item => {
                const itemTotal = item.mealkit.price * item.qty;
                subtotal += itemTotal;
                
                emailHtml += `
                    <tr>
                        <td style="border-bottom: 1px solid #ddd; padding: 8px;">${item.mealkit.title}</td>
                        <td style="border-bottom: 1px solid #ddd; padding: 8px; text-align:center;">x${item.qty}</td>
                        <td style="border-bottom: 1px solid #ddd; padding: 8px; text-align:right;">$${itemTotal.toFixed(2)}</td>
                    </tr>`;
            });
            // Reference Tag
            // I adapted the accumulator pattern from this reference to calculate subtotal and 10% tax. I also utilized the ES6 Template approach 
            // Reference URL: https://forum.freecodecamp.org/t/learn-basic-oop-by-building-a-shopping-cart-step-1/684921
            const taxes = subtotal * 0.10; 
            const total = subtotal + taxes;

            emailHtml += `
                </table>
                <div style="text-align: right; margin-top: 20px;">
                    <p>Subtotal: <strong>$${subtotal.toFixed(2)}</strong></p>
                    <p>Taxes (10%): <strong>$${taxes.toFixed(2)}</strong></p>
                    <hr>
                    <h3>Grand Total: $${total.toFixed(2)}</h3>
                </div>
                <p>Thank you for your order, ${user.firstName}!</p>`;

            const mg = mailgun.client({
                username: "api",
                key: process.env.MAILGUN_API_KEY
            });
            
            mg.messages.create("sandbox2c476e0bf1584eae8621c7218145aa43.mailgun.org", {
                from: "Meal Kit Store <postmaster@sandbox2c476e0bf1584eae8621c7218145aa43.mailgun.org>",
                to: [user.email],
                subject: `Order Confirmation - ${user.firstName}`,
                html: emailHtml
            })
            .then(() => {
                req.session.cart = []; 
                res.render("general/cart", { 
                    title: "Order Success", 
                    cart: [], 
                    message: "Thank you! Your order has been placed and a confirmation email has been sent." 
                });
            })
            .catch(err => {
                console.log("Mailgun Error: ", err);
                res.render("general/cart", { title: "Error", cart: cart, message: "Something went wrong with the email." });
            });
        } else {
            res.redirect("/cart");
        }
    }
});
//Reference tag
// I applied this logic to manage the shopping cart quantity, I used the find() method to get the object reference of the item so that i could identify what item i need to increase
// from https://medium.com/@sohail_saifi/building-a-shopping-cart-session-based-vs-database-backed-745260091f30
router.post("/cart/update-qty", (req, res) => {
    const { productId, userInput } = req.body; 
    let cart = req.session.cart || [];

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        if (userInput === "increase") {
            existingItem.quantity++;
        } else if (userInput === "decrease" && existingItem.quantity > 1) {
            existingItem.quantity--;
        }
    }

    res.redirect("/cart");
});

module.exports = router;