import mongoose from 'mongoose';

const HistorySchema = new mongoose.Schema({
    type: { type: String, enum: ['debugging', 'test'], required: true }, // 'debugging' or 'test'
    level: { type: String, required: true },
    score: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    
    // For debugging submissions
    bugsFound: { type: Number },
    totalBugs: { type: Number },
    timeTaken: { type: String }, // e.g., "2m 30s"
    
    // For test submissions
    questions: [
        {
            question: String,
            options: [String],
            correct: String,
        }
    ],
    answers: [String], // User's answers in order
    testTitle: { type: String },
    testDifficulty: { type: String },
});

const UserSchema = new mongoose.Schema({
    googleId: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    name: { type: String },
    picture: { type: String },
    history: [HistorySchema],
    debuggingStats: {
        total: { type: Number, default: 0 },
        avgScore: { type: Number, default: 0 },
    },
    testStats: {
        total: { type: Number, default: 0 },
        avgScore: { type: Number, default: 0 },
    },
});

export default mongoose.model('User', UserSchema);
