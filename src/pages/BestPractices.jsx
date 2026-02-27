import React from "react";

export default function BestPractices() {
  return (
    <div className="space-y-16">

      {/* Header */}
      <header>
        <h1 className="text-4xl font-bold mb-4">Best Practices</h1>
        <p className="text-white/60 leading-8 text-lg">
          Debugging effectively requires structure, discipline, and clarity.
          Below are professional debugging best practices explained with
          practical code examples.
        </p>
      </header>

      {/* Avoid Guesswork */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">1. Avoid Guesswork</h2>

        <p className="text-white/60 leading-8">
          Randomly changing code without understanding the issue often makes
          debugging worse.
        </p>

        <h3 className="text-xl font-medium mt-4">❌ Bad Approach</h3>

        <pre className="bg-black border border-white/10 p-4 rounded-md text-sm overflow-x-auto">
{`function calculateTotal(price, quantity) {
  return price * quantity;
}

console.log(calculateTotal(100)); // NaN
`}
        </pre>

        <p className="text-white/60 leading-8">
          Instead of randomly editing the function, identify the problem:
          the second argument is missing.
        </p>

        <h3 className="text-xl font-medium mt-4">✅ Correct Fix</h3>

        <pre className="bg-black border border-white/10 p-4 rounded-md text-sm overflow-x-auto">
{`function calculateTotal(price, quantity = 1) {
  return price * quantity;
}

console.log(calculateTotal(100)); // 100
`}
        </pre>
      </section>

      {/* Validate Assumptions */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">2. Validate Assumptions</h2>

        <p className="text-white/60 leading-8">
          Never assume data exists. Always validate inputs.
        </p>

        <h3 className="text-xl font-medium mt-4">❌ Unsafe Code</h3>

        <pre className="bg-black border border-white/10 p-4 rounded-md text-sm overflow-x-auto">
{`function getUserName(user) {
  return user.name.toUpperCase();
}

getUserName(null); // Crash
`}
        </pre>

        <h3 className="text-xl font-medium mt-4">✅ Safe Code</h3>

        <pre className="bg-black border border-white/10 p-4 rounded-md text-sm overflow-x-auto">
{`function getUserName(user) {
  if (!user || !user.name) {
    return "Unknown User";
  }
  return user.name.toUpperCase();
}
`}
        </pre>

        <p className="text-white/60 leading-8">
          Defensive programming prevents runtime failures.
        </p>
      </section>

      {/* Think Systematically */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">3. Think Systematically</h2>

        <p className="text-white/60 leading-8">
          Break complex logic into smaller testable pieces.
        </p>

        <h3 className="text-xl font-medium mt-4">❌ Overcomplicated Function</h3>

        <pre className="bg-black border border-white/10 p-4 rounded-md text-sm overflow-x-auto">
{`function processOrder(order) {
  if (order && order.items && order.items.length > 0) {
    let total = 0;
    for (let i = 0; i < order.items.length; i++) {
      total += order.items[i].price * order.items[i].quantity;
    }
    return total;
  }
  return 0;
}
`}
        </pre>

        <h3 className="text-xl font-medium mt-4">✅ Modular Version</h3>

        <pre className="bg-black border border-white/10 p-4 rounded-md text-sm overflow-x-auto">
{`function calculateItemTotal(item) {
  return item.price * item.quantity;
}

function processOrder(order) {
  if (!order?.items?.length) return 0;
  return order.items.reduce(
    (total, item) => total + calculateItemTotal(item),
    0
  );
}
`}
        </pre>

        <p className="text-white/60 leading-8">
          Smaller functions are easier to debug and test.
        </p>
      </section>

      {/* Test Edge Cases */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">4. Test Edge Cases</h2>

        <p className="text-white/60 leading-8">
          Many bugs appear only under boundary conditions.
        </p>

        <h3 className="text-xl font-medium mt-4">Example</h3>

        <pre className="bg-black border border-white/10 p-4 rounded-md text-sm overflow-x-auto">
{`function divide(a, b) {
  return a / b;
}

divide(10, 0); // Infinity
`}
        </pre>

        <h3 className="text-xl font-medium mt-4">Better Version</h3>

        <pre className="bg-black border border-white/10 p-4 rounded-md text-sm overflow-x-auto">
{`function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero is not allowed");
  }
  return a / b;
}
`}
        </pre>

        <p className="text-white/60 leading-8">
          Always consider invalid, empty, or extreme inputs.
        </p>
      </section>

      {/* Async Debugging */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">5. Handle Async Code Carefully</h2>

        <p className="text-white/60 leading-8">
          Many advanced bugs come from improper async handling.
        </p>

        <h3 className="text-xl font-medium mt-4">❌ Common Mistake</h3>

        <pre className="bg-black border border-white/10 p-4 rounded-md text-sm overflow-x-auto">
{`async function fetchData() {
  const response = fetch("/api/data");
  return response.json(); // Error
}
`}
        </pre>

        <h3 className="text-xl font-medium mt-4">✅ Correct Version</h3>

        <pre className="bg-black border border-white/10 p-4 rounded-md text-sm overflow-x-auto">
{`async function fetchData() {
  const response = await fetch("/api/data");
  return await response.json();
}
`}
        </pre>

        <p className="text-white/60 leading-8">
          Missing "await" is a very common production bug.
        </p>
      </section>

      {/* Conclusion */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Final Thoughts</h2>

        <p className="text-white/60 leading-8">
          Strong debugging skills come from structured thinking,
          careful validation, and consistent testing.
        </p>

        <p className="text-white/60 leading-8">
          Apply these practices consistently in GetBugged challenges,
          and your debugging ability will improve dramatically.
        </p>
      </section>

    </div>
  );
}