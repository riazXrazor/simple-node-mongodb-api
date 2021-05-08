const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const APP_URL = process.env.APP_URL
const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  profile_image: String
},{
    toJSON: { 
        transform: function (doc, ret) {
          delete ret.password;
          delete ret.__v;
          if(ret.profile_image){
            ret.profile_image = `${APP_URL}/${ret.profile_image}`
          }
          return ret;
        }

    },
    timestamps: true
});

const User = mongoose.model('User', UserSchema);
module.exports = User