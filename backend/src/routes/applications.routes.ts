import { Router } from 'express';
import { getUserApplications, updateApplicationStatus, removeApplication } from '../controllers/applications.controller';

const router = Router();

router.get('/', getUserApplications);
router.put('/', updateApplicationStatus);
router.delete('/:opportunityId', removeApplication);

export default router;