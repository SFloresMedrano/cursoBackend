class ProductManager {
  constructor() {
    this.products = [];
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
      return `El producto ${product.title} fue agregado`;
    } else {
      return `El codigo no es válido o el producto no es válido`;
    }
  }

  getProduct() {
    return this.products;
  }

  getProductById(id) {
    let foundCode = this.products.findIndex((element) => element.id === id);

    if (foundCode === -1) {
      return `El codigo ${id} no se encuentra cargado`;
    } else {
      return this.products[foundCode];
    }
  }
};

const product1 = {
    title: "producto prueba",
    description:"Este es un producto prueba",
    price:200,
    thumbnail:"Sin imagen",
    code:"abc123",
    stock:25    
};

const PM = new ProductManager();
console.log(PM.addProduct(product1));
console.log(PM.getProduct());
console.log(PM.addProduct(product1));

console.log(
    `El producto deseado se muestra a continuación:`,
    PM.getProductById(1)
    );
console.log(`El producto deseado se muestra a continuación:`,
    PM.getProductById(2)
    );