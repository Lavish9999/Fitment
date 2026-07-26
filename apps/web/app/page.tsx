import Link from "next/link";

export default function HomePage() {
  return (
    <main className="pageShell hero">
      <p className="eyebrow">Evidence-driven compatibility</p>
      <h1>Know what fits before you buy.</h1>
      <p className="lede">
        Select the exact firearm variant, review compatible components, understand required
        adapters, and see the complete known cost without turning missing data into a confident claim.
      </p>
      <div className="actions">
        <Link className="primaryButton" href="/builder">Open the builder</Link>
        <a className="secondaryButton" href="#principles">Review the accuracy model</a>
      </div>
      <section id="principles" className="principleGrid" aria-label="Product principles">
        <article><strong>Exact variants</strong><span>Generation, cut, rail, thread, SKU, and revision matter.</span></article>
        <article><strong>Explain every result</strong><span>Matches, conflicts, unknowns, required parts, sources, and engine version.</span></article>
        <article><strong>Private by default</strong><span>Public builds are sanitized copies, never exposed Armory records.</span></article>
      </section>
    </main>
  );
}
