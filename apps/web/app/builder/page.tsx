import { BuilderDemo } from "../../components/BuilderDemo";

export default function BuilderPage() {
  return (
    <main className="pageShell">
      <div className="pageHeading">
        <div>
          <p className="eyebrow">Minimum vertical slice</p>
          <h1>Compatibility builder</h1>
        </div>
        <span className="demoBadge">DEMO_UNVERIFIED DATA</span>
      </div>
      <BuilderDemo />
    </main>
  );
}
