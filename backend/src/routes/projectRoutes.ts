import { Router } from 'express';
import { ProjectController } from '../controllers/projectController';
import { generalRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public endpoints
router.get('/', generalRateLimiter, ProjectController.getPublishedProjects);
router.get('/:idOrSlug', generalRateLimiter, ProjectController.getPublishedProjectByIdOrSlug);

export default router;
