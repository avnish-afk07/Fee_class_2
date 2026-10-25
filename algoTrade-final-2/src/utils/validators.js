const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(name) {
  const trimmed = name.trim();
  if (!trimmed) return 'Name is required.';
  if (trimmed.length < 2) return 'Name must be at least 2 characters.';
  if (trimmed.length > 60) return 'Name must be under 60 characters.';
  if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) return 'Name can only contain letters, spaces, - and \'.';
  return '';
}

export function validateEmail(email) {
  const trimmed = email.trim();
  if (!trimmed) return 'Email is required.';
  if (!EMAIL_RE.test(trimmed)) return 'Enter a valid email address.';
  return '';
}

export function getPasswordChecks(password) {
  return {
    length: password.length >= 8,
    letter: /[a-zA-Z]/.test(password),
    number: /[0-9]/.test(password),
  };
}

export function validatePasswordStrength(password) {
  if (!password) return 'Password is required.';
  const checks = getPasswordChecks(password);
  if (!checks.length) return 'Password must be at least 8 characters.';
  if (!checks.letter || !checks.number) return 'Password needs at least one letter and one number.';
  return '';
}

export function validatePasswordPresence(password) {
  return password ? '' : 'Password is required.';
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return 'Please confirm your password.';
  if (password !== confirmPassword) return 'Passwords do not match.';
  return '';
}

// NEW (PE-2): checkout form - the confirmation checkbox must be ticked.
export function validateAgreement(checked) {
  return checked ? '' : 'Please confirm you understand before placing the order.';
}
