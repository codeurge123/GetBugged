import React, { useState } from "react";


import CodeBlock from "../../components/DocsComponents/CodeBlock";


/* ---------------- Main Page ---------------- */

export default function DebuggingGuide() {
  return (
    <div className="space-y-16">

      {/* Header */}
      <header>
        <h1 className="text-4xl font-bold mb-4">Debugging Guide</h1>
        <p className="text-white/60 leading-8 text-lg">
          Debugging is not about randomly changing code until it works.
          It is a structured investigation process where you observe behavior,
          analyze patterns, form hypotheses, and validate solutions through
          controlled testing.
        </p>
      </header>

      {/* Mindset */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">The Debugging Mindset</h2>

        <p className="text-white/60 leading-8">
          Professional engineers approach debugging like detectives.
          They do not panic. They gather evidence, narrow possibilities,
          and isolate the root cause logically.
        </p>

        <div className="bg-white/5 border border-white/10 p-4 rounded-md">
          <p className="text-white/70 font-medium">
            Before touching the code, ask:
          </p>
          <ul className="list-disc list-inside text-white/60 mt-2 space-y-1">
            <li>What exactly is failing?</li>
            <li>Is it failing consistently?</li>
            <li>What changed recently?</li>
            <li>What assumptions might be wrong?</li>
          </ul>
        </div>

        <p className="text-white/60 leading-8">
          Debugging becomes easier when you shift from emotional reaction
          to logical reasoning.
        </p>
      </section>

      {/* Step 1 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          1. Understand Expected Behavior
        </h2>

        <p className="text-white/60 leading-8">
          You cannot fix something unless you clearly understand how it
          is supposed to behave. Always define expected output before
          analyzing the failure.
        </p>

        <h3 className="text-xl font-medium">Example</h3>

        <CodeBlock
          code={`function isEven(num) {
  return num % 2;
}

console.log(isEven(4)); // 0 (unexpected)
`}
        />

        <p className="text-white/60 leading-8">
          The function technically works mathematically, but it does not
          return a boolean value as expected. The issue is not syntax —
          it is incorrect behavior.
        </p>

        <CodeBlock
          code={`function isEven(num) {
  return num % 2 === 0;
}
`}
        />

        <p className="text-white/60 leading-8">
          Always compare actual output with expected output.
        </p>
      </section>

      {/* Step 2 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          2. Reproduce the Issue
        </h2>

        <p className="text-white/60 leading-8">
          A bug that cannot be reproduced cannot be reliably fixed.
          Reproduction ensures the issue is real and measurable.
        </p>

        <h3 className="text-xl font-medium">Example</h3>

        <CodeBlock
          code={`function greet(user) {
  return "Hello " + user.name;
}

greet(null); // Crash
`}
        />

        <p className="text-white/60 leading-8">
          Passing null reveals a consistent crash.
          This confirms that unsafe property access is the problem.
        </p>
      </section>

      {/* Step 3 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          3. Isolate the Root Cause
        </h2>

        <p className="text-white/60 leading-8">
          The visible error is rarely the root cause.
          Break the system into smaller pieces and test each part.
        </p>

        <CodeBlock
          code={`function greet(user) {
  if (!user || !user.name) {
    return "Hello Guest";
  }
  return "Hello " + user.name;
}
`}
        />

        <p className="text-white/60 leading-8">
          Instead of fixing everything, we introduced a guard condition.
          This isolates the unsafe assumption and corrects it safely.
        </p>
      </section>

      {/* Step 4 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          4. Debugging Async Issues
        </h2>

        <p className="text-white/60 leading-8">
          Many modern bugs occur due to improper asynchronous handling.
          Timing issues often create unpredictable behavior.
        </p>

        <h3 className="text-xl font-medium">Missing await</h3>

        <CodeBlock
          code={`async function fetchData() {
  const response = fetch("/api/data");
  return response.json();
}
`}
        />

        <p className="text-white/60 leading-8">
          This returns a Promise instead of resolved data,
          leading to unexpected behavior.
        </p>

        <h3 className="text-xl font-medium">Correct</h3>

        <CodeBlock
          code={`async function fetchData() {
  const response = await fetch("/api/data");
  return await response.json();
}
`}
        />

        <p className="text-white/60 leading-8">
          Proper async handling eliminates timing-related bugs.
        </p>
      </section>

      {/* Step 5 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          5. Debugging State Issues (React Example)
        </h2>

        <p className="text-white/60 leading-8">
          Mutating state directly causes unpredictable UI behavior.
          React requires immutable state updates.
        </p>

        <h3 className="text-xl font-medium">Incorrect</h3>

        <CodeBlock
          code={`const [count, setCount] = useState(0);

function increment() {
  count++;
  setCount(count);
}
`}
        />

        <h3 className="text-xl font-medium">Correct</h3>

        <CodeBlock
          code={`function increment() {
  setCount(prev => prev + 1);
}
`}
        />

        <p className="text-white/60 leading-8">
          Functional updates prevent race conditions and ensure reliability.
        </p>
      </section>

      {/* Advanced */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          Advanced: Race Condition Example
        </h2>

        <p className="text-white/60 leading-8">
          Race conditions occur when multiple asynchronous operations
          compete for execution order.
        </p>

        <CodeBlock
          code={`let data;

async function load() {
  fetch("/api/data").then(res => res.json()).then(d => {
    data = d;
  });

  console.log(data); // undefined
}
`}
        />

        <p className="text-white/60 leading-8">
          Logging happens before async completion.
          Always await async operations.
        </p>
      </section>

      {/* Common Mistakes */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          Common Debugging Mistakes
        </h2>

        <ul className="list-disc list-inside text-white/60 space-y-2">
          <li>Changing multiple things at once</li>
          <li>Ignoring console errors</li>
          <li>Not verifying assumptions</li>
          <li>Skipping edge case testing</li>
          <li>Fixing symptoms instead of root cause</li>
        </ul>
      </section>

      {/* Conclusion */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Final Thoughts</h2>

        <p className="text-white/60 leading-8">
          Debugging is about reducing uncertainty step by step.
          The more structured your approach, the faster and more
          confidently you solve complex problems.
        </p>

        <p className="text-white/60 leading-8">
          Treat every GetBugged challenge like a real production incident.
          Build the habit of thinking systematically.
        </p>
      </section>

    </div>
  );
}