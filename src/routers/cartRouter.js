const express=require('express')
const {Router}=express
const ContenedorFile= require('../ContenedorArchivo.js')
const ContenedorCarritos = new ContenedorFile("carritos")

const app=express()
const routerCarts=Router()
app.use('/carrito',routerCarts);
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

routerCarts.use(express.json());
routerCarts.use(express.urlencoded({ extended: true }))

//Metodo POST
//Defino la ruta http://localhost:8080/api/carrito 
//para crear un carrito y devolver su id
routerCarts.post('/',async (req, res)=> {
    try{
        const carritoInicial=new Carrito()
        await ContenedorCarritos.save(carritoInicial)
        res.send(ContenedorCarritos.this.productos)
        
    } catch (error) {
        res.send(error)
    }
});

module.exports = routerCarts