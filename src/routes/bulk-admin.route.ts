import { Router } from 'express';
import BulkAdminController from '../controllers/bulk-admin.controller';
import { UserBulkController } from '../controllers/user-bulk.controller';
import verifyToken from '../middlewares/bulk-admin.middleware';

const bulkAdminRouter = Router();
const bulkAdminController = new BulkAdminController();
const userBulkController = new UserBulkController();

bulkAdminRouter.post('/create', bulkAdminController.createBulkAdmin);
bulkAdminRouter.post('/create-user', userBulkController.createUser);
bulkAdminRouter.patch('/change-status', bulkAdminController.updateAdminStatus);
bulkAdminRouter.post('/auth', bulkAdminController.loginAdmin);
bulkAdminRouter.post('/count', verifyToken, bulkAdminController.adminCount);

export default bulkAdminRouter;
