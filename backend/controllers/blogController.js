import Blog from '../models/Blog.js';

async function createBlog(req, res) {
  const { title, content, category, tags } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content required' });
  }
  
  try {
    const user = req.user;
    const blog = await Blog.create({
      title: title.trim(),
      content: content.trim(),
      author: user.id,
      authorName: user.name || 'Anonymous',
      authorEmail: user.email,
      category: category || 'General',
      tags: tags && Array.isArray(tags) ? tags : [],
    });
    
    res.status(201).json({ 
      message: 'Blog created successfully',
      blog: blog
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getAllBlogs(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name email')
      .populate('likes', '_id');
    
    const total = await Blog.countDocuments();
    
    res.json({
      blogs,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getBlogById(req, res) {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
    .populate('author', 'name email')
    .populate('likes', 'name email');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function updateBlog(req, res) {
  const { title, content, category, tags } = req.body;
  
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Check if user is the author
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this blog' });
    }
    
    if (title) blog.title = title.trim();
    if (content) blog.content = content.trim();
    if (category) blog.category = category;
    if (tags) blog.tags = tags;
    blog.updatedAt = new Date();
    
    await blog.save();
    
    res.json({ 
      message: 'Blog updated successfully',
      blog
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function deleteBlog(req, res) {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Check if user is the author
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }
    
    await Blog.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function likeBlog(req, res) {
  try {
    const userId = req.user.id;
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    const likeIndex = blog.likes.indexOf(userId);
    
    if (likeIndex === -1) {
      // Add like
      blog.likes.push(userId);
      blog.likeCount += 1;
    } else {
      // Remove like
      blog.likes.splice(likeIndex, 1);
      blog.likeCount = Math.max(0, blog.likeCount - 1);
    }
    
    await blog.save();
    
    res.json({
      message: likeIndex === -1 ? 'Blog liked' : 'Blog unliked',
      liked: likeIndex === -1,
      likeCount: blog.likeCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getMyBlogs(req, res) {
  try {
    const blogs = await Blog.find({ author: req.user.id })
      .sort({ createdAt: -1 })
      .populate('author', 'name email')
      .populate('likes', '_id');
    
    res.json({ blogs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function searchBlogs(req, res) {
  try {
    const { query, tag } = req.query;
    let filter = {};
    
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
      ];
    }
    
    if (tag) {
      filter.tags = tag;
    }
    
    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .populate('author', 'name email')
      .populate('likes', '_id');
    
    res.json({ blogs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog, likeBlog, getMyBlogs, searchBlogs };
