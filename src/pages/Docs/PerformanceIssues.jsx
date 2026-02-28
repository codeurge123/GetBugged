import React, { useState } from "react";

/* ---------------- Code Block Component ---------------- */

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

/* ---------------- Main Docs Page ---------------- */

export default function PerformanceIssuesDocs() {
  return (
    <div className="space-y-16">

      {/* Header */}
      <header>
        <h1 className="text-4xl font-bold mb-4">Performance Issues</h1>

        <p className="text-white/60 leading-8 text-lg">
          Performance issues do not break your application —
          they silently make it slow. A slow app feels broken
          even if it works correctly.
        </p>

        <p className="text-white/60 leading-8">
          Performance engineering is about reducing unnecessary work.
          Every extra render, extra loop, extra API call adds cost.
        </p>
      </header>

      {/* 1 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          1. Understanding Re-renders in React
        </h2>

        <p className="text-white/60 leading-8">
          In React, every state update triggers a re-render.
          When a component re-renders, the entire function runs again.
          In small apps, this is fine. In large apps, this becomes expensive.
        </p>

        <CodeBlock
          code={`function App() {
  const [count, setCount] = useState(0);

  console.log("Component Rendered");

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}`}
        />

        <p className="text-white/60 leading-8">
          Every button click causes:
        </p>

        <ul className="list-disc list-inside text-white/60 space-y-2">
          <li>The component function to run again</li>
          <li>Virtual DOM comparison</li>
          <li>Possible DOM updates</li>
        </ul>

        <p className="text-white/60 leading-8">
          If this component had 20 children,
          all of them would also re-render.
        </p>
      </section>

      {/* 2 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          2. Unnecessary Child Re-renders
        </h2>

        <p className="text-white/60 leading-8">
          Sometimes child components re-render even when their data has not changed.
        </p>

        <CodeBlock
          code={`const Child = () => {
  console.log("Child Rendered");
  return <div>Static Child</div>;
};

function Parent() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Child />
      <button onClick={() => setCount(count + 1)}>
        {count}
      </button>
    </>
  );
}`}
        />

        <p className="text-white/60 leading-8">
          Even though Child does not depend on count,
          it still re-renders.
        </p>

        <p className="text-white/60 leading-8 font-medium">
          Optimization:
        </p>

        <CodeBlock
          code={`const Child = React.memo(() => {
  return <div>Static Child</div>;
});`}
        />
      </section>

      {/* 3 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          3. Expensive Computations
        </h2>

        <p className="text-white/60 leading-8">
          Heavy calculations inside render slow down UI.
        </p>

        <CodeBlock
          code={`function App({ items }) {
  const total = items.reduce((sum, item) => {
    return sum + item.price;
  }, 0);

  return <div>{total}</div>;
}`}
        />

        <p className="text-white/60 leading-8">
          If items has 10,000 elements,
          reduce runs on every render.
        </p>

        <p className="text-white/60 leading-8 font-medium">
          Solution:
        </p>

        <CodeBlock
          code={`const total = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price, 0);
}, [items]);`}
        />
      </section>

      {/* 4 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          4. Algorithm Complexity
        </h2>

        <p className="text-white/60 leading-8">
          Performance is often about algorithm choice.
        </p>

        <CodeBlock
          code={`// O(n²)
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    console.log(i, j);
  }
}`}
        />

        <p className="text-white/60 leading-8">
          If n = 10,000, this runs 100 million times.
          That’s extremely slow.
        </p>

        <p className="text-white/60 leading-8">
          Always think:
        </p>

        <ul className="list-disc list-inside text-white/60 space-y-2">
          <li>Can this be done in O(n)?</li>
          <li>Can I use a map instead of nested loops?</li>
        </ul>
      </section>

      {/* 5 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          5. Memory Leaks
        </h2>

        <p className="text-white/60 leading-8">
          Memory leaks happen when resources are not cleaned up.
          Over time, memory usage increases.
        </p>

        <CodeBlock
          code={`useEffect(() => {
  const id = setInterval(() => {
    console.log("Running...");
  }, 1000);
}, []);`}
        />

        <p className="text-white/60 leading-8">
          This interval continues even after component unmounts.
        </p>

        <CodeBlock
          code={`useEffect(() => {
  const id = setInterval(() => {
    console.log("Running...");
  }, 1000);

  return () => clearInterval(id);
}, []);`}
        />
      </section>

      {/* 6 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          6. Large List Rendering
        </h2>

        <p className="text-white/60 leading-8">
          Rendering thousands of DOM nodes slows performance.
        </p>

        <CodeBlock
          code={`{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}`}
        />

        <p className="text-white/60 leading-8">
          Use list virtualization libraries like react-window
          to render only visible elements.
        </p>
      </section>

      {/* 7 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          7. Debouncing User Input
        </h2>

        <p className="text-white/60 leading-8">
          Without debouncing, every keystroke triggers API calls.
        </p>

        <CodeBlock
          code={`function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}`}
        />
      </section>

      {/* Final */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Final Thoughts</h2>

        <p className="text-white/60 leading-8">
          Good developers make code work.
          Skilled engineers make it efficient.
        </p>

        <p className="text-white/60 leading-8">
          Always:
        </p>

        <ul className="list-disc list-inside text-white/60 space-y-2">
          <li>Measure performance</li>
          <li>Understand rendering flow</li>
          <li>Think about algorithm complexity</li>
          <li>Optimize only when needed</li>
        </ul>

        <p className="text-white/60 leading-8 font-medium">
          Performance is engineering discipline — not guesswork.
        </p>
      </section>

    </div>
  );
}