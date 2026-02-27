import React from "react";

export default function Levels() {
  return (
    <div className="space-y-12">

      <header>
        <h1 className="text-4xl font-bold mb-4">Difficulty Levels</h1>
        <p className="text-white/60 leading-7 text-lg">
          GetBugged provides structured levels that progressively challenge your
          debugging ability. Each level simulates increasing complexity found in
          real-world engineering systems.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Level 1 – Mildly Buggy</h2>
        <p className="text-white/60 leading-7">
          Designed for beginners, Level 1 focuses on common mistakes such as:
        </p>
        <ul className="list-disc list-inside text-white/60 space-y-2">
          <li>Incorrect variable names</li>
          <li>Basic logical errors</li>
          <li>Small syntax mistakes</li>
          <li>Simple runtime exceptions</li>
        </ul>
        <p className="text-white/60 leading-7">
          The goal is to build debugging awareness and confidence.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Level 2 – Moderately Buggy</h2>
        <p className="text-white/60 leading-7">
          Introduces realistic application-level problems including:
        </p>
        <ul className="list-disc list-inside text-white/60 space-y-2">
          <li>Incorrect condition checks</li>
          <li>Edge-case handling issues</li>
          <li>Data inconsistency problems</li>
          <li>State management flaws</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Level 3 – Severely Buggy</h2>
        <p className="text-white/60 leading-7">
          Level 3 simulates production-grade issues such as:
        </p>
        <ul className="list-disc list-inside text-white/60 space-y-2">
          <li>Asynchronous race conditions</li>
          <li>Memory leaks</li>
          <li>Incorrect architectural decisions</li>
          <li>Complex multi-layer bugs</li>
        </ul>
        <p className="text-white/60 leading-7">
          These challenges train you for real engineering environments.
        </p>
      </section>

    </div>
  );
}