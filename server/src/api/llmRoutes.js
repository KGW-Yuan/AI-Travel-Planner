import express from 'express';
import { chatWithModel } from '../controllers/llmController.js';

const router = express.Router();

// Route to handle chat with the large language model
router.post('/chat', chatWithModel);

export default router;