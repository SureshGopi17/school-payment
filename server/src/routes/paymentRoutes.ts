import { Router } from 'express';
import { createCollectRequest } from '../controllers/paymentController';

const router = Router();

router.post('/create-collect-request', createCollectRequest);

export default router;
