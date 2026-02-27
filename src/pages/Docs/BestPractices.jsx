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
    <div style={{ position: "relative" }}>
      <button
        onClick={handleCopy}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          fontSize: "12px",
          padding: "6px 10px",
          borderRadius: "6px",
          border: "none",
          background: "rgba(255,255,255,0.1)",
          color: "white",
          cursor: "pointer",
        }}
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>

      <pre
        style={{
          background: "#000",
          padding: "16px",
          borderRadius: "8px",
          overflowX: "auto",
          color: "white",
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* Main Page Component */

export default function BestPractices() {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: "sans-serif",
        color: "white",
        // backgroundColor: "#111",
        lineHeight: "1.8",
      }}
    >
      {/* Header */}
      <header style={{ marginBottom: "60px" }}>
        <h1 style={{ fontSize: "36px", marginBottom: "16px" }}>
          Best Practices
        </h1>
        <p style={{ opacity: 0.7 }}>
          Debugging is a structured process of identifying and resolving
          issues logically. Professional developers use systematic techniques
          rather than guesswork.
        </p>
      </header>

      {/* 1 */}
      <section style={{ marginBottom: "60px" }}>
        <h2>1. Avoid Guesswork</h2>

        <p style={{ opacity: 0.7 }}>
          Randomly modifying code without understanding the root cause often
          creates more problems.
        </p>

        <h3 className="font-semibold text-xl">Incorrect Approach</h3>

        <CodeBlock
          code={`function calculateTotal(price, quantity) {
  return price * quantity;
}

console.log(calculateTotal(100)); // NaN`}
        />

        <h3 style={{ marginTop: "20px" }} className="font-semibold text-xl">Correct Fix</h3>

        <CodeBlock
          code={`function calculateTotal(price, quantity = 1) {
  return price * quantity;
}

console.log(calculateTotal(100)); // 100`}
        />
      </section>

      {/* 2 */}
      <section style={{ marginBottom: "60px" }}>
        <h2>2. Validate Assumptions</h2>

        <h3>❌ Unsafe Code</h3>

        <CodeBlock
          code={`function getUserName(user) {
  return user.name.toUpperCase();
}

getUserName(null); // Crash`}
        />

        <h3 style={{ marginTop: "20px" }}>✅ Safe Code</h3>

        <CodeBlock
          code={`function getUserName(user) {
  if (!user || !user.name) {
    return "Unknown User";
  }
  return user.name.toUpperCase();
}`}
        />
      </section>

      {/* 3 */}
      <section style={{ marginBottom: "60px" }}>
        <h2>3. Think Systematically</h2>

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
      </section>

      {/* 4 */}
      <section style={{ marginBottom: "60px" }}>
        <h2>4. Test Edge Cases</h2>

        <CodeBlock
          code={`function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero is not allowed");
  }
  return a / b;
}`}
        />
      </section>

      {/* 5 */}
      <section style={{ marginBottom: "60px" }}>
        <h2>5. Handle Async Code Carefully</h2>

        <CodeBlock
          code={`async function fetchData() {
  const response = await fetch("/api/data");
  return await response.json();
}`}
        />
      </section>

      {/* Conclusion */}
      <section>
        <h2>Final Thoughts</h2>
        <p style={{ opacity: 0.7 }}>
          Strong debugging comes from structured thinking, validation,
          edge case testing, and modular design. Debugging is disciplined
          problem solving — not trial and error.
        </p>
      </section>
    </div>
  );
}