
const yup = require('yup')

let insertUserValidationSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().required().email(),
    phone: yup.string().matches(/[0-9]{10}/,"Please enter a validate 10 digit phone number").required(),
    password: yup.string().required().min(6),
    profile_image: yup
                    .mixed()
                    .required()
                    .test('is-big-file', 'File too large, max file size allowed is 2MB', _checkIfFilesAreTooBig)
                    .test('is-correct-file','Only image files are allowed png,jpg,jpeg',_checkIfFilesAreCorrectType),
                    
   });


   let updateUserValidationSchema = yup.object().shape({
    name: yup.string().optional(),
    email: yup.string().optional().email(),
    phone: yup.string().matches(/[0-9]{10}/,"Please enter a validate 10 digit phone number").optional(),
    password: yup.string().optional().min(6),
    profile_image: yup
                    .mixed()
                    .optional()
                    .test('is-big-file', 'File too large, max file size allowed is 2MB', _checkIfFilesAreTooBig)
                    .test('is-correct-file','Only image files are allowed png,jpg,jpeg',_checkIfFilesAreCorrectType),
                    
   });

  function validateRequestBody(yupschema, objecttovalidate){
    return yupschema.validate(objecttovalidate,{
        abortEarly: false,
    })
  }


  function _checkIfFilesAreTooBig(file) {
    let valid = true
    if (file) {
        const size = file.size / 1024 / 1024
        if (size > 2) {
          valid = false
        }
    }
    return valid
  }
  
  function _checkIfFilesAreCorrectType(file) {
    let valid = true
    if (file) {
        if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
          valid = false
        }
    }
    return valid
  }


module.exports = {
    insertUserValidationSchema,
    updateUserValidationSchema,
    validateRequestBody
}