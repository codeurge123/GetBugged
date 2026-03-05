import React, { useState } from "react";

/* ---------------- Code Block Component ---------------- */

import CodeBlock from "../../components/DocsComponents/CodeBlock";

/* ---------------- Main Page ---------------- */

export default function HowToUse() {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "0px 20px",
        fontFamily: "sans-serif",
        color: "white",
        lineHeight: "1.8",
      }}
    >
      {/* Header */}
      <header style={{ marginBottom: "60px" }}>
        <h1 className="text-4xl font-bold mb-4 mt-0" style={{ fontSize: "36px", marginBottom: "16px" }}>
          How to Use GetBugged
        </h1>
        <p style={{ opacity: 0.7 }}>
          GetBugged is designed to help developers build structured debugging
          skills through practical, real-world inspired scenarios. Each level
          contains intentional logical mistakes, missing validations, or flawed
          assumptions. Your objective is not just to correct the issue, but to
          understand why the failure occurred and how to prevent similar bugs
          in production systems.
        </p>
      </header>

      {/* 1 */}
      <section style={{ marginBottom: "60px" }}>
        <h2 className="text-2xl font-semibold" >1. Understand the Expected Behavior</h2>

        <p style={{ opacity: 0.7 }}>
          The first step in debugging is clearly defining what the code is
          supposed to do. Many bugs occur because developers assume behavior
          instead of verifying requirements.
        </p>

        <p style={{ opacity: 0.7 }}>
          Before changing the code, ask:
        </p>

        <ul style={{ opacity: 0.7 }}>
          <li>What should this function return under normal conditions?</li>
          <li>What happens if input is missing?</li>
          <li>Should the function fail or handle errors gracefully?</li>
        </ul>

        <CodeBlock
          code={`function greet(name) {
  return "Hello " + name.toUpperCase();
}

console.log(greet());`}
        />

        <p style={{ opacity: 0.7 }}>
          In this example, the function assumes that "name" will always be
          provided. When no argument is passed, undefined is used instead,
          causing a runtime error. Identifying hidden assumptions is the
          foundation of effective debugging.
        </p>
      </section>

      {/* 2 */}
      <section style={{ marginBottom: "60px" }}>
        <h2 className="text-2xl font-semibold">2. Reproduce the Bug Consistently</h2>

        <p style={{ opacity: 0.7 }}>
          A bug must be reproducible before it can be reliably fixed. If you
          cannot recreate the failure, your fix becomes guesswork.
        </p>

        <p style={{ opacity: 0.7 }}>
          Ensure:
        </p>

        <ul style={{ opacity: 0.7 }}>
          <li>The failure happens consistently</li>
          <li>You know the exact input causing it</li>
          <li>You can isolate the scenario clearly</li>
        </ul>

        <CodeBlock
          code={`function calculateDiscount(price, discount) {
  return price - discount;
}

console.log(calculateDiscount(100));`}
        />

        <p  style={{ opacity: 0.7 }}>
          Since discount is undefined, subtracting it results in NaN.
          Reproducing this behavior confirms the root of the problem.
        </p>
      </section>

      {/* 3 */}
      <section style={{ marginBottom: "60px" }}>
        <h2 className="text-2xl font-semibold">3. Isolate the Root Cause</h2>

        <p style={{ opacity: 0.7 }}>
          Instead of modifying multiple parts of the system, isolate the
          failing logic. Break complex flows into smaller units and test
          them independently.
        </p>

        <CodeBlock
          code={`function calculateItemTotal(item) {
  return item.price * item.quantity;
}

function processOrder(order) {
  return order.items.reduce(
    (total, item) => total + calculateItemTotal(item),
    0
  );
}`}
        />

        <p style={{ opacity: 0.7 }}>
          If this function crashes, verify:
        </p>

        <ul style={{ opacity: 0.7 }}>
          <li>Does "order" exist?</li>
          <li>Is "items" an array?</li>
          <li>Are price and quantity valid numbers?</li>
        </ul>

        <p style={{ opacity: 0.7 }}>
          Root cause isolation prevents unnecessary and risky code changes.
        </p>
      </section>

      {/* 4 */}
      <section style={{ marginBottom: "60px" }}>
        <h2 className="text-2xl font-semibold">4. Apply a Minimal, Focused Fix</h2>

        <p style={{ opacity: 0.7 }}>
          Fix only the root issue. Avoid refactoring unrelated logic while
          debugging. Minimal fixes reduce the risk of introducing new bugs.
        </p>

        <CodeBlock
          code={`function processOrder(order) {
  if (!order?.items?.length) return 0;

  return order.items.reduce(
    (total, item) => total + calculateItemTotal(item),
    0
  );
}`}
        />

        <p style={{ opacity: 0.7 }}>
          Optional chaining and safe guards prevent crashes while maintaining
          predictable behavior.
        </p>
      </section>

      {/* 5 */}
      <section style={{ marginBottom: "60px" }}>
        <h2 className="text-2xl font-semibold">5. Test Edge Cases</h2>

        <p style={{ opacity: 0.7 }}>
          Edge cases are boundary conditions where systems commonly fail.
          Testing only ideal inputs is insufficient for production code.
        </p>

        <CodeBlock
          code={`function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}`}
        />

        <p style={{ opacity: 0.7 }}>
          Explicit validation ensures predictable and safe behavior.
        </p>
      </section>

      {/* 6 */}
      <section style={{ marginBottom: "60px" }}>
        <h2 className="text-2xl font-semibold">6. Validate the Fix</h2>

        <p style={{ opacity: 0.7 }}>
          Debugging does not end when the error disappears.
          You must confirm:
        </p>

        <ul style={{ opacity: 0.7 }}>
          <li>The original issue is resolved</li>
          <li>Existing features still work</li>
          <li>No new warnings are introduced</li>
          <li>Performance remains stable</li>
        </ul>
      </section>

      {/* 7 */}
      <section style={{ marginBottom: "60px" }}>
        <h2 className="text-2xl font-semibold">7. Learn the Pattern</h2>

        <p style={{ opacity: 0.7 }}>
          Every bug follows a recurring pattern. Recognizing these patterns
          improves long-term debugging efficiency.
        </p>

        <ul style={{ opacity: 0.7 }}>
          <li>Undefined or null references</li>
          <li>Missing input validation</li>
          <li>Incorrect data assumptions</li>
          <li>Logical iteration mistakes</li>
        </ul>
      </section>

      {/* Summary */}
      <section>
        <h2 className="text-2xl font-semibold">Debugging Workflow Summary</h2>

        <ol
  style={{
    marginTop: "20px",
    paddingLeft: "22px",
    lineHeight: "2",
    opacity: 0.9,
    fontWeight: "500",
  }}
>
  <li>1. Understand expected behavior</li>
  <li>2. Reproduce consistently</li>
  <li>3. Isolate root cause</li>
  <li>4. Apply minimal fix</li>
  <li>5.Test edge cases</li>
  <li>6.Validate results</li>
  <li>7.Reflect and learn</li>
</ol>

        <p style={{ opacity: 0.7 }}>
          Debugging is structured reasoning — not trial and error.
          Consistent application of this workflow builds engineering maturity
          and confidence in handling complex systems.
        </p>
      </section>
    </div>
  );
}