import React, { useState } from "react";

/* ---------------- Reusable Code Block ---------------- */

import CodeBlock from "../../components/DocsComponents/CodeBlock";


/* ---------------- Main Component ---------------- */

export default function BestPractices() {
  return (
    <div className="space-y-16">

      {/* Header */}
      <header>
        <h1 className="text-4xl font-bold mb-4">Best Practices</h1>
        <p className="text-white/60 leading-8 text-lg">
          Debugging is a structured process of identifying and resolving issues logically.
          Professional developers rely on systematic reasoning, controlled experiments,
          and validation techniques instead of guesswork.
        </p>

        <p className="text-white/60 leading-8">
          The difference between a beginner and an experienced engineer is not
          how fast they type — but how clearly they think when something breaks.
        </p>
      </header>

      {/* 1 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">1. Avoid Guesswork</h2>

        <p className="text-white/60 leading-8">
          Randomly modifying code without understanding the root cause often
          introduces more bugs. Each change should be intentional and
          based on evidence.
        </p>

        <h3 className="text-xl font-medium"> Incorrect Approach</h3>

        <CodeBlock
          code={`function calculateTotal(price, quantity) {
  return price * quantity;
}

console.log(calculateTotal(100)); // NaN`}
        />

        <p className="text-white/60 leading-8">
          The function assumes quantity is always provided.
          Instead of guessing, ask:
        </p>

        <ul className="list-disc list-inside text-white/60 space-y-2">
          <li>What happens when quantity is undefined?</li>
          <li>Should there be a default value?</li>
          <li>Is validation required?</li>
        </ul>

        <h3 className="text-xl font-medium"> Correct Fix</h3>

        <CodeBlock
          code={`function calculateTotal(price, quantity = 1) {
  return price * quantity;
}

console.log(calculateTotal(100)); // 100`}
        />

        <p className="text-white/60 leading-8">
          The fix introduces a safe default value, making the function predictable.
        </p>
      </section>

      {/* 2 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">2. Validate Assumptions</h2>

        <p className="text-white/60 leading-8">
          Many crashes happen because developers assume input will always be valid.
          In production systems, inputs are rarely perfect.
        </p>

        <h3 className="text-xl font-medium"> Unsafe Code</h3>

        <CodeBlock
          code={`function getUserName(user) {
  return user.name.toUpperCase();
}

getUserName(null); // Crash`}
        />

        <p className="text-white/60 leading-8">
          Accessing properties on null causes runtime failure.
        </p>

        <h3 className="text-xl font-medium">Safe Code</h3>

        <CodeBlock
          code={`function getUserName(user) {
  if (!user || !user.name) {
    return "Unknown User";
  }
  return user.name.toUpperCase();
}`}
        />

        <p className="text-white/60 leading-8">
          Defensive programming prevents crashes and improves reliability.
        </p>
      </section>

      {/* 3 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">3. Think Systematically</h2>

        <p className="text-white/60 leading-8">
          Break complex logic into smaller testable units.
          Isolate functions and verify them independently.
        </p>

        <CodeBlock
          code={`function calculateItemTotal(item) {
  return item.price * item.quantity;
}

function processOrder(order) {
  if (!order?.items?.length) return 0;

  return order.items.reduce(
    (total, item) => total + calculateItemTotal(item),
    0
  );
}`}
        />

        <p className="text-white/60 leading-8">
          Modular design improves readability, testability,
          and reduces debugging complexity.
        </p>
      </section>

      {/* 4 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">4. Test Edge Cases</h2>

        <p className="text-white/60 leading-8">
          Systems fail at boundaries. Always test unusual and extreme inputs.
        </p>

        <CodeBlock
          code={`function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero is not allowed");
  }
  return a / b;
}`}
        />

        <p className="text-white/60 leading-8">
          Edge case testing prevents production-level incidents.
        </p>
      </section>

      {/* 5 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">5. Handle Async Code Carefully</h2>

        <p className="text-white/60 leading-8">
          Asynchronous bugs are harder to detect because they are timing-related.
          Always handle promises properly.
        </p>

        <CodeBlock
          code={`async function fetchData() {
  const response = await fetch("/api/data");
  return await response.json();
}`}
        />

        <p className="text-white/60 leading-8">
          Missing await, ignoring errors, or not handling loading states
          can cause unpredictable behavior.
        </p>
      </section>

      {/* Advanced */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Advanced Debugging Habits</h2>

        <ul className="list-disc list-inside text-white/60 space-y-2">
          <li>Reproduce the issue consistently before fixing</li>
          <li>Change one thing at a time</li>
          <li>Write small test cases</li>
          <li>Log before and after state changes</li>
          <li>Check assumptions explicitly</li>
        </ul>
      </section>

      {/* Final */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Final Thoughts</h2>

        <p className="text-white/60 leading-8">
          Strong debugging comes from structured thinking,
          validation, edge case testing, and modular design.
        </p>

        <p className="text-white/60 leading-8">
          Debugging is disciplined problem solving — not trial and error.
          The more systematic your approach, the faster and more confidently
          you resolve real-world engineering challenges.
        </p>
      </section>

    </div>
  );
}