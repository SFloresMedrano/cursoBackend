import fs from 'fs';

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProduct() {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, 'utf8');
        return JSON.parse(data);
      }
      await fs.promises.writeFile(this.path, JSON.stringify([]));
      return [];
    } catch (error) {
      error.message = `Error al leer data`;
      throw new Error(error.message);
    }
  }

  async readId() {
    try {
      if (fs.existsSync('id.json')) {
        const idString = await fs.promises.readFile('id.json', 'utf-8');
        const id = JSON.parse(idString);
        return id;
      }
      await fs.promises.writeFile('id.json', JSON.stringify(0));
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async addProduct(product) {
    try {
      let data = await this.getProduct();
      let idFile = await this.readId();
      let foundCode = data.findIndex(
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

      if (foundCode === -1) {
        idFile++;
        await fs.promises.writeFile('id.json', JSON.stringify(idFile++));
        product = { ...product, id: idFile };
        data.push(product);
        const productsString = JSON.stringify(data);
        await fs.promises.writeFile(this.path, productsString);
        return `El producto ${product.title} fue agregado`;
      } else {
        return `El codigo no es válido o el producto no es válido`;
      }
    } catch (error) {
      error.message = 'Error al cargar los productos';
      return error.message;
    }
  }

  async getProductById(id) {
    try {
      let data = await this.getProduct();
      let foundCode = data.findIndex((element) => element.id === id);
      if (foundCode === -1) {
        throw new Error();
      }
      return data[foundCode];
    } catch (error) {
      error.message = 'Error al obtener el producto';
      return error.message;
    }
  }

  async updateProduct(id, modProps) {
    try {
      let data = await this.getProduct();
      let foundCode = data.findIndex((element) => element.id === id);
      if (foundCode === -1 || !modProps) {
        return `Code not found or wrong properties`;
      } else {
        let modProd = {};
        modProd.id = id;
        if (modProps.title) data[foundCode].title = modProps.title;
        if (modProps.description)
          data[foundCode].description = modProps.description;
        if (modProps.price) data[foundCode].price = modProps.price;
        if (modProps.thumbnail) data[foundCode].thumbnail = modProps.thumbnail;
        if (modProps.code) data[foundCode].code = modProps.code;
        if (modProps.stock) data[foundCode].stock = modProps.stock;
        const productsString = JSON.stringify(data);
        await fs.promises.writeFile(this.path, productsString);
        return data[foundCode];
      }
    } catch (error) {
      error.message = 'Error al modificar el objeto';
      return error.message;
    }
  }

  async deleteProducts(id) {
    let data = await this.getProduct();
    let foundCode = data.findIndex((element) => element.id === id);
    if (foundCode === -1) {
      return `El codigo ${id} no se encuentra cargado`;
    } else {
      data.splice(foundCode, 1);
      const productsString = JSON.stringify(data);
      await fs.promises.writeFile('products.json', productsString);
      return 'El elemento fue borrado';
    }
  }
}

const product1 = {
  title: 'producto prueba',
  description: 'Este es un producto prueba',
  price: 200,
  thumbnail: 'Sin imagen',
  code: 'abc123',
  stock: 25,
};

const product2 = {
  title: 'producto prueba 2 ',
  description: 'Este es un producto prueba 2',
  price: 300,
  thumbnail: 'Sin imagen',
  code: 'Alfa500',
  stock: 300,
};

export default ProductManager;

