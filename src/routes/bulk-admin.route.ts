import { Router } from 'express';
import BulkAdminController from '../controllers/bulk-admin.controller';
import { UserBulkController } from '../controllers/user-bulk.controller';

const bulkAdminRouter = Router();
const bulkAdminController = new BulkAdminController();
const userBulkController = new UserBulkController();

bulkAdminRouter.post('/create', bulkAdminController.createBulkAdmin);
bulkAdminRouter.post('/create-user', userBulkController.createUser);
bulkAdminRouter.patch('/change-status', bulkAdminController.updateAdminStatus);

export default bulkAdminRouter;
