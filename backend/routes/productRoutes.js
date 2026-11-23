const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(protect);

// Consultation : Admin et User
router.get('/', getProducts);
router.get('/:id', getProductById);

// Création, modification, suppression : Admin uniquement
router.post('/', authorizeRoles('Admin'), createProduct);
router.put('/:id', authorizeRoles('Admin'), updateProduct);
router.delete('/:id', authorizeRoles('Admin'), deleteProduct);

module.exports = router;