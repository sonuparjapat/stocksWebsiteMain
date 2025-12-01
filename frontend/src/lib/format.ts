export const formatCurrency = (val: number, locale='en-IN', currency='INR') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(val);

export const formatNumber = (val: number) =>
  new Intl.NumberFormat('en-IN').format(val);