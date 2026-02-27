import React from "react";

export default function DebuggingGuide() {
  return (
    <div className="space-y-16">

      {/* Header */}
      <header>
        <h1 className="text-4xl font-bold mb-4">Debugging Guide</h1>
        <p className="text-white/60 leading-8 text-lg">
          Debugging is a structured investigation process. Professional engineers
          diagnose issues using logic, controlled experiments, and systematic
          reasoning — not guesswork.
        </p>
      </header>

      {/* Mindset */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">The Debugging Mindset</h2>

        <p className="text-white/60 leading-8">
          Treat every bug like a detective case. Observe symptoms,
          form hypotheses, test assumptions, and isolate the root cause.
        </p>

        <div className="bg-white/5 border border-white/10 p-4 rounded-md">
          <p className="text-white/70">
            Ask:
          </p>
          <ul className="list-disc list-inside text-white/60 mt-2 space-y-1">
            <li>What exactly is failing?</li>
            <li>When does it fail?</li>
            <li>Why does it fail?</li>
          </ul>
        </div>
      </section>

      {/* Step 1 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          1. Understand Expected Behavior
        </h2>

        <p className="text-white/60 leading-8">
          You cannot fix something unless you know how it should behave.
        </p>

        <h3 className="text-xl font-medium">Example</h3>

        <pre className="bg-black border border-white/10 p-4 rounded-md text-sm overflow-x-auto">
{`function isEven(num) {
  return num % 2;
}

console.log(isEven(4)); // 0 (unexpected)
`}
        </pre>

        <p className="text-white/60 leading-8">
          The function returns 0 instead of true. Expected behavior is boolean.
        </p>

        <pre className="bg-black border border-white/10 p-4 rounded-md text-sm overflow-x-auto">
{`function isEven(num) {
  return num % 2 === 0;
}
`}
        </pre>
      </section>

      {/* Step 2 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          2. Reproduce the Issue
        </h2>

        <p className="text-white/60 leading-8">
          Bugs that cannot be reproduced cannot be reliably fixed.
        </p>

        <h3 className="text-xl font-medium">Example</h3>

        <pre className="bg-black border border-white/10 p-4 rounded-md text-sm overflow-x-auto">
{`function greet(user) {
  return "Hello " + user.name;
}

greet(null); // Crash
`}
        </pre>

        <p className="text-white/60 leading-8">
          Reproducing with null shows the crash consistently.
        </p>
      </section>

      {/* Step 3 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          3. Isolate the Root Cause
        </h2>

        <p className="text-white/60 leading-8">
          The crash is not the root cause. The root cause is unsafe data access.
        </p>

        <pre className="bg-black border border-white/10 p-4 rounded-md text-sm overflow-x-auto">
{`function greet(user) {
  if (!user || !user.name) {
    return "Hello Guest";
  }
  return "Hello " + user.name;
}
`}
        </pre>
      </section>

      {/* Step 4 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          4. Debugging Async Issues
        </h2>

        <p className="text-white/60 leading-8">
          Many modern bugs occur due to improper asynchronous handling.
        </p>

        <h3 className="text-xl font-medium">❌ Missing await</h3>

        <pre className="bg-black border border-white/10 p-4 rounded-md text-sm overflow-x-auto">
{`async function fetchData() {
  const response = fetch("/api/data");
  return response.json();
}
`}
        </pre>

        <p className="text-white/60 leading-8">
          This returns a Promise instead of resolved data.
        </p>

        <h3 className="text-xl font-medium">✅ Correct</h3>

        <pre className="bg-black border border-white/10 p-4 rounded-md text-sm overflow-x-auto">
{`async function fetchData() {
  const response = await fetch("/api/data");
  return await response.json();
}
`}
        </pre>
      </section>

      {/* Step 5 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          5. Debugging State Issues (React Example)
        </h2>

        <p className="text-white/60 leading-8">
          Mutating state directly is a common bug.
        </p>

        <h3 className="text-xl font-medium">❌ Incorrect</h3>

        <pre className="bg-black border border-white/10 p-4 rounded-md text-sm overflow-x-auto">
{`const [count, setCount] = useState(0);

function increment() {
  count++;
  setCount(count);
}
`}
        </pre>

        <p className="text-white/60 leading-8">
          React state should not be mutated directly.
        </p>

        <h3 className="text-xl font-medium">✅ Correct</h3>

        <pre className="bg-black border border-white/10 p-4 rounded-md text-sm overflow-x-auto">
{`function increment() {
  setCount(prev => prev + 1);
}
`}
        </pre>
      </section>

      {/* Advanced */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          Advanced: Race Condition Example
        </h2>

        <p className="text-white/60 leading-8">
          Race conditions happen when multiple async operations compete.
        </p>

        <pre className="bg-black border border-white/10 p-4 rounded-md text-sm overflow-x-auto">
{`let data;

async function load() {
  fetch("/api/data").then(res => res.json()).then(d => {
    data = d;
  });

  console.log(data); // undefined
}
`}
        </pre>

        <p className="text-white/60 leading-8">
          Logging happens before async completion.
        </p>

        <pre className="bg-black border border-white/10 p-4 rounded-md text-sm overflow-x-auto">
{`async function load() {
  const res = await fetch("/api/data");
  const data = await res.json();
  console.log(data);
}
`}
        </pre>
      </section>

      {/* Common Mistakes */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          Common Debugging Mistakes
        </h2>

        <ul className="list-disc list-inside text-white/60 space-y-2">
          <li>Changing multiple things at once</li>
          <li>Ignoring console errors</li>
          <li>Not checking edge cases</li>
          <li>Assuming instead of verifying</li>
          <li>Skipping proper validation</li>
        </ul>
      </section>

      {/* Conclusion */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Final Thoughts</h2>

        <p className="text-white/60 leading-8">
          Debugging is about reducing uncertainty step by step.
          The more systematic your approach, the faster you solve problems.
        </p>

        <p className="text-white/60 leading-8">
          Treat every GetBugged challenge like a production-level issue.
        </p>
      </section>

    </div>
  );
}