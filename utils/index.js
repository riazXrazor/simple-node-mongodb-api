function getValidationErrors(e){
    if(e.name === 'ValidationError'){
        const errObj = {}
        console.log(e)
        if(!e.inner) return errObj;
        e.inner.map(error => {
            errObj[error.path] = error.errors
        })
        return errObj;
    }
}

function handleError(res, e){
    
    const verr = getValidationErrors(e);
    if(verr){
        senResponse(res, 'Validation Error', {}, verr, 422)
        return;
    }
    senResponse(res, e.message, {}, [], 500)
}

function senResponse(res, message ,data = {}, error = [], status = 200) {
    res.status(status)
    res.json({
        message,
        data,
        error
    })
}

module.exports = {
    handleError,
    senResponse
}