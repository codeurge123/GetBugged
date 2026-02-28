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

export default function SecurityBugsDocs() {
  return (
    <div className="space-y-16">

      {/* Header */}
      <header>
        <h1 className="text-4xl font-bold mb-4">Security Bugs</h1>

        <p className="text-white/60 leading-8 text-lg">
          Security bugs are vulnerabilities in your application that attackers
          can exploit to access data, manipulate systems, or disrupt services.
        </p>

        <p className="text-white/60 leading-8">
          Writing secure code is not optional. It is a responsibility.
          Security must be considered at every layer of development.
        </p>
      </header>

      {/* SECTION 1 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          1. Never Trust User Input
        </h2>

        <p className="text-white/60 leading-8">
          Every piece of data coming from users, APIs, or external sources
          should be considered untrusted.
        </p>

        <p className="text-white/60 leading-8">
          A common mistake is directly using user input without validation.
        </p>

        <CodeBlock
          code={`function greet(name) {
  return "<h1>Hello " + name + "</h1>";
}`}
        />

        <p className="text-white/60 leading-8">
          If name contains HTML or script tags, it can inject malicious code.
        </p>

        <p className="text-white/60 leading-8 font-medium">
          Defensive Approach:
        </p>

        <CodeBlock
          code={`function sanitize(input) {
  return String(input).replace(/[<>]/g, "");
}`}
        />

        <p className="text-white/60 leading-8">
          Always validate format, length, and type before processing.
        </p>
      </section>

      {/* SECTION 2 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          2. Cross-Site Scripting (XSS)
        </h2>

        <p className="text-white/60 leading-8">
          XSS occurs when untrusted input is injected into the DOM
          and executed as JavaScript.
        </p>

        <CodeBlock
          code={`const userInput = "<img src=x onerror=alert('Hacked')>";
document.body.innerHTML = userInput;`}
        />

        <p className="text-white/60 leading-8">
          React protects against this by default when using JSX:
        </p>

        <CodeBlock
          code={`<div>{userInput}</div>`}
        />

        <p className="text-white/60 leading-8">
          Avoid using dangerouslySetInnerHTML unless absolutely necessary.
        </p>
      </section>

      {/* SECTION 3 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          3. Authentication Token Security
        </h2>

        <p className="text-white/60 leading-8">
          Storing JWT tokens in localStorage makes them accessible
          to JavaScript and vulnerable to XSS attacks.
        </p>

        <CodeBlock
          code={`localStorage.setItem("token", jwtToken);`}
        />

        <p className="text-white/60 leading-8">
          Safer approach:
        </p>

        <ul className="list-disc list-inside text-white/60 space-y-2">
          <li>Use HttpOnly cookies</li>
          <li>Use Secure flag</li>
          <li>Enable SameSite protection</li>
        </ul>
      </section>

      {/* SECTION 4 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          4. Authorization vs Authentication
        </h2>

        <p className="text-white/60 leading-8">
          Authentication verifies identity.
          Authorization verifies access rights.
        </p>

        <CodeBlock
          code={`// BAD: Only checks if logged in
if (user) {
  return getAdminData();
}`}
        />

        <p className="text-white/60 leading-8">
          Proper authorization must verify roles and permissions.
        </p>
      </section>

      {/* SECTION 5 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          5. Sensitive Data Exposure
        </h2>

        <p className="text-white/60 leading-8">
          Never expose internal errors or stack traces in production.
        </p>

        <CodeBlock
          code={`app.use((err, req, res, next) => {
  res.send(err.stack); // Dangerous
});`}
        />

        <p className="text-white/60 leading-8">
          Instead:
        </p>

        <CodeBlock
          code={`res.status(500).send("Something went wrong");`}
        />
      </section>

      {/* SECTION 6 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          6. Rate Limiting & Brute Force Protection
        </h2>

        <p className="text-white/60 leading-8">
          Login endpoints are common targets.
          Implement rate limiting to prevent brute force attacks.
        </p>
      </section>

      {/* SECTION 7 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          7. Secure Password Handling
        </h2>

        <p className="text-white/60 leading-8">
          Never store passwords in plain text.
          Always hash and salt passwords.
        </p>

        <CodeBlock
          code={`// Example concept
const hashed = hash(password);`}
        />
      </section>

      {/* SECTION 8 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          8. Principle of Least Privilege
        </h2>

        <p className="text-white/60 leading-8">
          Users should only have access to what they absolutely need.
        </p>

        <ul className="list-disc list-inside text-white/60 space-y-2">
          <li>Limit database access</li>
          <li>Restrict API endpoints</li>
          <li>Separate admin roles</li>
        </ul>
      </section>

      {/* SECTION 9 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          9. Defense in Depth
        </h2>

        <p className="text-white/60 leading-8">
          Security should not rely on a single protection layer.
        </p>

        <p className="text-white/60 leading-8">
          Combine:
        </p>

        <ul className="list-disc list-inside text-white/60 space-y-2">
          <li>Input validation</li>
          <li>Authentication</li>
          <li>Authorization</li>
          <li>Encryption</li>
          <li>Monitoring</li>
        </ul>
      </section>

      {/* PRACTICE */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          Practice Exercises
        </h2>

        <ul className="list-disc list-inside text-white/60 space-y-2">
          <li>Create a secure login form with validation</li>
          <li>Implement role-based access control</li>
          <li>Sanitize all user inputs</li>
          <li>Simulate invalid requests</li>
        </ul>
      </section>

      {/* FINAL */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Final Thoughts</h2>

        <p className="text-white/60 leading-8">
          Security is not about writing more code.
          It is about writing safer code.
        </p>

        <p className="text-white/60 leading-8 font-medium">
          Always think:
          "What if this input is malicious?"
        </p>
      </section>

    </div>
  );
}