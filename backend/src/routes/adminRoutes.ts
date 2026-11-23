import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middleware/authenticate';
import { authRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// 1. Admin Login (Public endpoint with auth rate limiting)
router.post('/login', authRateLimiter, AdminController.adminLogin);

// 2. All endpoints below strictly require an authenticated administrator session
router.use(authenticate, requireAdmin);

// Dashboard Overview
router.get('/dashboard', AdminController.getDashboard);

// Project Management (Add, Edit, Publish/Unpublish, Delete)
router.get('/projects', AdminController.getProjects);
router.get('/projects/:id', AdminController.getProjectById);
router.post('/projects', AdminController.createProject);
router.patch('/projects/:id', AdminController.updateProject);
router.patch('/projects/:id/publish', AdminController.togglePublishProject);
router.delete('/projects/:id', AdminController.deleteProject);

// Client Requests / Messages & Inquiries
router.get('/requests', AdminController.getMessages);
router.get('/requests/:id', AdminController.getMessageById);
router.patch('/requests/:id/status', AdminController.updateMessageStatus);
router.patch('/requests/:id/notes', AdminController.updateMessageNotes);
router.delete('/requests/:id', AdminController.deleteMessage);

router.get('/messages', AdminController.getMessages);
router.get('/messages/:id', AdminController.getMessageById);
router.patch('/messages/:id/status', AdminController.updateMessageStatus);
router.patch('/messages/:id/notes', AdminController.updateMessageNotes);
router.delete('/messages/:id', AdminController.deleteMessage);

// User / Client Management
router.get('/users/search', AdminController.searchUsersForDemo);
router.get('/users', AdminController.getUsers);
router.get('/users/:id', AdminController.getUserById);

// Admin-to-User Demo Management
router.get('/demos', AdminController.getDemos);
router.get('/demos/:id', AdminController.getDemoById);
router.post('/demos', AdminController.createDemo);
router.patch('/demos/:id', AdminController.updateDemo);
router.patch('/demos/:id/publish', AdminController.togglePublishDemo);
router.delete('/demos/:id', AdminController.deleteDemo);

// Direct Email Clients & Communication History
router.post('/email/send', AdminController.sendEmailToClient);
router.get('/email/activities', AdminController.getEmailActivities);
router.get('/email/history/:requestId', AdminController.getEmailHistoryForRequest);
router.get('/email/user-history/:userId', AdminController.getEmailHistoryForUser);

// System & Email Settings
router.get('/settings', AdminController.getSettings);

// Export Inquiries as CSV
router.get('/export/messages', AdminController.exportMessagesCsv);

export default router;
