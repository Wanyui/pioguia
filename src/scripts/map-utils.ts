export const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export const truncateText = (value: string, maxChars: number) => {
  if (value.length <= maxChars) return value;
  return `${value.slice(0, Math.max(0, maxChars - 1)).trimEnd()}…`;
};

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const sanitizeImageUrl = (value: string | undefined) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (trimmed.startsWith("/")) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^data:image\/(?:png|jpe?g|gif|webp);base64,[a-z0-9+/=]+$/i.test(trimmed)) {
    return trimmed;
  }
  return "";
};

export const sanitizeExternalUrl = (value: string | undefined) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return "";
};

export const splitPhoneNumbers = (value: string | undefined) => {
  if (!value) return [];
  return Array.from(
    new Set(
      value
        .split(/\s*(?:\/|,|;|\||\by\b|\bi\b|\band\b)\s*/i)
        .map((part) => part.trim())
        .filter(Boolean)
    )
  );
};

export const normalizePhoneForTel = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return "";
  if (trimmed.startsWith("+")) return `+${digits}`;
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  // Andorran local numbers in content are often stored as 6 digits.
  if (digits.length === 6) return `+376${digits}`;
  return digits;
};

export const formatPhoneLabel = (value: string) => {
  const tel = normalizePhoneForTel(value);
  if (!tel) return "";
  if (tel.startsWith("+376") && tel.length === 10) {
    return `+376 ${tel.slice(4, 7)} ${tel.slice(7)}`;
  }
  return tel.startsWith("+") ? tel : value.trim();
};

