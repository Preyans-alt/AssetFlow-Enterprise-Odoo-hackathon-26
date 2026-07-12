import { Router } from 'express';
import {
  getCategories,
  createCategory,
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  allocateAsset,
  returnAsset
} from '../controllers/assetController';
import { authenticate, authorizeRole } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// Category endpoints
router.get('/categories', getCategories);
router.post('/categories', authorizeRole(['ADMIN', 'ASSET_MANAGER']), createCategory);

// Asset endpoints
router.get('/', getAssets);
router.get('/:id', getAssetById);
router.post('/', authorizeRole(['ADMIN', 'ASSET_MANAGER']), createAsset);
router.put('/:id', authorizeRole(['ADMIN', 'ASSET_MANAGER']), updateAsset);
router.post('/:id/allocate', authorizeRole(['ADMIN', 'ASSET_MANAGER']), allocateAsset);
router.post('/:id/return', authorizeRole(['ADMIN', 'ASSET_MANAGER']), returnAsset);

export default router;
