import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import {
    addProduct,
    updateProductQuantity,
    deleteProduct,
    getProductsAdvanced,
    getTopProducts,
    getProducts,
    getTopKStatus,
    rebuildTopK
} from '../controllers/product.controller.js';
import { validate } from '../middlewares/validate.js';
import {
    productSchema,
    updateQuantitySchema,
    getProductsQuerySchema
} from '../validators/product.validation.js';

const productRouter = Router();

productRouter.post('/', authorize, validate(productSchema), addProduct);
productRouter.put('/:id/quantity', authorize, validate(updateQuantitySchema), updateProductQuantity);
productRouter.delete('/:id', authorize, deleteProduct);
productRouter.get('/', authorize, getProducts);
productRouter.get('/advanced', authorize, validate(getProductsQuerySchema), getProductsAdvanced);
productRouter.get('/top-by-quantity', getTopProducts);
productRouter.get('/topk/status', getTopKStatus);
productRouter.post('/topk/rebuild', authorize, rebuildTopK);

export default productRouter;
