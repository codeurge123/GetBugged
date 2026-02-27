import React from "react";

export default function CommonErrors() {
  return (
    <div className="space-y-16">

      <header>
        <h1 className="text-4xl font-bold mb-4">Common Errors</h1>
        <p className="text-white/60 leading-8 text-lg">
          These are the most frequent bugs developers encounter in real-world
          JavaScript applications. Understanding them deeply improves debugging speed.
        </p>
      </header>

      {/* Undefined Errors */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">1. Cannot Read Property of Undefined</h2>

        <pre className="bg-black border border-white/10 p-4 rounded-md text-sm">
{`const user = null;
console.log(user.name); // Crash
`}
        </pre>

        <p className="text-white/60 leading-8">
          Accessing properties on null or undefined causes runtime crashes.
        </p>

        <pre className="bg-black border border-white/10 p-4 rounded-md text-sm">
{`console.log(user?.name || "Guest");`}
        </pre>
      </section>

      {/* Type Errors */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">2. Type Coercion Issues</h2>

        <pre className="bg-black border border-white/10 p-4 rounded-md text-sm">
{`console.log("5" + 1); // "51"
console.log("5" - 1); // 4
`}
        </pre>

        <p className="text-white/60 leading-8">
          JavaScript automatically converts types, which may lead to unexpected behavior.
        </p>

        <pre className="bg-black border border-white/10 p-4 rounded-md text-sm">
{`console.log(Number("5") + 1); // 6`}
        </pre>
      </section>

      {/* Infinite Loop */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">3. Infinite Loops</h2>

        <pre className="bg-black border border-white/10 p-4 rounded-md text-sm">
{`let i = 0;
while (i < 5) {
  console.log(i);
}`}
        </pre>

        <p className="text-white/60 leading-8">
          Missing increment causes infinite execution.
        </p>
      </section>

    </div>
  );
}