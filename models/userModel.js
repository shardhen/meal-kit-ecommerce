const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: 
    {
        "type": String,
        "unique": true,
        "required": true
    },
    passWord: 
    {
        "type": String,
        "required": true
    }
    });

// Hash passwords.
userSchema.pre("save", async function() {
    const user = this;

    if (!user.isModified('passWord')) {
        return; 
    }
    try {
        const salt = await bcryptjs.genSalt(10);
        user.passWord = await bcryptjs.hash(user.passWord, salt);
    } 
    catch (err) {
        throw new Error(`Hashing failed: ${err.message}`);
    }
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;