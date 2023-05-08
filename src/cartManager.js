import fs from 'fs';

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    if (fs.existsSync(this.path)) {
      const cartList = await fs.promises.readFile(this.path, 'utf-8');
      const data = JSON.parse(cartList);
      return data;
    } else {
      return 'Not possible to get the specified cart';
    }
  }

  async getProduct() {
    if (fs.existsSync('./src/products.json')) {
      const data = await fs.promises.readFile('./src/products.json', 'utf-8');
      return JSON.parse(data);
    }
    await fs.promises.writeFile(this.path, JSON.stringify([]));
    return [];
  }

  async readCartId() {
    if (fs.existsSync('./src/cartId.json')) {
      const idString = await fs.promises.readFile('./src/cartId.json', 'utf-8');
      const id = JSON.parse(idString);
      return id;
    }
    await fs.promises.writeFile('./src/cartId.json', JSON.stringify(0));
  }
  async addCart() {
    const cartList = await this.getCarts();
    let idFile = (await this.readCartId()) + 1;
    await fs.promises.writeFile('./src/cartId.json', JSON.stringify(idFile));
    const newCart = { id: idFile, products: [] };
    cartList.push(newCart);
    const cartString = JSON.stringify(cartList);
    await fs.promises.writeFile(this.path, cartString);
  }

  async getCartById(id) {
    const cartList = await this.getCarts();
    let foundCode = cartList.findIndex((element) => element.id === id);
    if (foundCode > -1) {
      return cartList[foundCode].products;
    } else {
      return 'The cart is not existent. Please check the cart ID';
    }
  }

  async addProductToCart(cartId, productId) {
    let data = await this.getProduct();
    let cartList = await this.getCarts();
    let foundCode = data.findIndex((element) => element.id === productId);
    let foundCart = cartList.findIndex((element) => element.id === cartId);
    const quantity = 1;
    if (foundCode === -1 || foundCart === -1) {
      return 'Product or cart not found. Please check the element or the cart';
    }
    const productLoaded = cartList.flatMap(element=>element.products).findIndex(product=>product.id=== productId)
    if(productLoaded > -1){
      cartList[foundCart].products.quantity = cartList[foundCart].product.quantity + 1
    }else{
      cartList[foundCart].products.push({id: productId, quantity})
    }
    console.log(cartList[foundCart])
    await fs.promises.writeFile(this.path, JSON.stringify(cartList));
    return cartList[foundCart];
  }
}

export default CartManager;
