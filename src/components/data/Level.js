const LEVELS = [
  {
    id: 1,
    label: "LEVEL 01",
    name: "Learner",
    tagline: "Learn to Debug",
    desc: "Subtle, realistic beginner mistakes.",
    color: "#4ade80",
    icon: "◎",
    prompt: (code) => `
You are rewriting code written by a beginner developer.

Rewrite the following code so that it contains 2-3 natural, realistic mistakes that a junior developer might accidentally make.

The mistakes should:
- Feel accidental, not intentionally injected
- Be small logical oversights or minor misunderstandings
- Keep the code syntactically valid and runnable
- Not break the overall structure

Return ONLY the rewritten code. No explanations.

Code:
${code}
`
  },

  {
    id: 2,
    label: "LEVEL 02",
    name: "Challenger",
    tagline: "Strengthen Your Skills",
    desc: "Mid-level realistic developer mistakes.",
    color: "#facc15",
    icon: "◈",
    prompt: (code) => `
You are rewriting code written by an intermediate developer working under time pressure.

Rewrite the following code to include 3-5 subtle, realistic implementation mistakes.

The mistakes should:
- Look like real-world production bugs
- Include logic oversights, incorrect assumptions, edge case failures, or state handling issues
- Keep the code valid and runnable
- Not look artificial or intentionally sabotaged

The result should feel like real code that accidentally contains flaws.

Return ONLY the rewritten code.

Code:
${code}
`
  },

  {
    id: 3,
    label: "LEVEL 03",
    name: "☠ CHAOS MODE",
    tagline: "You Asked For It",
    desc: "Deep, production-level hidden flaws.",
    color: "#f87171",
    prompt: (code) => `
You are rewriting production code written by a senior developer who introduced subtle, hard-to-detect flaws.

Rewrite the following code so it contains 6-10 deep, natural, hard-to-notice issues.

The bugs should:
- Be realistic production-grade flaws
- Include edge-case failures, subtle logic inversions, incorrect calculations, silent data corruption, performance traps, or flawed assumptions
- Keep the code fully syntactically valid and runnable
- Not look intentionally sabotaged
- Blend naturally into the code

The output should feel like authentic production code with hidden problems.

Return ONLY the rewritten code.

Code:
${code}
`
  }
];

export default LEVELS;