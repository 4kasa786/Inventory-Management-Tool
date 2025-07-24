import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { addProduct, getProductsAdvanced, updateProductQuantity } from '../controllers/product.controller.js';
import { validate } from '../middlewares/validate.js';
import { productSchema } from '../validators/product.validation.js'
import { updateQuantitySchema } from '../validators/product.validation.js';
import { getProductsQuerySchema } from '../validators/product.validation.js';
import { getProducts } from '../controllers/product.controller.js';

const productRouter = Router();

productRouter.post('/', authorize, validate(productSchema), addProduct);

productRouter.put('/:id/quantity', authorize, validate(updateQuantitySchema), updateProductQuantity);

productRouter.get('/', authorize, getProducts);

productRouter.get('/advanced', authorize, getProductsAdvanced);

export default productRouter;   