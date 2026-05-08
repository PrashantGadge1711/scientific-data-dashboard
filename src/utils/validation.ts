export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
  suggestions: string[];
  entropy: number;
}

export function checkPasswordStrength(pw: string): PasswordStrength {
  let score = 0;
  const suggestions: string[] = [];
  if (pw.length >= 12) score++; else suggestions.push('Use at least 12 characters');
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++; else suggestions.push('Mix uppercase and lowercase');
  if (/\d/.test(pw)) score++; else suggestions.push('Add at least one number');
  if (/[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]/.test(pw)) score++; else suggestions.push('Add special characters');
  const charset = (/[a-z]/.test(pw) ? 26 : 0) + (/[A-Z]/.test(pw) ? 26 : 0)
    + (/\d/.test(pw) ? 10 : 0) + (/[^a-zA-Z0-9]/.test(pw) ? 32 : 0);
  const entropy = charset > 0 ? Math.round(pw.length * Math.log2(charset)) : 0;
  const LABELS = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const COLORS = ['rose', 'orange', 'amber', 'lime', 'emerald'];
  return { score: score as 0 | 1 | 2 | 3 | 4, label: LABELS[score], color: COLORS[score], suggestions, entropy };
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validateDateRange(from: string, to: string): string | null {
  if (!from || !to) return null;
  if (new Date(from) > new Date(to)) return 'Start date must be before end date';
  const diff = (new Date(to).getTime() - new Date(from).getTime()) / 86400000;
  if (diff > 730) return 'Date range cannot exceed 2 years';
  return null;
}

export function validateCSVHeaders(headers: string[], required: string[]): string[] {
  const lower = headers.map(h => h.toLowerCase().trim());
  return required.filter(r => !lower.includes(r.toLowerCase()));
}

export function detectOutliers(values: number[]): number[] {
  if (values.length < 4) return [];
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  return values.filter(v => v < q1 - 1.5 * iqr || v > q3 + 1.5 * iqr);
}

export function calcStats(values: number[]): { mean: number; std: number; min: number; max: number; variance: number } {
  const n = values.length;
  if (n === 0) return { mean: 0, std: 0, min: 0, max: 0, variance: 0 };
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
  return {
    mean: Number(mean.toFixed(3)),
    std: Number(Math.sqrt(variance).toFixed(3)),
    min: Number(Math.min(...values).toFixed(3)),
    max: Number(Math.max(...values).toFixed(3)),
    variance: Number(variance.toFixed(3)),
  };
}

export function validateFileSize(bytes: number, maxMB = 10): string | null {
  if (bytes > maxMB * 1024 * 1024) return `File exceeds ${maxMB}MB limit`;
  return null;
}

export function validateFileType(name: string, allowed: string[]): string | null {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (!allowed.includes(ext)) return `File type .${ext} not allowed. Use: ${allowed.join(', ')}`;
  return null;
}

export function checkContrastRatio(bg: string, fg: string): number {
  const luminance = (hex: string) => {
    const rgb = parseInt(hex.replace('#', ''), 16);
    const r = ((rgb >> 16) & 255) / 255;
    const g = ((rgb >> 8) & 255) / 255;
    const b = (rgb & 255) / 255;
    const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  };
  const L1 = luminance(bg);
  const L2 = luminance(fg);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}
