const fs= require('fs');
const { CLIENT_RENEG_WINDOW } = require('tls');

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products=[];
/*     const productsString = fs.readFileSync("products.json","utf-8");
    const products = JSON.parse(productsString); */
    if (fs.existsSync("products.json")) {
      const productsString = fs.readFileSync("products.json", "utf-8");
      const products = JSON.parse(productsString);
      this.products = products;
  } else {
      fs.writeFileSync("products.json", "[]");
      const products = JSON.parse(productsString);
      this.products = products;
  };
    this.id = 1;
  }

  #getNewId() {
    let maxId = 0;
    this.products.forEach((item) => {
      if (item.id > maxId) {
        maxId = item.id;
      }
    });
    maxId++;
    return maxId;
  }

  addProduct(product) {
    let foundCode = this.products.findIndex(
      (element) => element.code === product.code
    );

    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      return `Fields missing or invalid`;
    }

    const id = this.#getNewId();
    if (foundCode === -1) {
      product = { ...product, id: id };
      this.products.push(product);
      const productsString = JSON.stringify(this.products);
      fs.writeFileSync("products.json",productsString);
      return `El producto ${product.title} fue agregado`;
    } else {
      return `El codigo no es válido o el producto no es válido`;
    };
  };

  getProduct() {
    if(this.products.length>0){
      const productsString = fs.readFileSync("products.json","utf-8");
      const products = JSON.parse(productsString);
      this.products = products;
      return this.products;
    }else{
      return "La lista de productos se encuentra vacia"
    }
  };

  getProductById(id) {
    let foundCode = this.products.findIndex((element) => element.id === id);

    if (foundCode === -1) {
      return `El codigo ${id} no se encuentra cargado`;
    } else {
      return this.products[foundCode];
    }
  };

  updateProduct(id, modProps){
    let foundCode = this.products.findIndex((element) => element.id === id);
    if (foundCode === -1 || !modProps) {
      return `Code not found or wrong properties`;
    } else {
      let modProd ={};
      modProd.id=id
      if(modProps.title) this.products[foundCode].title = modProps.title;
      if(modProps.description) this.products[foundCode].description = modProps.description;  
      if(modProps.price) this.products[foundCode].price = modProps.price;  
      if(modProps.thumbnail) this.products[foundCode].thumbnail = modProps.thumbnail;  
      if(modProps.code) this.products[foundCode].code = modProps.code;  
      if(modProps.stock) this.products[foundCode].stock = modProps.stock;
      const productsString = JSON.stringify(this.products);
      fs.writeFileSync("products.json",productsString);
      return this.products[foundCode];
    }
  };

  deleteProducts(id){
    let foundCode = this.products.findIndex((element) => element.id === id);
    if (foundCode === -1) {
      return `El codigo ${id} no se encuentra cargado`;
    } else {
      this.products.splice(foundCode,1);
      const productsString = JSON.stringify(this.products);
      fs.writeFileSync("products.json",productsString);
    };
  };
  };

const product1 = {
    title: "producto prueba",
    description:"Este es un producto prueba",
    price:200,
    thumbnail:"Sin imagen",
    code:"abc123",
    stock:25    
};

const PM = new ProductManager("./products.json");
console.log(PM.addProduct(product1));
console.log(PM.getProduct());
console.log(PM.addProduct(product1));
console.log(PM.updateProduct(1,{title: "algo", price:300}))

console.log(
    `El producto deseado se muestra a continuación:`,
    PM.getProductById(1)
    );
console.log(`El producto deseado se muestra a continuación:`,
    PM.getProductById(2)
    );
console.log(PM.getProduct(),"algo");

console.log(PM.deleteProducts(1));

console.log(PM.getProduct());