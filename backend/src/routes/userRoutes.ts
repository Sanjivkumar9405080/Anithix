import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// 1. User Profile Management
router.get('/me', authenticate, UserController.getProfile);
router.get('/profile', authenticate, UserController.getProfile); // backwards-compatible alias
router.patch('/me', authenticate, UserController.updateProfile);
router.patch('/profile', authenticate, UserController.updateProfile);
router.post('/me/avatar', authenticate, UserController.uploadAvatar);
router.delete('/me/avatar', authenticate, UserController.removeAvatar);

// 2. User Contact Inquiries
router.get('/me/requests', authenticate, UserController.getUserRequests);
router.get('/me/requests/:id', authenticate, UserController.getUserRequestById);

// 3. User Shared Demos
router.get('/me/demos', authenticate, UserController.getUserDemos);
router.get('/me/demos/:id', authenticate, UserController.getUserDemoById);

// 4. User In-App Notifications
router.get('/me/notifications', authenticate, UserController.getUserNotifications);
router.patch('/me/notifications/:id/read', authenticate, UserController.markNotificationRead);
router.patch('/me/notifications/read-all', authenticate, UserController.markAllNotificationsRead);

export default router;
