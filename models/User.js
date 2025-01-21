const mongoose = require("mongoose");
const schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new schema({
    email: {
        type: String,
        required: true,
    },
});

// Passport-local-mongoose will auto-generate username and hashed password
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
