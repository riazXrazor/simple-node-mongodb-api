require('dotenv').config()
const fs = require('fs')
const path = require('path')
const util = require('util');
const mongoose = require("mongoose");
const express = require('express')
const bcrypt = require('bcrypt');
const app  = express();
const multer  = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const { handleError, senResponse } = require('./utils')
const { insertUserValidationSchema, updateUserValidationSchema, validateRequestBody } = require('./validations')
const { connectDB }  = require('./config/db')
const User = require('./models/User')
const PORT = process.env.PORT || 3000;
const UPLOAD_PATH = path.join(__dirname,'public','uploads')
app.use(express.json())
app.use(express.urlencoded({ extended:true}))
app.use(express.static('public'))

const SALT_ROUND = 10;

const hash = util.promisify(bcrypt.hash);


app.get('/users',async (req, res) => {
    try{
        const users = await User.find({}).exec();
        senResponse(res, "users fetched succesfully", users)
    }
    catch(e){ handleError(res, e)  }
})

app.post('/user',upload.single('profile_image') ,async (req, res) => {
    try{
        const file = req.file
        if(file  && file.fieldname)
            req.body[file.fieldname] = file
        const data = await validateRequestBody(insertUserValidationSchema, req.body)
        const timestamp = +new Date;
        const ext = data.profile_image.originalname.split('.').pop();
        const filename = `${timestamp}.${ext}`
        const user = new User();
        user.name = data.name
        user.phone = data.phone
        user.email = data.email
        
        user.password = await hash(data.password, SALT_ROUND)
        user.profile_image = filename;
        const savedUser = await user.save();
        fs.writeFileSync(path.join(UPLOAD_PATH,filename),data.profile_image.buffer)
        senResponse(res, "user created succesfully", savedUser)
    }
    catch(e){ handleError(res, e)  }
})

app.put('/user/:id',upload.single('profile_image') ,async (req, res) => {
    try{

        
        const file = req.file
        if(file  && file.fieldname)
            req.body[file.fieldname] = file
        const data = await validateRequestBody(updateUserValidationSchema, req.body)
        const user_id = mongoose.Types.ObjectId(req.params.id);
        const user = await User.findById(user_id);

        if(data.name) user.name = data.name
        if(data.phone) user.phone = data.phone
        if(data.email) user.email = data.email
        if(data.password) user.password = data.password

        if(data.profile_image){
            const timestamp = +new Date;
            const ext = data.profile_image.originalname.split('.').pop();
            const filename = `${timestamp}.${ext}`
            fs.unlinkSync(path.join(UPLOAD_PATH,user.profile_image))
            fs.writeFileSync(path.join(UPLOAD_PATH,filename),data.profile_image.buffer)
            
            user.profile_image = filename;
        }

        const savedUser = await user.save();
        senResponse(res, "user updated succesfully", savedUser)
    }
    catch(e){ handleError(res, e)  }
})

/**
 *  404 route handler
 */
app.all('*', function (_, res) {
    res.status(404)
    res.json({message: "Not Found"})
})

app.listen(PORT, async ()=> {
    console.log(UPLOAD_PATH);
  console.log(`Server running at port ${PORT}`)
  await connectDB();
})