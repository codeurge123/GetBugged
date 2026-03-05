import React, { useState } from "react";

/* ---------------- Reusable Code Block ---------------- */

import CodeBlock from "../../components/DocsComponents/CodeBlock";


/* ---------------- Main Component ---------------- */

export default function CommonErrors() {
  return (
    <div className="space-y-16">

      {/* Header */}
      <header>
        <h1 className="text-4xl font-bold mb-4">Common Errors</h1>
        <p className="text-white/60 leading-8 text-lg">
          These are the most frequent bugs developers encounter in real-world
          JavaScript applications. Understanding them deeply improves debugging speed
          and builds strong foundational skills.
        </p>

        <p className="text-white/60 leading-8">
          Instead of memorizing fixes, focus on understanding why these errors happen.
          Debugging becomes easier when you understand the language behavior.
        </p>
      </header>

      {/* 1 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          1. Cannot Read Property of Undefined
        </h2>

        <p className="text-white/60 leading-8">
          This error occurs when you try to access a property on null or undefined.
          It is one of the most common runtime crashes in JavaScript.
        </p>

        <CodeBlock
          code={`const user = null;
console.log(user.name); // Crash`}
        />

        <p className="text-white/60 leading-8">
          Since user is null, it has no properties.
          Accessing .name throws an error and stops execution.
        </p>

        <h3 className="text-xl font-medium"> Safer Approach</h3>

        <CodeBlock
          code={`console.log(user?.name || "Guest");`}
        />

        <p className="text-white/60 leading-8">
          Optional chaining (?.) safely checks if user exists before accessing properties.
          Always validate external or dynamic data before using it.
        </p>

        <p className="text-white/60 leading-8">
          Student Tip: Whenever you see this error, ask —
          “Which variable is undefined?” and “Why was it undefined?”
        </p>
      </section>

      {/* 2 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          2. Type Coercion Issues
        </h2>

        <p className="text-white/60 leading-8">
          JavaScript automatically converts types when performing operations.
          This behavior is called type coercion and can produce unexpected results.
        </p>

        <CodeBlock
          code={`console.log("5" + 1); // "51"
console.log("5" - 1); // 4`}
        />

        <p className="text-white/60 leading-8">
          The + operator concatenates strings, while - forces numeric conversion.
          This inconsistency confuses many beginners.
        </p>

        <h3 className="text-xl font-medium">Explicit Conversion</h3>

        <CodeBlock
          code={`console.log(Number("5") + 1); // 6`}
        />

        <p className="text-white/60 leading-8">
          Always convert types explicitly when working with user input or API data.
          Avoid relying on implicit conversion.
        </p>

        <p className="text-white/60 leading-8">
          Student Tip: Use === instead of == to avoid unwanted coercion.
        </p>
      </section>

      {/* 3 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          3. Infinite Loops
        </h2>

        <p className="text-white/60 leading-8">
          Infinite loops occur when the loop condition never becomes false.
          This can freeze applications or crash browsers.
        </p>

        <CodeBlock
          code={`let i = 0;

while (i < 5) {
  console.log(i);
}`}
        />

        <p className="text-white/60 leading-8">
          The increment is missing. i never changes, so the loop runs forever.
        </p>

        <h3 className="text-xl font-medium">Corrected Loop</h3>

        <CodeBlock
          code={`let i = 0;

while (i < 5) {
  console.log(i);
  i++;
}`}
        />

        <p className="text-white/60 leading-8">
          Always ensure loop variables update properly.
        </p>
      </section>

      {/* 4 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          4. Undefined vs Null Confusion
        </h2>

        <p className="text-white/60 leading-8">
          Undefined means a variable was declared but not assigned.
          Null means an intentional absence of value.
        </p>

        <CodeBlock
          code={`let data;
console.log(data); // undefined

let user = null;
console.log(user); // null`}
        />

        <p className="text-white/60 leading-8">
          Confusing these values can lead to logic errors.
        </p>
      </section>

      {/* 5 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          5. Async Timing Errors
        </h2>

        <p className="text-white/60 leading-8">
          Many students struggle with asynchronous code.
          Code may execute before data is available.
        </p>

        <CodeBlock
          code={`let data;

fetch("/api")
  .then(res => res.json())
  .then(d => data = d);

console.log(data); // undefined`}
        />

        <p className="text-white/60 leading-8">
          Logging happens before the async operation completes.
        </p>

        <h3 className="text-xl font-medium"> Correct Approach</h3>

        <CodeBlock
          code={`async function load() {
  const res = await fetch("/api");
  const data = await res.json();
  console.log(data);
}`}
        />
      </section>

      {/* Learning Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          How Students Should Practice
        </h2>

        <ul className="list-disc list-inside text-white/60 space-y-2">
          <li>Reproduce errors intentionally to understand them</li>
          <li>Read error messages carefully</li>
          <li>Log intermediate values</li>
          <li>Test edge cases manually</li>
          <li>Break complex logic into smaller parts</li>
        </ul>

        <p className="text-white/60 leading-8">
          Debugging skill improves when you slow down and analyze behavior
          instead of reacting emotionally to errors.
        </p>
      </section>

      {/* Conclusion */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Final Thoughts</h2>

        <p className="text-white/60 leading-8">
          Common errors are not weaknesses — they are learning opportunities.
          Every bug teaches you something about how JavaScript really works.
        </p>

        <p className="text-white/60 leading-8">
          Mastering these common mistakes builds confidence
          and prepares you for production-level debugging.
        </p>
      </section>

    </div>
  );
}