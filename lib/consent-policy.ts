const GDPR_COUNTRY_CODES = new Set([
  "AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR",
  "GR", "HR", "HU", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL",
  "PT", "RO", "SE", "SI", "SK", "IS", "LI", "NO", "GB",
]);

export function requiresCookieConsent(countryCode: string | null): boolean {
  if (!countryCode) return true;
  return GDPR_COUNTRY_CODES.has(countryCode.toUpperCase());
}
