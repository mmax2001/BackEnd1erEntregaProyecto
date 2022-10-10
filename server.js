const express=require('express')
const handlebars=require('express-handlebars')
const {Router}=express

const ContenedorAPI = require('./ContenedorMemoria.js')
const ContenedorFile= require('./ContenedorArchivo.js')
const ContenedorCarrito= require('./ContenedorArchivoCarrito.js')
const adminControl=require('./src/middlewares/adminControl.js')
const Carrito=require('./Carrito.js')

const app=express()
const router=Router()

const ContenedorProductos = new ContenedorFile("productos")
const ContenedorCarritos = new ContenedorCarrito("carritos")


app.use('/', router);
//app.use('/carrito',router);
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

router.use(express.json());
router.use(express.urlencoded({ extended: true }))

const productos=[{"title":"Escuadra","price":123.45,"thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png","id":1},{"title":"Calculadora","price":234.56,"thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png","id":2},{"title":"Globo Terráqueo","price":345.67,"thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png","id":3}]
//const productos=[];
//ContenedorProductos.productosListAPI=productos;
const titleErrors = require('./src/utils/errors.js')
const Producto = require('./product.js')
//const ContenedorArchivo = require('./ContenedorArchivo.js')


//Lineas para Handlebars
app.engine('hbs', handlebars.engine({
    extname:'.hbs',
    defaultLayout:'index.hbs',
    layoutsDir:__dirname + '/views/layouts',
    partialsDir:__dirname + '/views/partials' //ruta a los parciales
}));
app.set('view engine', 'hbs');
app.set('views', './views');

let hbsHelper = handlebars.create({});

hbsHelper.handlebars.registerHelper('discountIVA', function (price) {
    return price+price*0.21
})


//Lineas para PUG
// app.set('views','./views')
// app.set('view engine','pug')

//En EJS solo necesito esta linea de abajo
//app.set('view engine','ejs')

const PORT=process.env.PORT||8080
const server = app.listen(PORT,()=>console.log(`Servidor http escuchando en la direccion y puerto http://localhost:${PORT}`))
server.on("error",error=>console.log(`Error en el servidor ${error}`))

//Metodo GET total
// Defino la ruta http://localhost:8080/api/productos
// para obtener la lista completa de los productos usando la clase
// ContenedorAPI
router.get('/productos', async (req, res) => {
    try {
        const resultado = await ContenedorProductos.getAll()
        if(resultado.length>=1){            
            //res.render('main',{resultado,title:'Listado de Productos'})
            res.send(resultado)
        } else {            
            //res.render('main',{alertMessage: titleErrors.ERRORS.messages.errorProducts})
            res.send({alertMessage: titleErrors.ERRORS.messages.errorProducts})

        }
        //res.render('layout');

    } catch (error) {
        res.send(error)
    }
})

//Metodo GET parcial
// Defino la ruta http://localhost:8080/api/productos/:id
// para obtener el producto con ese id
router.get('/productos/:id', async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        const resultado = await ContenedorProductos.getById(id);
        if(resultado.length==1){            
            //res.render('main',{resultado,title:'Producto Buscado'})
            res.send(resultado)
        }
        else{
            res.json({error: 'producto no encontrado'});
            //res.render('main',{alertMessage:titleErrors.ERRORS.messages.errorProduct})
        }
    } catch (error) {
        res.send(error)
    }
})

//Metodo POST
//Defino la ruta http://localhost:8080/api/productos 
//para agregar un producto
router.post('/productos',adminControl,async (req, res)=> {
    try{
        let producto = req.body;
        //console.log(producto)
        if(!producto.nombre==producto.codigo==''){
            await ContenedorProductos.save(producto);
        }
        //res.json({ result: 'Se guardo el producto con el siguiente ID', producto,ID:lastID})
        res.redirect('/');
        
    } catch (error) {
        res.send(error)
    }
});

//Metodo PUT
//Defino la ruta http://localhost:8080/api/productos/:id 
//para actualizar un producto
router.put('/productos/:id',adminControl,async (req, res)=> {
    try {
        let id = parseInt(req.params.id)
        let producto = req.body;
        const productToFind=await ContenedorProductos.getById(id)
        //console.log("EL PRODUCTO A ACTUALIZAR ES",productToFind)
        //console.log("ID de producto a actualizar",productToFind[0].id)
        if(productToFind.length==1){
            await ContenedorProductos.save(producto)
            res.json({ result: 'se actualizo correctamente',producto: await ContenedorProductos.getById(id) })        
        }else{
            res.json({error: 'producto no encontrado'}); 
        }
    } catch (error) {
        res.send(error)
    }

});

//Metodo DELETE
//Defino la ruta http://localhost:8080/api/productos/:id 
//para eliminar un producto
router.delete('/productos/:id',adminControl,async (req, res)=> {
    try {
        let id = parseInt(req.params.id)
        const producto = await ContenedorProductos.getById(id);
        if(producto){
            await ContenedorProductos.deleteById(id);
            res.json({result:'Se borro exitosamente'})
        }
        else{
            if(producto == null){
                res.json({error: 'producto no encontrado'})
            }
        }        
    } catch (error) {
        res.send(error)
    }
    
});
// -------------Configuro las rutas para el carrito---------------


