import React, { useState } from "react";

import CodeBlock from "../../components/DocsComponents/CodeBlock";

/* ---------------- Main Component ---------------- */

export default function ReactBugsGuide() {
  return (
    <div className="space-y-16">

      {/* Header */}
      <header>
        <h1 className="text-4xl font-bold mb-4">ReactBugs Guide</h1>
        <p className="text-white/60 leading-8 text-lg">
          ReactBugs focuses on identifying and fixing real-world React
          application failures. These scenarios simulate production-level
          issues including incorrect state updates, unnecessary re-renders,
          asynchronous race conditions, stale closures, and lifecycle misuse.
        </p>

        <p className="text-white/60 leading-8">
          The goal is not just to fix bugs — but to understand how React
          rendering works internally and why certain patterns cause instability.
        </p>
      </header>

      {/* Section 1 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          1. State Mutation Bugs
        </h2>

        <p className="text-white/60 leading-8">
          React depends on immutability to detect changes. When you mutate
          state directly, React cannot properly detect updates because the
          reference does not change.
        </p>

        <p className="text-white/60 leading-8">
          In production, this leads to UI not updating, stale renders,
          or unpredictable behavior.
        </p>

        <h3 className="text-xl font-medium">Incorrect</h3>

        <CodeBlock
          code={`const [items, setItems] = useState([]);

function addItem(item) {
  items.push(item);
  setItems(items);
}`}
        />

        <p className="text-white/60 leading-8">
          Here, the array reference remains the same.
          React may skip re-rendering because it sees no reference change.
        </p>

        <h3 className="text-xl font-medium">Correct</h3>

        <CodeBlock
          code={`function addItem(item) {
  setItems(prev => [...prev, item]);
}`}
        />

        <p className="text-white/60 leading-8">
          Creating a new array ensures React detects the change and updates the UI.
        </p>
      </section>

      {/* Section 2 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          2. Infinite Re-render Loop
        </h2>

        <p className="text-white/60 leading-8">
          useEffect runs after render. If you update state inside it
          without controlling dependencies, you create an infinite loop.
        </p>

        <h3 className="text-xl font-medium"> Problem</h3>

        <CodeBlock
          code={`useEffect(() => {
  setCount(count + 1);
});`}
        />

        <p className="text-white/60 leading-8">
          This runs after every render and triggers another render.
          The cycle never stops.
        </p>

        <h3 className="text-xl font-medium">Fix</h3>

        <CodeBlock
          code={`useEffect(() => {
  setCount(prev => prev + 1);
}, []);`}
        />

        <p className="text-white/60 leading-8">
          The empty dependency array ensures the effect runs only once.
        </p>
      </section>

      {/* Section 3 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          3. Missing Key Prop in Lists
        </h2>

        <p className="text-white/60 leading-8">
          React uses keys to identify which items changed, were added,
          or removed. Without keys, reconciliation becomes unreliable.
        </p>

        <h3 className="text-xl font-medium"> Incorrect</h3>

        <CodeBlock
          code={`{items.map(item => (
  <li>{item.name}</li>
))}`}
        />

        <h3 className="text-xl font-medium"> Correct</h3>

        <CodeBlock
          code={`{items.map(item => (
  <li key={item.id}>{item.name}</li>
))}`}
        />

        <p className="text-white/60 leading-8">
          Stable keys prevent incorrect DOM reuse and rendering glitches.
        </p>
      </section>

      {/* Section 4 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          4. Stale Closure Bug
        </h2>

        <p className="text-white/60 leading-8">
          JavaScript closures capture variables at the time
          they are created. In React, this may lead to outdated
          state being used inside async callbacks.
        </p>

        <h3 className="text-xl font-medium"> Problem</h3>

        <CodeBlock
          code={`setInterval(() => {
  console.log(count);
}, 1000);`}
        />

        <h3 className="text-xl font-medium"> Fix</h3>

        <CodeBlock
          code={`useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1);
  }, 1000);

  return () => clearInterval(id);
}, []);`}
        />

        <p className="text-white/60 leading-8">
          Functional updates always use the latest state value.
        </p>
      </section>

      {/* Section 5 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          5. Async Data Fetching & Race Conditions
        </h2>

        <p className="text-white/60 leading-8">
          Multiple async requests may complete in unexpected order.
          Without proper handling, older responses can overwrite newer ones.
        </p>

        <CodeBlock
          code={`useEffect(() => {
  fetch("/api/data")
    .then(res => res.json())
    .then(data => setData(data));
}, []);`}
        />

        <p className="text-white/60 leading-8">
          Always handle:
        </p>

        <ul className="list-disc list-inside text-white/60 space-y-2">
          <li>Loading states</li>
          <li>Error states</li>
          <li>Request cancellation</li>
          <li>Cleanup on unmount</li>
        </ul>
      </section>

      {/* Advanced Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          Advanced Debugging Strategy
        </h2>

        <p className="text-white/60 leading-8">
          When debugging React applications:
        </p>

        <ul className="list-disc list-inside text-white/60 space-y-2">
          <li>Check React DevTools to inspect component tree</li>
          <li>Verify props and state transitions</li>
          <li>Confirm dependency arrays</li>
          <li>Test edge cases manually</li>
          <li>Log previous vs next state values</li>
        </ul>
      </section>

      {/* Conclusion */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Final Thoughts</h2>

        <p className="text-white/60 leading-8">
          React debugging is about understanding how rendering,
          state batching, and effects scheduling work together.
        </p>

        <p className="text-white/60 leading-8">
          The deeper your mental model of React internals,
          the faster and more confidently you solve real-world bugs.
        </p>
      </section>

    </div>
  );
}