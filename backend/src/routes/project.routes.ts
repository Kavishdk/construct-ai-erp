import { Router } from 'express';
import { getProjects, getProjectRisk, getProjectAiInsight } from '../controllers/project.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getProjects);
router.get('/:id/risk', authenticateToken, getProjectRisk);
router.get('/:id/insight', authenticateToken, getProjectAiInsight);

export default router;
