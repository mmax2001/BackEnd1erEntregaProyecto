const express=require('express')
const {Router}=express
const ContenedorAPI = require('./ContenedorAPI.js')

const app=express()
const router=Router()
const ContenedorProductos = new ContenedorAPI()

app.use('/productos', router);
app.use('/carrito',router);
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

router.use(express.json());
router.use(express.urlencoded({ extended: true }))

const productos=[{"title":"Escuadra","price":123.45,"thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png","id":1},{"title":"Calculadora","price":234.56,"thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png","id":2},{"title":"Globo Terráqueo","price":345.67,"thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png","id":3}]
//const productos=[];
ContenedorProductos.prodListAPI=productos;

//Metodo GET total
// Defino la ruta http://localhost:8080/api/productos
// para obtener la lista completa de los productos usando la clase
// ContenedorAPI
router.get('/', async (req, res) => {
    try {
        const resultado = ContenedorProductos.getAll()
        //res.send(resultado)
        if(resultado.length>1){
            
            res.render('main',{resultado,title:'Listado de Productos'})
        
        } else {
            
            res.render('main',{alertMessage:'No hay productos'})

        }
        //res.render('layout');

    } catch (error) {
        res.send(error)
    }
})

//Metodo GET parcial
// Defino la ruta http://localhost:8080/api/productos/:id
// para obtener el producto con ese id
router.get('/:id', (req, res) => {
    try {
        let id = parseInt(req.params.id);
        console.log(id)
        const resultado = ContenedorProductos.getByID(id);
        console.log(resultado)
        if(resultado.length==1){
            console.log("ENTRO")
            res.render('main',{resultado,title:'Producto Buscado'})
            //res.send({'title':producto.title,'price':producto.price,'thumbnail':producto.thumbnail})
        }
        else{
            //res.json({error: 'producto no encontrado'});
            res.render('main',{alertMessage:'Producto No Encontrado'})
        }
    } catch (error) {
        res.send(error)
    }
})


//Metodo POST
//Defino la ruta http://localhost:8080/api/productos 
//para agregar un producto
router.post('/',(req, res)=> {
    try{
        let producto = req.body;
        console.log(producto)
        if(!producto.title==producto.price==producto.thumbnail==''){
            let lastID=ContenedorProductos.save(producto);
        }
        //res.json({ result: 'Se guardo el producto con el siguiente ID', producto,ID:lastID})
        res.redirect('/');
        
    } catch (error) {
        res.send(error)
    }
});

module.exports = productsRouter