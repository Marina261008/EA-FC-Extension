// Utility formatters for EA Sports FC Career Hub
// Automatically formats numbers, currency, millions and thousands with Spanish dot separators (e.g. 120.000.000 €)

/**
 * Format raw numbers or digit strings with dot thousands separators:
 * 40000000 -> "40.000.000"
 * "40m" -> "40.000.000"
 */
export function formatNumberWithDots(val) {
  if (val === null || val === undefined || val === '') return '';
  const str = String(val).trim();
  const mMatch = str.match(/^([\d.,]+)\s*m/i);
  if (mMatch) {
    const cleanNum = parseFloat(mMatch[1].replace(/\./g, '').replace(',', '.'));
    if (!isNaN(cleanNum)) {
      return Math.round(cleanNum * 1000000).toLocaleString('es-ES');
    }
  }
  const digits = str.replace(/\D/g, '');
  if (!digits) return '';
  return parseInt(digits, 10).toLocaleString('es-ES');
}

/**
 * Parses any formatted string or number into an integer:
 * "40.000.000 €" -> 40000000
 * "40m" -> 40000000
 * "120 M €" -> 120000000
 * "Libre" -> 0
 */
export function parseFormattedNumber(val) {
  if (val === null || val === undefined) return 0;
  const str = String(val).trim();
  if (!str) return 0;
  if (str.toLowerCase().includes('libre') || str.toLowerCase().includes('cesión') || str.toLowerCase().includes('cesion')) {
    return 0;
  }
  const mMatch = str.match(/^([\d.,]+)\s*m/i);
  if (mMatch) {
    const cleanNum = parseFloat(mMatch[1].replace(/\./g, '').replace(',', '.'));
    return isNaN(cleanNum) ? 0 : Math.round(cleanNum * 1000000);
  }
  const digits = str.replace(/\D/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

/**
 * Handles live input typing: as user types digits or shorthands (e.g. 120m),
 * dynamically inserts dot separators every 3 digits and maintains proper suffix.
 * e.g. "120000000" -> "120.000.000 €"
 * "120m" -> "120.000.000 €"
 * "65000" (for wage) -> "65.000 €/sem"
 */
export function formatCurrencyInput(val, { suffix = ' €' } = {}) {
  if (val === null || val === undefined) return '';
  const str = String(val).trim();
  if (!str) return '';
  
  const isWeekly = str.includes('/sem') || suffix.includes('/sem');
  const actualSuffix = isWeekly ? ' €/sem' : suffix;

  const mMatch = str.match(/^([\d.,]+)\s*m/i);
  if (mMatch) {
    const cleanNum = parseFloat(mMatch[1].replace(/\./g, '').replace(',', '.'));
    if (!isNaN(cleanNum)) {
      return Math.round(cleanNum * 1000000).toLocaleString('es-ES') + actualSuffix;
    }
  }

  const digits = str.replace(/\D/g, '');
  if (!digits) return '';
  return parseInt(digits, 10).toLocaleString('es-ES') + actualSuffix;
}

/**
 * Guarantees standard full euro dot format:
 * "120 M €" -> "120.000.000 €"
 * "120" -> "120.000.000 €" (if under 1000 treated as millions)
 * 120000000 -> "120.000.000 €"
 * "120.000.000 €" -> "120.000.000 €"
 */
export function formatToFullEuros(val, defaultFallback = '120.000.000 €') {
  if (val === null || val === undefined) return defaultFallback;
  const str = String(val).trim();
  if (!str || str.includes('NaN')) return defaultFallback;
  if (str.toLowerCase().includes('libre') || str.toLowerCase().includes('cesión')) return str;

  const isWeekly = str.includes('/sem');
  const suffix = isWeekly ? ' €/sem' : ' €';

  // Already formatted like "120.000.000 €" or "50.000 €/sem"
  if (/^\d{1,3}(\.\d{3})+\s*€(\/sem)?$/.test(str)) {
    return str;
  }

  const mMatch = str.match(/^([\d.,]+)\s*m/i);
  if (mMatch) {
    const cleanNum = parseFloat(mMatch[1].replace(/\./g, '').replace(',', '.'));
    if (!isNaN(cleanNum)) {
      return Math.round(cleanNum * 1000000).toLocaleString('es-ES') + suffix;
    }
  }

  const digits = str.replace(/\D/g, '');
  if (!digits) return defaultFallback;

  const num = parseInt(digits, 10);
  if (num < 1000 && (str.toLowerCase().includes('m') || str.toLowerCase().includes('mill'))) {
    return (num * 1000000).toLocaleString('es-ES') + suffix;
  }
  return num.toLocaleString('es-ES') + suffix;
}

/**
 * Converts any player market value or clause into numeric euros
 * e.g. "25 M €" -> 25000000, "25.000.000 €" -> 25000000, 25 -> 25000000
 */
export function parsePlayerValueInEuros(val) {
  if (val === null || val === undefined) return 25000000;
  const str = String(val).trim();
  if (!str) return 25000000;
  
  const mMatch = str.match(/^([\d.,]+)\s*m/i);
  if (mMatch) {
    const cleanNum = parseFloat(mMatch[1].replace(/\./g, '').replace(',', '.'));
    return isNaN(cleanNum) ? 25000000 : Math.round(cleanNum * 1000000);
  }
  
  const digits = str.replace(/\D/g, '');
  if (!digits) return 25000000;
  const num = parseInt(digits, 10);
  if (num < 1000) {
    return num * 1000000;
  }
  return num;
}

export const SPANISH_MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export const SPANISH_MONTHS_FULL = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

/**
 * Parses a Spanish formatted date string or ISO into a Date object:
 * "01 jul 2025" -> Date(2025, 6, 1)
 * "14 sep 2026" -> Date(2026, 8, 14)
 * "2025-07-01"  -> Date(2025, 6, 1)
 */
export function parseSpanishDate(str) {
  if (!str) return new Date();
  if (str instanceof Date) return str;
  const s = String(str).toLowerCase().trim();
  
  const m = s.match(/(\d{1,2})\s+([a-záéíóúñ]+)\s+(\d{4})/i);
  if (m) {
    const day = parseInt(m[1], 10);
    const mStr = m[2].slice(0, 3);
    const monthIdx = SPANISH_MONTHS.indexOf(mStr);
    const year = parseInt(m[3], 10);
    if (monthIdx !== -1 && !isNaN(day) && !isNaN(year)) {
      return new Date(year, monthIdx, day);
    }
  }

  const iso = s.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) {
    return new Date(parseInt(iso[1], 10), parseInt(iso[2], 10) - 1, parseInt(iso[3], 10));
  }

  const yearMatch = s.match(/\b(20\d\d)\b/);
  if (yearMatch) {
    return new Date(parseInt(yearMatch[1], 10), 6, 1);
  }

  return new Date();
}

/**
 * Formats a Date object into standard Spanish string: "DD mmm YYYY" (e.g. "01 jul 2025")
 */
export function formatSpanishDate(dateObj) {
  if (!dateObj) return '01 jul 2025';
  const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
  if (isNaN(d.getTime())) return '01 jul 2025';
  const day = String(d.getDate()).padStart(2, '0');
  const month = SPANISH_MONTHS[d.getMonth()] || 'jul';
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Returns a new Date offset by N days
 */
export function addDaysToDate(dateObj, days) {
  const base = dateObj instanceof Date ? new Date(dateObj.getTime()) : parseSpanishDate(dateObj);
  base.setDate(base.getDate() + days);
  return base;
}

/**
 * Difference in calendar days between two dates (d1 - d2)
 */
export function diffDays(d1, d2) {
  const date1 = d1 instanceof Date ? d1 : parseSpanishDate(d1);
  const date2 = d2 instanceof Date ? d2 : parseSpanishDate(d2);
  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.round((utc1 - utc2) / (1000 * 60 * 60 * 24));
}
