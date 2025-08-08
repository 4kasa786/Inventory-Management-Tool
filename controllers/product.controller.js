import Product from '../models/product.model.js';
import topKManager from '../utils/TopKProducts.js';

export const addProduct = async (req, res, next) => {
    try {
        const { name, type, sku, image_url, description, quantity, price } = req.body;

        const existingProduct = await Product.findOne({ sku });
        if (existingProduct) {
            return res.status(409).json({ error: 'Product with this SKU already exists' });
        }

        const userId = req.user._id;

        const product = new Product({
            name, type, sku, image_url, description, quantity, price, createdBy: userId
        });

        const savedProduct = await product.save();


        topKManager.addOrUpdate(savedProduct._id.toString(), quantity);

        res.status(201).json({
            message: 'Product created successfully',
            product_id: savedProduct._id,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProductQuantity = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (quantity === undefined || quantity < 0) {
            return res.status(400).json({ error: 'Valid quantity required' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { quantity },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        topKManager.addOrUpdate(id.toString(), quantity);

        res.status(200).json({
            message: 'Quantity updated successfully',
            product_id: updatedProduct._id,
            quantity: updatedProduct.quantity
        });

    } catch (error) {
        next(error);
    }
};


export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Product not found' });
        }

        topKManager.remove(id.toString());

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};


export const getTopProducts = async (req, res, next) => {
    try {
        const topIds = topKManager.getTopK();
        const products = await Product.find({ _id: { $in: topIds } });

        const idToProduct = Object.fromEntries(
            products.map(p => [p._id.toString(), p])
        );

        const ordered = topIds.map(id => {
            const product = idToProduct[id];
            return product
                ? { product_id: id, ...product._doc }
                : { product_id: id, error: 'Product not found in DB' };
        });

        res.status(200).json(ordered);
    } catch (error) {
        next(error);
    }
};


export const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find()
            .sort({ createdAt: -1 })
            .select('_id name type sku image_url description quantity price createdAt updatedAt');

        const formatted = products.map(product => ({
            product_id: product._id,
            name: product.name,
            type: product.type,
            sku: product.sku,
            image_url: product.image_url,
            description: product.description,
            quantity: product.quantity,
            price: product.price,
            created_at: product.createdAt,
            updated_at: product.updatedAt
        }));

        res.status(200).json(formatted);
    } catch (error) {
        next(error);
    }
};


export const getProductsAdvanced = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            type,
            search
        } = req.query;

        const skip = (page - 1) * limit;
        const filter = {};

        if (type) filter.type = type;

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } }
            ];
        }

        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const [products, totalProducts] = await Promise.all([
            Product.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate('createdBy', 'name email'),
            Product.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(totalProducts / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.status(200).json({
            success: true,
            message: 'Products retrieved successfully',
            data: {
                products,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalProducts,
                    productsPerPage: limit,
                    hasNextPage,
                    hasPrevPage,
                    nextPage: hasNextPage ? page + 1 : null,
                    prevPage: hasPrevPage ? page - 1 : null
                }
            }
        });
    } catch (error) {
        next(error);
    }
};


export const getTopKStatus = async (req, res, next) => {
    try {
        const status = topKManager.getStatus();
        res.status(200).json(status);
    } catch (error) {
        next(error);
    }
};

export const rebuildTopK = async (req, res, next) => {
    try {
        const topProducts = await Product.find({})
            .sort({ quantity: -1 })
            .limit(20); // can be more than K

        const topData = topProducts.map(p => ({
            id: p._id.toString(),
            quantity: p.quantity
        }));

        topKManager.rebuildFromData(topData);

        res.status(200).json({
            message: 'Top K cache rebuilt successfully',
            topK_ids: topKManager.getTopK(),
        });
    } catch (error) {
        next(error);
    }
};
