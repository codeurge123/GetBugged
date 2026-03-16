import express from 'express';
import auth from '../middlewares/auth.js';
import { submitDebugging, submitTest, getProfile, getHistoryDetail, deleteHistoryEntry } from '../controllers/playgroundController.js';
import { generateBug, generateTest, debugCode } from '../controllers/bugController.js';

const router = express.Router();

// Public endpoint for debugging code (no auth required)
router.post('/debug-code', debugCode);

// all other playground routes require authentication
router.use(auth);

router.post('/submit-debugging', submitDebugging);
router.post('/submit-test', submitTest);
router.get('/me', getProfile);
router.get('/history/:historyId', getHistoryDetail);
router.delete('/history/:historyId', deleteHistoryEntry);
router.post('/generate-bug', generateBug);
router.post('/generate-test', generateTest);

export default router;
