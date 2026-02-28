import React, { useState } from "react";

/* ---------------- Reusable Code Block ---------------- */

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 text-xs px-3 py-1 rounded-md
                   border border-white/10 bg-white/5 text-white
                   hover:bg-white/10 transition"
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>

      <pre className="bg-black border border-white/10 p-4 rounded-md text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ---------------- Main Component ---------------- */

export default function AsyncBugsDocs() {
  return (
    <div className="space-y-16">

      {/* Header */}
      <header>
        <h1 className="text-4xl font-bold mb-4">AsyncBugs</h1>

        <p className="text-white/60 leading-8 text-lg">
          Asynchronous bugs are timing-based failures. They do not always
          crash immediately — instead, they create inconsistent behavior
          that appears random.
        </p>

        <p className="text-white/60 leading-8">
          To debug async systems effectively, you must understand:
        </p>

        <ul className="list-disc list-inside text-white/60 space-y-2">
          <li>Execution order</li>
          <li>The event loop</li>
          <li>Promise resolution timing</li>
          <li>Microtasks vs Macrotasks</li>
          <li>State updates after async operations</li>
        </ul>
      </header>

      {/* SECTION 1 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          1. The Event Loop Mental Model
        </h2>

        <p className="text-white/60 leading-8">
          JavaScript is single-threaded. It executes one thing at a time.
          Asynchronous behavior is simulated using the event loop.
        </p>

        <CodeBlock
          code={`console.log("Start");

setTimeout(() => {
  console.log("Timeout");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise");
});

console.log("End");`}
        />

        <p className="text-white/60 leading-8">
          Output:
        </p>

        <CodeBlock
          code={`Start
End
Promise
Timeout`}
        />

        <p className="text-white/60 leading-8">
          Explanation:
        </p>

        <ul className="list-disc list-inside text-white/60 space-y-2">
          <li>Synchronous code runs first</li>
          <li>Microtasks (Promises) run next</li>
          <li>Macrotasks (setTimeout) run last</li>
        </ul>

        <p className="text-white/60 leading-8">
          Many async bugs come from misunderstanding this order.
        </p>
      </section>

      {/* SECTION 2 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          2. Race Conditions in Real Applications
        </h2>

        <p className="text-white/60 leading-8">
          Race conditions happen when multiple async operations
          update the same state.
        </p>

        <CodeBlock
          code={`async function fetchUser(id) {
  const res = await fetch("/user/" + id);
  const data = await res.json();
  setUser(data);
}`}
        />

        <p className="text-white/60 leading-8">
          If a user clicks rapidly:
        </p>

        <ul className="list-disc list-inside text-white/60 space-y-2">
          <li>Request 1 starts</li>
          <li>Request 2 starts</li>
          <li>Request 2 finishes</li>
          <li>Request 1 finishes (overwrites correct data)</li>
        </ul>

        <p className="text-white/60 leading-8">
          Result: UI shows outdated data.
        </p>

        <p className="text-white/60 leading-8 font-medium">
          Professional Fix:
        </p>

        <ul className="list-disc list-inside text-white/60 space-y-2">
          <li>Track request IDs</li>
          <li>Cancel previous requests</li>
          <li>Use AbortController</li>
        </ul>
      </section>

      {/* SECTION 3 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          3. Stale Closures Explained
        </h2>

        <p className="text-white/60 leading-8">
          JavaScript closures capture variables at creation time.
          Async callbacks often use outdated state.
        </p>

        <CodeBlock
          code={`let count = 0;

setTimeout(() => {
  console.log(count);
}, 2000);

count = 5;`}
        />

        <p className="text-white/60 leading-8">
          The closure remembers the old value.
        </p>

        <p className="text-white/60 leading-8">
          In React, always use functional updates:
        </p>

        <CodeBlock
          code={`setCount(prev => prev + 1);`}
        />
      </section>

      {/* SECTION 4 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          4. Async Error Handling Strategy
        </h2>

        <p className="text-white/60 leading-8">
          Async errors propagate differently than sync errors.
          If not handled, they create silent failures.
        </p>

        <CodeBlock
          code={`async function load() {
  const res = await fetch("/wrong-url");
  return res.json();
}

load();`}
        />

        <p className="text-white/60 leading-8">
          No try/catch means unhandled rejection.
        </p>

        <CodeBlock
          code={`async function load() {
  try {
    const res = await fetch("/wrong-url");
    return await res.json();
  } catch (error) {
    console.error("Error:", error);
  }
}`}
        />

        <p className="text-white/60 leading-8">
          Always handle async failures explicitly.
        </p>
      </section>

      {/* SECTION 5 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          5. Performance Mistakes with Async
        </h2>

        <p className="text-white/60 leading-8">
          Sequential awaits slow applications unnecessarily.
        </p>

        <CodeBlock
          code={`await fetch("/api/1");
await fetch("/api/2");`}
        />

        <p className="text-white/60 leading-8">
          This doubles execution time.
        </p>

        <CodeBlock
          code={`await Promise.all([
  fetch("/api/1"),
  fetch("/api/2")
]);`}
        />

        <p className="text-white/60 leading-8">
          Promise.all runs requests in parallel.
        </p>
      </section>

      {/* Debugging Framework */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          Async Debugging Framework
        </h2>

        <ol className="list-decimal list-inside text-white/60 space-y-2">
          <li>Identify execution order</li>
          <li>Log timestamps to trace timing</li>
          <li>Simulate slow network</li>
          <li>Test rapid user interactions</li>
          <li>Handle every promise rejection</li>
        </ol>

        <p className="text-white/60 leading-8">
          Debug async by understanding flow — not by guessing.
        </p>
      </section>

      {/* Practice Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          Practice Exercises
        </h2>

        <ul className="list-disc list-inside text-white/60 space-y-2">
          <li>Build a fake delayed API using setTimeout</li>
          <li>Create a search input with rapid typing</li>
          <li>Simulate slow internet using DevTools</li>
          <li>Trigger component unmount before async finishes</li>
        </ul>

        <p className="text-white/60 leading-8">
          Mastery comes from observing execution timing, not memorizing fixes.
        </p>
      </section>

      {/* Final Thoughts */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Final Thoughts</h2>

        <p className="text-white/60 leading-8">
          Async debugging requires calm thinking and a strong mental model
          of execution order.
        </p>

        <p className="text-white/60 leading-8 font-medium">
          When you understand the event loop deeply,
          async bugs stop being mysterious.
        </p>
      </section>

    </div>
  );
}