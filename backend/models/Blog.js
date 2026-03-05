import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    authorName: { type: String, required: true },
    authorEmail: { type: String, required: true },
    category: { type: String, default: 'General' },
    tags: [{ type: String }],
    likes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }],
    likeCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Ensure indexes
BlogSchema.index({ author: 1 });
BlogSchema.index({ createdAt: -1 });
BlogSchema.index({ tags: 1 });

export default mongoose.model('Blog', BlogSchema);
