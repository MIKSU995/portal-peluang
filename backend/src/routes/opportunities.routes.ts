import { Router } from 'express';
import { getOpportunities, getRecommended } from '../controllers/opportunities.controller';

const router = Router();

router.get('/', getOpportunities);
router.get('/recommended', getRecommended);

export default router;