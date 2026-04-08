export function formatDate(
  date: Date | string | number | undefined,
  locale: string = 'vi-VN',
  opts: Intl.DateTimeFormatOptions = {},
) {
  if (!date) return '';

  try {
    return new Intl.DateTimeFormat(locale, {
      month: opts.month ?? 'numeric',
      day: opts.day ?? 'numeric',
      year: opts.year ?? 'numeric',
      ...opts,
    }).format(new Date(date));
  } catch (_err) {
    return '';
  }
}

export function formatCurrency(
  value: number | string | undefined,
  locale: string = 'vi-VN',
) {
  if (value === undefined) return '';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const currency = locale === 'en-US' ? 'USD' : 'VND'; // Default to USD for now, can be extended based on locale
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(numValue);
}
