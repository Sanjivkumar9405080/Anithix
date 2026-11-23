import { Router } from 'express';
import { ContactController } from '../controllers/contactController';
import { authenticate } from '../middleware/authenticate';
import { validateRequest } from '../middleware/validateRequest';
import { contactSubmissionSchema } from '../validators/contactValidators';

const router = Router();

// Both submitting an inquiry and viewing user inquiries require an authenticated session
router.post(
  '/',
  authenticate,
  validateRequest(contactSubmissionSchema),
  ContactController.submitContact
);

router.get(
  '/me',
  authenticate,
  ContactController.getMyContacts
);

export default router;