//Metodo POST
//Defino la ruta http://localhost:8080/api/carrito 
//para crear un carrito y devolver su id
router.post('/carrito',async (req, res)=> {
    try{
        //const carritoInicial=[]
        const carritoInicial = {
            productos: [],
        };
        //let carritoInicial=new Carrito()
        const newCartID=await ContenedorCarritos.save(carritoInicial)
        res.json({result:`Se creo exitosamente el carrito con id ${newCartID}`})
    } catch (error) {
        res.send(error)
    }
});

//Metodo DELETE
//Defino la ruta http://localhost:8080/api/carrito/:id 
//para eliminar un carrito por su id
router.delete('/carrito/:id',async (req, res)=> {
    try {
        let id = parseInt(req.params.id)
        const carritoID = await ContenedorCarritos.deleteById(id);
        if(carritoID){
            let contenido=await ContenedorCarritos.getAll()
            //vacio el archivo para borra los caracteres []
            //los cuales no permiten crear nuevo contenido
            //cuando se comienza desde cero
            if(contenido.length==0){                
                ContenedorCarritos.deleteAll()
            }
            res.json({result:`Se borro exitosamente el carrito con id ${id}`})
        }
        else{
            if(producto == null){
                res.json({error: 'Carrito no encontrado'})
            }
        }        
    } catch (error) {
        res.send(error)
    }
    
});

//Metodo GET
//Defino la ruta http://localhost:8080/api/carrito/:id/productos 
//para listar los productos de un carrito por su id
router.get('/carrito/:id/productos',async (req, res)=> {
    try{
        let id = parseInt(req.params.id)
        const listado=await ContenedorCarritos.getById(id);
        //res.send({result:'Este es el contenido del carrito con ID:',id,listado})        
        res.send({result:`Estos son los productos del carrito con ID:#${id} y productos:${listado}`})
    } catch (error) {
        res.send(error)
    }
});

//Metodo POST
//Defino la ruta http://localhost:8080/api/carrito/:id/productos 
//para agregar un productos por su id
router.post('/carrito/:id/productos',async (req, res)=> {
    try{
        const id = parseInt(req.params.id)
        const productoPOST = req.body;
        console.log("EL PARAMETRO ID DE CARRITO ES",id)
        console.log("EL PARAMETRO DE ID DEL PRODUCTO ES",productoPOST.id)
        const producto = await ContenedorProductos.getById(productoPOST.id);
        console.log("ESTE ES EL PRODUCTO A AGREGAR",producto[0])
        // let cart = await ContenedorCarritos.getById(id);
        // console.log("ESTO TIENE CART",cart[0].productos)
        const prodToAdd = await ContenedorCarritos.update(producto[0],id);
        res.send(prodToAdd)
    } catch (error) {
        res.send(error)
    }
});

//Metodo DELETE
//Defino la ruta http://localhost:8080/api/carrito/:id/productos/:id_prod 
//para eliminar un producto por su id y por su id de carrito
router.delete('/carrito/:id/productos/:id_prod',async (req, res)=> {
    try {
        const { id, id_prod } = req.params;
        console.log(id,id_prod)
        const carritoBuscado = await ContenedorCarritos.getById(id);
        console.log("EL CARRITO A PROCESAR ES ",carritoBuscado)
        const prodDelete=await ContenedorCarritos.deleteById(id,id_prod)
        if(prodDelete!=null){
            res.json({result:`Se borro exitosamente del carrito con ID:${id},el producto con id:${id_prod}`})     
        }else{
            res.json({result:`No se encontro el producto buscado con ese id: #${id_prod}`})
        }
    } catch (error) {
        res.send(error)
    }
    
});






// let prod1=new Producto("Escuadra","Esc 45 grados",123,'https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png',123.45,20)
// console.log(prod1)
// let prod2=new Producto("Calculadora","Calc. Cientifica",124,'https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png',234.56,20)
// console.log(prod2)
// let prod3=new Producto("Globo Terráqueo","Util Geografia",125,'https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png',345.67,20)
// console.log(prod3)
// let prod4=new Producto("Globo Terráqueo Chico","Util Geografia",126,'https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png',345.67,20)
// console.log(prod4)
// const listProd=new ContenedorFile("productos")
// // listProd.save(prod1)
// // listProd.save(prod2)
// // listProd.save(prod3)

// const prueba = async()=>{
//     let prodSave = await listProd.save(prod1);
//     console.log(prodSave)
//     await listProd.save(prod2);
//     await listProd.save(prod3);
//     await listProd.save(prod4);
// }

// prueba()

// const prueba1 = async()=>{
    
//     await listProd.save(prod4);
// }

// prueba1()