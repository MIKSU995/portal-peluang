import { Router } from 'express';
import { getTeamPosts, createTeamPost } from '../controllers/team.controller';

const router = Router();

router.get('/', getTeamPosts);
router.post('/', createTeamPost);

export default router;