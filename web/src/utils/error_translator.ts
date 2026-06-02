import i18n from "@/i18n";

/**
 * translateBackendError
 * Maps raw backend error strings to translated frontend keys.
 * Example: "Invalid credentials" -> "api.errors.invalid_credentials"
 * 
 * @param message The raw error message from the backend
 * @returns The translated message, or the original message if no translation is found.
 */
export function translateBackendError(message: string): string {
  if (!message) return message;

  // 1. Normalize the message to create a potential JSON key
  // Example: "Invalid credentials" becomes "invalid_credentials"
  const key = message.toLowerCase().trim().replace(/\s+/g, "_");
  const path = `api.errors.${key}`;

  // 2. Try to find the translation in the i18n global state
  // We use i18n.global.t because this utility might be called outside of Vue components (e.g. in stores)
  const translated = i18n.global.t(path);

  // 3. If translation returned the path itself, it means it's not found
  if (translated === path) {
    return message;
  }

  return translated;
}
