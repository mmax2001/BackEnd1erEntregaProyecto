const { timeStamp } = require('console');
const fs = require('fs');
//Declaro la clase Contenedor con los metodos requeridos


class ContenedorArchivo{
    constructor(fileName){
        this.rutaArchivo=`${fileName}.json`;
        this.productos=[];
    }

    async leerArchivoAsync() {
        //const fs = require('fs');
        try {
            let contenido = await fs.promises.readFile(this.rutaArchivo,'utf-8');
            this.productos=contenido;
            //console.log(this.productos);
            return this.productos;
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
            if (this.productos.length === 0) {
                newID=1; //sin usar uuidV4
                const objToAdd = {...newObject,id:newID,timeStamp:time};  
                products.push(objToAdd);  
            } else {
                products=JSON.parse(this.productos||'{}');
                console.log("Esto tiene el JSON", products)
                const productIndex = products.findIndex((product) => product.codigo == newObject.codigo);
                console.log("EL NRO ES",productIndex)
                if (productIndex === -1 || newObject.length==0) { 
                    console.log("PASO")
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
            if(this.productos.length>0){
                const productIndex = this.productos.findIndex((product) => product.id == ID);
                if (productIndex === -1) return { error: true };
                this.productos[productIndex] = {...this.productos[productIndex],...newProd,}; //copie el producto en esa posicion y le paso la nueva info
                return this.productos[productIndex]
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
            let productos=JSON.parse(this.productos||'{}');
            if(productos.length>0){                     
                const prodToFind=productos.filter(producto=>producto.id===ID);                
                if(prodToFind.length){
                    //console.log("EL CONTENIDO ES ",prodToFind);
                    return prodToFind;
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
            return JSON.parse(this.productos||'{}');    
        } 
        catch (error) {
           console.log(error)  
        }
        
    }

    async deleteById(ID){
        
        try{
            await this.leerArchivoAsync();
            let products=JSON.parse(this.productos||'{}');     
            const indexOfID=products.findIndex(producto=>{return producto.id==ID});
            console.log(indexOfID);
            if(indexOfID!=-1) {
                const prodToFind=products.filter(producto=>producto.id!=ID);
                await fs.promises.writeFile(this.rutaArchivo, JSON.stringify(prodToFind))
                console.log(`Se borro exitosamente el producto con id : ${ID}`)
                return ID;
            }
            else{
                 console.log("No se encuentra el ID");
                 return null;
            }
        }
        catch (error){
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
//     console.log("El contenido del archivo es : ", testContenedor.productos);

//     //Pruebo obtener todos los productos
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

//     // //Pruebo borrar todos los productos del archivo
//     let resultDelete= await testContenedor.deleteAll();
//     console.log(resultDelete);

// };

// prueba();