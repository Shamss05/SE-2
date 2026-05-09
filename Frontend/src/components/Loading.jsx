export default function Loading({ label = "Loading" }) {
  return (
    <div className="state-panel">
      <span className="loader" aria-hidden="true" />
      <p>{label}...</p>
    </div>
  );
}
