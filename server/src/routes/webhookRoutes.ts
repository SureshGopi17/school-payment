import { Router } from 'express';
import { handleWebhook } from '../controllers/webhookController';

const router = Router();

// iv) Webhook for Status Updates
router.post('/', handleWebhook);

export default router;
