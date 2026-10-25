// NEW (PE-2): reusable form input. Any form can use it for a label, the
// input itself and its error message, instead of repeating that markup.
// Uses the same CSS classes as the Login/Signup forms so it looks identical.
export default function FormInput({ label, name, error, ...inputProps }) {
  return (
    <>
      <label className="field">
        <span className="field-label">{label}</span>
        <input
          name={name}
          aria-invalid={!!error}
          className={error ? 'field-invalid' : ''}
          {...inputProps}
        />
      </label>
      {error && <p className="field-error">{error}</p>}
    </>
  );
}
