export function formatINR(amount: number): string {
  if (!amount || isNaN(amount)) return '₹0';
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function parseINR(value: string): number {
  return parseInt(value.replace(/[^\d]/g, ''), 10) || 0;
}
