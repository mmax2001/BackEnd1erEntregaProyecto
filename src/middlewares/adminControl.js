const adminPass = true;

const adminControl = (req,res,next) => {
    if (!adminPass){
        ruta=req.baseUrl
        metodo=req.method
        res.send(errorMessage(ruta,metodo))
    } else {
        next()
    }
}

function errorMessage(ruta,metodo){
    const error={
        error : -1,
    }
    if(ruta&&metodo){
        error.descripcion=`ruta ${ruta} metodo ${metodo} no autorizada`
    }else{
        error.descripcion='No autorizado'
    }   
    return error
}
// const adminPass = false;

// const adminControl = (req,res,next) => {
//     if (!adminPass){
//         ruta=req.baseUrl
//         metodo=req.method
//         res.send(errorMessage(ruta,metodo))
//     } else {
//         next();
//     }
// }

// function errorMessage(ruta,metodo){
//     const error=-1
//     return({error, descripcion:`ruta ${ruta} metodo ${metodo} no autorizada`})
// }

module.exports = adminControl
