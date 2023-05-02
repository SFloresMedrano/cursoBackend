import express from 'express';
import ProductManager from './productManager.js';
const PM = new ProductManager('./src/products.json');

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/products', async (req, res) => {
  const limit = req.query.limit;
  const products = await PM.getProduct();
  if (!limit) {
    res.json(products);
  } else {
    res.json(products.slice(0, limit));
  }
});

app.get('/products/:id', async (req, res) => {
  const id = req.params.id;
  const product = await PM.getProductById(parseInt(id));
  if (product) {
    res.json(product);
  } else {
    res.json({ error: 'Product not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
