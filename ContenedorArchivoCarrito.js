const { timeStamp } = require('console');
const fs = require('fs');
//Declaro la clase ContenedorArchivo con los metodos requeridos
//para manipular elementos dentro del array carritos

class ContenedorArchivo{
    constructor(fileName){
        this.rutaArchivo=`${fileName}.json`;
        this.carritos=[];
    }

    async leerArchivoAsync() {
        //const fs = require('fs');
        try {
            let contenido = await fs.promises.readFile(this.rutaArchivo,'utf-8');
            this.carritos=contenido;
            //console.log(this.carritos);
            return this.carritos;
        }
        catch(err){
           const productsArray = []
           await fs.promises.writeFile(this.rutaArchivo, JSON.stringify(productsArray))
           return productsArray           
        }
    }

    async save(newObject){

        let time=new Date().toLocaleString()
        try {
            await this.leerArchivoAsync();
            let newID;
            let products=[];
            if (this.carritos.length === 0) {
                newID=1; //sin usar uuidV4
                const objToAdd = {...newObject,id:newID,timeStamp:time};  
                products.push(objToAdd);  
            } else {
                products=JSON.parse(this.carritos||'{}');
                console.log("Esto tiene el JSON", products)
                const productIndex = products.findIndex((product) => product.id == newObject.id);
                console.log("EL NRO ES",productIndex)
                if (productIndex === -1 || newObject.length==0) { 
                    newID=(products[products.length-1].id)+1;
                    const objToAdd = {...newObject,id:newID,timeStamp:time};  
                    products.push(objToAdd);                      
                }else{
                    products[productIndex] = {...products[productIndex],...newObject,timeStamp:time}; //copie el producto en esa posicion y le paso la nueva info
                }
            }                    
            await fs.promises.writeFile(this.rutaArchivo, JSON.stringify(products,null,3)) //null para no reemplazar el contenido y 3 por el espacio entre lineas
            return newID;                
        }
        catch (error) {
            console.log(error)
            return error
        }       
    }

    async update(newProd,ID){
        try{
            await this.leerArchivoAsync();
            let contenidoDeCarritos=JSON.parse(this.carritos||'{}');
            //console.log("EL CONTENIDO DEL ARCHIVO DE CARRITOS ES",contenidoDeCarritos)
            const CarritoParaActualizar=contenidoDeCarritos.find(carrito=>carrito.id==ID)
            //console.log("ESTO TIENE EL CARRITO BUSCADO",CarritoParaActualizar);
            //console.log("EL ID DEL PRODUCTO A ACTUALIZAR ES",newProd.id)

            if (CarritoParaActualizar!=undefined){                
                newProd.timeStamp=new Date().toLocaleString();
                let prodToUpdateIndex=CarritoParaActualizar.productos.findIndex(carrito=>carrito.id==newProd.id)
                if (prodToUpdateIndex != -1){
                    CarritoParaActualizar.productos[prodToUpdateIndex]=newProd
                }else{
                    CarritoParaActualizar.productos.push(newProd);
                }                
                await fs.promises.writeFile(this.rutaArchivo, JSON.stringify(contenidoDeCarritos,null,3)) //null para no reemplazar el contenido y 3 por el espacio entre lineas
                return newProd
            } 
            else{
                return null;
            }

        } catch (error) {
            console.log(error)    
        }
    }

    async getById(ID){

        try{
            await this.leerArchivoAsync();
            let carritos=JSON.parse(this.carritos||'{}');
            if(carritos.length>0){                     
                const carritoBuscado=carritos.filter(carrito=>carrito.id==ID);                
                if(carritoBuscado.length){
                    console.log("EL CONTENIDO DE getById ES",carritoBuscado);
                    return carritoBuscado;
                }
                else{
                    return null;
                }
            }
            return null  
        } 
        catch (error) {
            console.log(error)    
        }
    }

    async getAll(){

        try {
            await this.leerArchivoAsync();
            return JSON.parse(this.carritos||'{}');    
        } 
        catch (error) {
           console.log(error)  
        }
        
    }

    async deleteById(IDcarrito,IDproducto){
        
        try{
            await this.leerArchivoAsync();
            let contenidoDeCarritos=JSON.parse(this.carritos||'{}');
            if(contenidoDeCarritos.length>0){                     
                const CarritoParaActualizar=contenidoDeCarritos.find(carrito=>carrito.id==IDcarrito);
                if(CarritoParaActualizar!=undefined){
                    let productosAdejar=CarritoParaActualizar.productos.filter(producto=>producto.id!=IDproducto);                                    
                    if(productosAdejar.length==CarritoParaActualizar.productos.length){
                        return null;
                    }else{
                        CarritoParaActualizar.productos=productosAdejar;
                        await fs.promises.writeFile(this.rutaArchivo, JSON.stringify(contenidoDeCarritos,null,3)) //null para no reemplazar el contenido y 3 por el espacio entre lineas
                        return productosAdejar
                    }
                }else{
                    return null;
                }
            }
            return null  
        } 
        catch (error) {
            console.log(error)    
        }  

    }

    async deleteAll(){
        
        try {
            await fs.promises.writeFile(this.rutaArchivo,"");
            console.log("Contenido borrado correctamente");
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = ContenedorArchivo

//Defino objetos y pruebas para testear los metodos del objeto Contenedor

// let testObject1={                                                                                                                                                    
//       title: 'Globo Terráqueo',                                                                                                                          
//       price: 345.67,                                                                                                                                     
//       thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png',                                   
//       id: 3                                                                                                                                              
//     };                                                                                                                                                    

// let testObject2={
//         title:"Pincel",
//         price:123.45,
//         thumbnail:"https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",            
//     };

// const prueba = async () => {

//     const testContenedor = new Contenedor("productos");

//     //Pruebo la lectura del archivo
//     await testContenedor.leerArchivoAsync();
//     console.log("El contenido del archivo es : ", testContenedor.carritos);

//     //Pruebo obtener todos los carritos
//     let contentFile = await testContenedor.getAll();
//     console.log("Los elementos del archivo son : ",contentFile);

//     //Pruebo obtener el id del producto #2
//     let prodByID = await testContenedor.getById(12);
//     console.log("El elemento con el ID buscado es : ",prodByID);

//     //Pruebo guardar en el archivo el objeto tesObject2
//     let prodSave = await testContenedor.save(testObject2);
//     console.log(prodSave)

//     //Pruebo borrar el objeto con ID 3
//     let deleteProdByID=await testContenedor.deleteById(3);
//     console.log(deleteProdByID);

//     // //Pruebo borrar todos los carritos del archivo
//     let resultDelete= await testContenedor.deleteAll();
//     console.log(resultDelete);

// };

// prueba();