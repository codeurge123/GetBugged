async function generateBug(req, res) {
  const { code, levelId } = req.body;
  if (!code || !levelId) {
    return res.status(400).json({ message: 'Code and levelId required' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'Gemini API key not configured' });
    }

    // Map levelId to prompt instructions (you should define this based on your levels)
    const prompts = {
      1: 'Introduce 2-3 subtle bugs in this JavaScript code. Keep the logic similar but broken.',
      2: 'Introduce 3-4 medium-difficulty bugs in this code. Make them harder to spot.',
      3: 'Introduce 4-5 complex bugs in this code. Include edge cases and async issues.',
      4: 'Introduce 5+ advanced bugs including performance issues and security vulnerabilities.',
    };

    const prompt = prompts[levelId] || prompts[1];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${prompt}\n\nCode:\n${code}\n\nIMPORTANT: Return ONLY the raw bugged code. No comments, no explanations, no markdown fences.`
            }]
          }],
          generationConfig: {
            temperature: levelId === 3 ? 1.0 : 0.7,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || `API Error ${response.status}`);
    }

    const data = await response.json();
    let result = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    result = result
      .replace(/^```[\w]*\n?/gm, '')
      .replace(/\n?```$/gm, '')
      .replace(/^\s*\/\/.*$/gm, '')
      .replace(/^\s*#.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .trim();

    res.json({ buggedCode: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Failed to generate bug' });
  }
}

async function generateTest(req, res) {
  const { difficulty } = req.body;
  if (!difficulty) {
    return res.status(400).json({ message: 'Difficulty level required' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'Gemini API key not configured' });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate exactly 10 UNIQUE and DIFFERENT debugging MCQ questions at ${difficulty} difficulty.
IMPORTANT: Each question MUST be completely different from any previously generated questions. Use diverse scenarios.
Each question must be a real debugging scenario (find the bug, predict output, fix syntax, logic errors, edge cases, etc.)
Vary the programming concepts: include JavaScript, React, async/await, closures, scope, array methods, object manipulation, etc.
Return ONLY a valid JSON array. No markdown, no explanation. Format:
[{"question":"...","options":["A","B","C","D"],"correct":"A"},...]`
            }]
          }],
          generationConfig: { temperature: 0.9, maxOutputTokens: 8192 },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'API failed');
    }

    const data = await response.json();
    let raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    raw = raw.replace(/^```[\w]*\n?/gm, '').replace(/\n?```$/gm, '').trim();
    
    const questions = JSON.parse(raw);
    res.json({ questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Failed to generate test' });
  }
}

async function debugCode(req, res) {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ message: 'Code required' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'Gemini API key not configured' });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze this code and provide detailed debugging information. Return a JSON object with the following structure:
{
  "bugFound": true/false,
  "bugs": [
    {
      "line": "line number or approximate location",
      "issue": "description of the bug",
      "severity": "critical/major/minor",
      "explanation": "why this is a bug"
    }
  ],
  "correctedCode": "the fixed code with all bugs removed (or same code if no bugs)",
  "bestPractices": [
    "best practice suggestion 1",
    "best practice suggestion 2",
    "best practice suggestion 3"
  ],
  "summary": "brief summary of findings"
}

Code to analyze:
\`\`\`
${code}
\`\`\`

IMPORTANT: Return ONLY valid JSON. No markdown, no explanation, no code fences. Provide corrected code without markdown formatting.`
            }]
          }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'API failed');
    }

    const data = await response.json();
    let raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    raw = raw.replace(/^```[\w]*\n?/gm, '').replace(/\n?```$/gm, '').trim();
    
    const analysis = JSON.parse(raw);
    res.json(analysis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Failed to analyze code' });
  }
}

export { generateBug, generateTest, debugCode };
