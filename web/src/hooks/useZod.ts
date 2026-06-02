import { useAppI18n } from "@/hooks/useAppI18n";
import { z } from "zod";

/**
 * useZod Hook
 * Provides a translated Zod validation setup.
 * It automatically fetches translations from en.json/kh.json based on the current locale.
 */
export function useZod() {
  const { t } = useAppI18n();

  // Helper to create translated error objects with dynamic field names
  const err = {
    // Required field: "{field} is required"
    required: (fieldKey: string) => ({
      message: t("validation.required", { field: t(fieldKey) }),
    }),

    // Minimum length/value: "{field} must be at least {count}"
    min: (fieldKey: string, count: number) => ({
      message: t("validation.min", { field: t(fieldKey), count }),
    }),

    // Maximum length/value: "{field} must not exceed {count}"
    max: (fieldKey: string, count: number) => ({
      message: t("validation.max", { field: t(fieldKey), count }),
    }),

    // Email validation: "Invalid email address"
    email: () => ({
      message: t("validation.email"),
    }),

    // URL validation: "Invalid URL format"
    url: () => ({
      message: t("validation.url"),
    }),

    // Phone validation: "Invalid phone number format"
    phone: () => ({
      message: t("validation.phone"),
    }),

    // Number validation: "{field} must be a number"
    number: (fieldKey: string) => ({
      message: t("validation.number", { field: t(fieldKey) }),
    }),

    // Positive number: "{field} must be a positive number"
    positive: (fieldKey: string) => ({
      message: t("validation.positive", { field: t(fieldKey) }),
    }),

    // GTE (Greater than or equal): "{field} must be at least {count}"
    gte: (fieldKey: string, count: number) => ({
      message: t("validation.gte", { field: t(fieldKey), count }),
    }),

    // LTE (Less than or equal): "{field} must not exceed {count}"
    lte: (fieldKey: string, count: number) => ({
      message: t("validation.lte", { field: t(fieldKey), count }),
    }),

    // Match (e.g. Password confirmation): "{field1} and {field2} must match"
    match: (fieldKey1: string, fieldKey2: string) => ({
      message: t("validation.match", { 
        field1: t(fieldKey1), 
        field2: t(fieldKey2) 
      }),
    }),
  };

  /**
   * Cambodian Phone Regex
   * Starts with 0, followed by 8 or 9 digits
   */
  const phoneRegex = /^(0\d{8,9})$/;

  return { z, err, phoneRegex };
}
