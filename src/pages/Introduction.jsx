import React from "react";

export default function Introduction() {
  return (
    <div className="space-y-10">

      {/* Title */}
      <div>
        <h1 className="text-4xl font-bold mb-4">
          Introduction to GetBugged
        </h1>
        <p className="text-white/60 leading-7 text-lg">
          GetBugged is a hands-on debugging training platform designed to help
          developers improve real-world problem-solving skills by working with
          intentionally broken code.
        </p>
      </div>

      {/* What is GetBugged */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          What is GetBugged?
        </h2>
        <p className="text-white/60 leading-7">
          Unlike traditional coding platforms that focus only on writing clean
          solutions from scratch, GetBugged focuses on a more realistic
          engineering skill: fixing broken systems.
        </p>
        <p className="text-white/60 leading-7">
          In real-world software development, engineers spend a significant
          amount of time debugging existing codebases. GetBugged simulates this
          environment by injecting logical, runtime, async, and architectural
          bugs into code and challenging you to identify and resolve them.
        </p>
      </section>

      {/* Why Debugging Matters */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Why Debugging Skills Matter
        </h2>
        <p className="text-white/60 leading-7">
          Debugging is one of the most critical skills for software engineers.
          Strong debugging ability means:
        </p>

        <ul className="list-disc list-inside text-white/60 space-y-2">
          <li>Faster issue resolution in production systems</li>
          <li>Better understanding of complex codebases</li>
          <li>Improved logical reasoning</li>
          <li>Higher confidence during interviews and real projects</li>
          <li>Stronger problem-solving mindset</li>
        </ul>
      </section>

      {/* How GetBugged Works */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          How GetBugged Works
        </h2>

        <p className="text-white/60 leading-7">
          GetBugged generates buggy code based on selected difficulty levels.
          You are expected to:
        </p>

        <div className="bg-white/5 border border-white/10 rounded-md p-6 space-y-3">
          <p className="text-white/70">
            1 Analyze the expected behavior of the code
          </p>
          <p className="text-white/70">
            2 Identify logical, syntax, or runtime issues
          </p>
          <p className="text-white/70">
            3 Apply structured debugging techniques
          </p>
          <p className="text-white/70">
            4 Fix the issues and validate the solution
          </p>
        </div>
      </section>

      {/* Who Should Use */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Who Should Use GetBugged?
        </h2>

        <ul className="list-disc list-inside text-white/60 space-y-2">
          <li>Frontend Developers</li>
          <li>Backend Developers</li>
          <li>Computer Science Students</li>
          <li>Interview Preparation Candidates</li>
          <li>Engineering Teams conducting training</li>
        </ul>
      </section>

      {/* Vision */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Vision
        </h2>
        <p className="text-white/60 leading-7">
          The vision of GetBugged is to bridge the gap between theoretical
          coding practice and real-world debugging challenges. By repeatedly
          solving practical debugging scenarios, users build a mindset that
          mirrors real engineering environments.
        </p>
      </section>

    </div>
  );
}