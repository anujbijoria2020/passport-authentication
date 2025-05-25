const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email:{
        type:String,
         required: true,
        unique:true,
         
    },
    password:{
        type:String,
        required: function () {
      return !this.oauthProvider; // only require password if not from Google/Facebook
    }
    },

    firstName:{
type:String,
required:true,
    },
    lastName:{
        type:String,
    },
    facebookId:String,
    oauthProvider:String,
    oauthId:String,
}
)

const User = mongoose.model("User",UserSchema);
module.exports = User;
