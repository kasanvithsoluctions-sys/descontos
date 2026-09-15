export type Mode = 'discount' | 'percentage' | 'increase';
export const money = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
export const percent = (value: number) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(value);
export function parseNumber(value: string): number {
  const cleaned = value.trim().replace(/R\$\s?/g, '').replace(/\s/g, '');
  if (!cleaned || !/^(?:\d+(?:[.,]\d*)?|\d{1,3}(?:\.\d{3})+(?:,\d*)?)$/.test(cleaned)) return NaN;
  return Number(cleaned.includes(',') ? cleaned.replace(/\./g, '').replace(',', '.') : cleaned);
}
export function calculate(original: number, value: number, mode: Mode) {
  if (!Number.isFinite(original) || original <= 0 || original > 1e12) throw new Error('Informe um preço original maior que zero e até R$ 1 trilhão.');
  if (!Number.isFinite(value) || value < 0) throw new Error('Informe um valor válido, igual ou maior que zero.');
  if (mode === 'discount' && value > 100) throw new Error('O desconto deve estar entre 0% e 100%.');
  if (mode === 'percentage' && value > original) throw new Error('O preço promocional não pode ser maior que o preço original.');
  if (mode === 'increase' && value > 100000) throw new Error('Informe um acréscimo de até 100.000%.');
  const rate = mode === 'percentage' ? (original - value) / original * 100 : value;
  const amount = Math.round((mode === 'percentage' ? original - value : original * value / 100) * 100) / 100;
  const final = Math.round((mode === 'increase' ? original + amount : original - amount) * 100) / 100;
  return { original, rate, amount, final };
}
