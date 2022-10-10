//const { v4: uuidv4 } = require('uuid');

//Declaro la clase Producto con sus metodos solicitados
class Producto{
    constructor(nombre,descripcion,codigo,foto,precio,stock){

        this.timestamp=new Date().toLocaleString()
        this.nombre=nombre
        this.descripcion=descripcion
        this.codigo=codigo
        this.fotoURL=foto
        this.precio=precio
        this.stock=stock
    }

    getID(){
        return this.id
    }

    getTimeStamp(){
        return this.timestamp
    }
    getNombre(){
        return this.nombre
    }
    
    getDescripcion(){
        return this.descripcion
    }

    getCodigo(){
        return this.codigo
    }

    getFoto(){
        return this.fotoURL
    }

    getPrecio(){
        return this.precio
    }

    getStock(){
        return this.stock
    }

    setID(newID){
        this.id=newID
    }

    setTimeStamp(newTimeStamp){
        this.timestamp=newTimeStamp
    }

    setNombre(newNombre){
        this.nombre=newNombre
    }
    
    setDescripcion(newDescripcion){
        this.descripcion=newDescripcion
    }

    setCodigo(newCodigo){
        this.codigo=newCodigo
    }

    setFoto(newFoto){
        this.fotoURL=newFoto
    }

    setPrecio(newPrecio){
        this.precio=newPrecio
    }

    setStock(newStock){
        this.stock=newStock
    }
}
module.exports=Producto

//Test de la clase

// const prod1Test=new Producto("Calculadora","Calc Cientifica",123,"https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png",345,1)
// prod1Test.setID(678);
// console.log(prod1Test);