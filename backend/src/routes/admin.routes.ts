import { Router } from 'express';
import { getAuditLogs, getUsers, createUser, updateUser } from '../controllers/admin.controller';

const router = Router();

// In a real app, add middleware like authenticateToken and requireAdminRole here
router.get('/audit-logs', getAuditLogs);
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);

export default router;
