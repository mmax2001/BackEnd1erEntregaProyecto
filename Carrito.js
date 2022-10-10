class Carrito{
    constructor(){
               
        this.listProducts=[]
        
    }

    getProducts(){
        return this.listProducts
    }

    setListProducts(newList){
        this.listProducts=newList
    }

    getProductByID(ID){
        if(this.listProducts.length>0){             
                const prodToFind=this.listProducts.filter(product=>product.id===ID);             
                if(prodToFind){
                    return prodToFind;
                }
                else{
                    return null;
                }
            }
        return null 
    }

    deleteProductByID(ID){
        const indexOfID=this.listProducts.findIndex(producto=>{return producto.id==ID});
            console.log(indexOfID);
            if(indexOfID!=-1) {
                const prodNonDelete=this.prodListAPI.filter(producto=>producto.id!=ID);
                //console.log(`Se borro exitosamente el producto con id : ${ID}`);
                this.listProducts=prodNonDelete
                return this.listProducts;
            }
            else{
                return null
            }
    }

    save(newProduct){
        let newID;
        let time=new Date().toLocaleString()
        if (this.listProducts.length === 0) {
            newID=1;
        } 
        else{
            newID=(this.listProducts[this.listProducts.length-1].id)+1; 
        }
        const prodToAdd = {...newProduct,id:newID,timestamp:time}; 
        this.prodListAPI.push(prodToAdd);
        return newID;
    }

    update(newProd,ID){
        if(this.prodListAPI.length>0){
            const productIndex = this.prodListAPI.findIndex((product) => product.id == ID);
            if (productIndex === -1) return { error: true };
            this.prodListAPI[productIndex] = {...this.prodListAPI[productIndex],...newProd,}; //copie el producto en esa posicion y le paso la nueva info
            //Sino actualizar asi :
            // const prodToUpdate=this.prodListAPI.find(product=>product.id===ID)
            // console.log("ESTO DEVUELVE METODO UPDATE",prodToUpdate);
            // if (prodToUpdate!=undefined){
            //     prodToUpdate.title=newProd.title
            //     prodToUpdate.price=newProd.price
            //     prodToUpdate.thumbnail=newProd.thumbnail;
            // } 
            // else{
            //     return null;
            // }
        }
        else{
            return null;
        }
    }

}


module.exports = Carrito