export default function SignInPage() {
  return (
    <main className="pageShell narrowPage">
      <p className="eyebrow">Account boundary</p>
      <h1>Sign in</h1>
      <p className="lede">Authentication wiring is prepared for Supabase. Guest exploration remains available; cloud saving requires a configured project.</p>
      <form className="panel authForm">
        <label className="fieldLabel" htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" placeholder="you@example.com" disabled />
        <button className="primaryButton buttonReset" type="button" disabled>Continue with email</button>
        <p className="finePrint">Disabled until Supabase environment variables and redirect URLs are configured. This control intentionally does not pretend to work.</p>
      </form>
    </main>
  );
}
