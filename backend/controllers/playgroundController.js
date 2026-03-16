import User from '../models/User.js';

// Calculate debugging score based on how many lines were fixed
function calculateDebuggingScore(original, buggedCode, fixedCode) {
    const origLines = original.trim().split("\n");
    const buggedLines = buggedCode.trim().split("\n");
    const fixedLines = fixedCode.trim().split("\n");
    
    let matches = 0;
    let totalBugs = 0;
    
    // Count lines that match between original and fixed code
    origLines.forEach((line, i) => {
        if (fixedLines[i] && fixedLines[i].trim() === line.trim()) {
            matches++;
        }
    });
    
    // Count how many lines differ between original and bugged
    origLines.forEach((line, i) => {
        if (!buggedLines[i] || buggedLines[i].trim() !== line.trim()) {
            totalBugs++;
        }
    });
    
    const score = origLines.length > 0 ? Math.round((matches / origLines.length) * 100) : 0;
    const bugsFound = Math.max(0, totalBugs > 0 ? Math.round((matches / totalBugs) * 100) : 0);
    
    return { score, bugsFound, totalBugs };
}

async function submitDebugging(req, res) {
    const { level, score, bugsFound, totalBugs, timeTaken, originalCode, buggedCode, fixedCode } = req.body;
    
    if (!level || typeof score !== 'number') {
        return res.status(400).json({ message: 'Level and numeric score required' });
    }
    
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Recalculate score from codes if provided
        let finalScore = score;
        let finalBugsFound = bugsFound;
        let finalTotalBugs = totalBugs;
        
        if (originalCode && buggedCode && fixedCode) {
            const calculated = calculateDebuggingScore(originalCode, buggedCode, fixedCode);
            finalScore = calculated.score;
            finalBugsFound = calculated.bugsFound;
            finalTotalBugs = calculated.totalBugs;
        }
        
        const historyEntry = {
            type: 'debugging',
            level,
            score: finalScore,
            bugsFound: finalBugsFound,
            totalBugs: finalTotalBugs,
            timeTaken: timeTaken || '0m 0s',
            date: new Date(),
        };
        
        user.history.push(historyEntry);
        
        // Update debugging stats
        const debuggingEntries = user.history.filter(h => h.type === 'debugging');
        const totalScore = debuggingEntries.reduce((sum, h) => sum + h.score, 0);
        user.debuggingStats.total = debuggingEntries.length;
        user.debuggingStats.avgScore = debuggingEntries.length > 0 ? Math.round(totalScore / debuggingEntries.length) : 0;
        
        await user.save();
        res.json({ 
            message: 'Debugging result recorded', 
            score: finalScore,
            history: user.history 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

async function submitTest(req, res) {
    const { level, score, questions, answers, testTitle, testDifficulty } = req.body;
    
    if (!level || typeof score !== 'number' || !questions || !answers) {
        return res.status(400).json({ message: 'Level, score, questions, and answers required' });
    }
    
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const historyEntry = {
            type: 'test',
            level,
            score,
            questions,
            answers,
            testTitle: testTitle || 'Debugging Test',
            testDifficulty: testDifficulty || 'Medium',
            date: new Date(),
        };
        
        user.history.push(historyEntry);
        
        // Update test stats
        const testEntries = user.history.filter(h => h.type === 'test');
        const totalScore = testEntries.reduce((sum, h) => sum + h.score, 0);
        user.testStats.total = testEntries.length;
        user.testStats.avgScore = testEntries.length > 0 ? Math.round(totalScore / testEntries.length) : 0;
        
        await user.save();
        res.json({ 
            message: 'Test result recorded', 
            score,
            history: user.history 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

async function getProfile(req, res) {
    try {
        const user = await User.findById(req.user.id).select('-__v');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

async function getHistoryDetail(req, res) {
    const { historyId } = req.params;
    
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const entry = user.history.id(historyId);
        if (!entry) {
            return res.status(404).json({ message: 'History entry not found' });
        }
        
        res.json(entry);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

async function deleteHistoryEntry(req, res) {
    const { historyId } = req.params;
    
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const entry = user.history.id(historyId);
        if (!entry) {
            return res.status(404).json({ message: 'History entry not found' });
        }
        
        // Remove the entry
        user.history.pull(historyId);
        
        // Update stats based on remaining entries
        if (entry.type === 'debugging') {
            const debuggingEntries = user.history.filter(h => h.type === 'debugging');
            const totalScore = debuggingEntries.reduce((sum, h) => sum + h.score, 0);
            user.debuggingStats.total = debuggingEntries.length;
            user.debuggingStats.avgScore = debuggingEntries.length > 0 ? Math.round(totalScore / debuggingEntries.length) : 0;
        } else if (entry.type === 'test') {
            const testEntries = user.history.filter(h => h.type === 'test');
            const totalScore = testEntries.reduce((sum, h) => sum + h.score, 0);
            user.testStats.total = testEntries.length;
            user.testStats.avgScore = testEntries.length > 0 ? Math.round(totalScore / testEntries.length) : 0;
        }
        
        await user.save();
        res.json({ 
            message: 'History entry deleted',
            history: user.history 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

export { submitDebugging, submitTest, getProfile, getHistoryDetail, deleteHistoryEntry };
