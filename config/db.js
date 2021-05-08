const mongoose = require("mongoose");

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

let db = null;

async function connectDB() {
    try {
        if(db) {
            console.log("reuse db connection")
            return db;
        }

     
        db = await mongoose.connect(
          `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.nwy2s.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
          {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
          }
        );
        console.log("create db connection")
        console.log('DB connected')
        return db;
      } catch (e) {
        console.error("DB connection Error");
      }
}


module.exports = {
    connectDB,
    db
}