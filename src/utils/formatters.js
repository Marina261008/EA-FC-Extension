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
