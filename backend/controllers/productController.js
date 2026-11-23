const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const Order = require('../models/Order');
const StockMovement = require('../models/StockMovement');

// POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, reference, category, description, price, quantity, minThreshold, supplier } = req.body;

    if (!name || !reference || price === undefined || price === null) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir au moins le nom, la référence et le prix',
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({ success: false, message: 'Le prix ne peut pas être négatif' });
    }
    if (quantity !== undefined && Number(quantity) < 0) {
      return res.status(400).json({ success: false, message: 'La quantité ne peut pas être négative' });
    }
    if (minThreshold !== undefined && Number(minThreshold) < 0) {
      return res.status(400).json({ success: false, message: 'Le seuil minimum ne peut pas être négatif' });
    }

    const existing = await Product.findOne({ reference: reference.toUpperCase().trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Un produit avec cette référence existe déjà' });
    }

    if (supplier) {
      const supplierExists = await Supplier.findById(supplier);
      if (!supplierExists) {
        return res.status(400).json({ success: false, message: 'Le fournisseur spécifié n\'existe pas' });
      }
    }

    const product = await Product.create({
      name: name.trim(),
      reference: reference.trim(),
      category,
      description,
      price,
      quantity: quantity !== undefined ? quantity : 0,
      minThreshold: minThreshold !== undefined ? minThreshold : 0,
      supplier: supplier || null,
    });

    const populated = await Product.findById(product._id).populate('supplier');

    return res.status(201).json({
      success: true,
      message: 'Produit créé avec succès',
      data: populated,
    });
  } catch (error) {
    console.error('Create product error:', error.message);
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Un produit avec cette référence existe déjà' });
    }
    return res.status(500).json({ success: false, message: 'Erreur lors de la création du produit' });
  }
};

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const { search, category, page, limit } = req.query;

    const filter = {};
    if (category) {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { reference: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const limitNum = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).populate('supplier').skip(skip).limit(limitNum).sort({ createdAt: -1 }),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    console.error('Get products error:', error.message);
    return res.status(500).json({ success: false, message: 'Erreur lors de la récupération des produits' });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('supplier');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Get product by id error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    }
    return res.status(500).json({ success: false, message: 'Erreur lors de la récupération du produit' });
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    }

    const updates = { ...req.body };

    // Ne pas permettre de modifier directement la quantité de stock
    if (Object.prototype.hasOwnProperty.call(updates, 'quantity')) {
      delete updates.quantity;
    }

    if (updates.reference) {
      const newRef = updates.reference.toUpperCase().trim();
      const existing = await Product.findOne({ reference: newRef, _id: { $ne: product._id } });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Un produit avec cette référence existe déjà' });
      }
      updates.reference = newRef;
    }

    if (updates.price !== undefined && Number(updates.price) < 0) {
      return res.status(400).json({ success: false, message: 'Le prix ne peut pas être négatif' });
    }
    if (updates.minThreshold !== undefined && Number(updates.minThreshold) < 0) {
      return res.status(400).json({ success: false, message: 'Le seuil minimum ne peut pas être négatif' });
    }

    if (updates.supplier) {
      const supplierExists = await Supplier.findById(updates.supplier);
      if (!supplierExists) {
        return res.status(400).json({ success: false, message: 'Le fournisseur spécifié n\'existe pas' });
      }
    } else if (updates.supplier === null) {
      // autorisé : retirer le fournisseur
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, {
      returnDocument: 'after',
      runValidators: true,
    }).populate('supplier');

    return res.status(200).json({
      success: true,
      message: 'Produit modifié avec succès',
      data: updated,
    });
  } catch (error) {
    console.error('Update product error:', error.message);
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Un produit avec cette référence existe déjà' });
    }
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    }
    return res.status(500).json({ success: false, message: 'Erreur lors de la modification du produit' });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    }

    const [orderRef, movementRef] = await Promise.all([
      Order.findOne({ 'products.product': product._id }),
      StockMovement.findOne({ product: product._id }),
    ]);

    if (orderRef || movementRef) {
      return res.status(409).json({
        success: false,
        message: 'Impossible de supprimer ce produit car il est référencé dans des commandes ou des mouvements de stock',
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({ success: true, message: 'Produit supprimé avec succès' });
  } catch (error) {
    console.error('Delete product error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    }
    return res.status(500).json({ success: false, message: 'Erreur lors de la suppression du produit' });
  }
};

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct };