import { Router } from "express";
import ProductManager from "../productManager.js";

const PM = new ProductManager('./src/products.json', './src/id.json');
const router = Router();

router.get('/', async (req, res) => {
    const products = await PM.getProduct()
    res.render('home', {products})
  })
  
  router.get('/realtimeProducts', async (req, res) => {
    const products = await PM.getProduct()
    res.render('realtimeProducts', {products})
  })

  export default router;
  