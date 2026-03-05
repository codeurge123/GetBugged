import express from 'express';
import auth from '../middlewares/auth.js';
import { 
  createBlog, 
  getAllBlogs, 
  getBlogById, 
  updateBlog, 
  deleteBlog, 
  likeBlog, 
  getMyBlogs,
  searchBlogs
} from '../controllers/blogController.js';

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/search', searchBlogs);
router.get('/:id', getBlogById);

// Protected routes (require authentication)
router.use(auth);

router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);
router.post('/:id/like', likeBlog);
router.get('/my/blogs', getMyBlogs);

export default router;
