export type Mode = 'discount' | 'percentage' | 'increase' | 'original';
const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const percentFormatter = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });
export const money = (value: number) => currencyFormatter.format(value);
export const percent = (value: number) => percentFormatter.format(value);
const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function parseNumber(value: string): number {
  const cleaned = value.trim().replace(/^R\$\s?/, '').replace(/\s/g, '');
  if (/^[1-9]\d{0,2}(?:\.\d{3})+(?:,\d{1,})?$/.test(cleaned)) {
    return Number(cleaned.replace(/\./g, '').replace(',', '.'));
  }
  if (!/^\d+(?:[.,]\d*)?$/.test(cleaned)) return NaN;
  return Number(cleaned.replace(',', '.'));
}

export function validatePrice(price: number, inverse = false) {
  if (!Number.isFinite(price) || roundMoney(price) <= 0 || price > 1e12) {
    throw new Error(`Informe um preço ${inverse ? 'final' : 'original'} de pelo menos R$ 0,01 e até R$ 1 trilhão.`);
  }
}

/** Monetary results use cents. In original mode, price is the known final price. */
export function calculate(price: number, value: number, mode: Mode) {
  validatePrice(price, mode === 'original');
  if (!Number.isFinite(value) || value < 0) throw new Error('Informe um valor válido, igual ou maior que zero.');
  if (mode === 'discount' && value > 100) throw new Error('O desconto deve estar entre 0% e 100%.');
  if (mode === 'original' && value >= 100) throw new Error('Para descobrir o preço original, o desconto deve ser menor que 100%.');
  if (mode === 'percentage' && value > price) throw new Error('O preço promocional não pode ser maior que o preço original.');
  if (mode === 'increase' && value > 100000) throw new Error('Informe um acréscimo de até 100.000%.');
  price = roundMoney(price);
  if (mode === 'original') {
    const original = roundMoney(price / (1 - value / 100));
    if (!Number.isFinite(original) || original > 1e12) throw new Error('O preço original calculado ultrapassa o limite de R$ 1 trilhão.');
    return { original, rate: value, amount: roundMoney(original - price), final: price };
  }
  const promotional = roundMoney(value);
  const rate = mode === 'percentage' ? (price - promotional) / price * 100 : value;
  const amount = mode === 'percentage' ? roundMoney(price - promotional) : roundMoney(price * value / 100);
  const final = mode === 'percentage' ? promotional : roundMoney(mode === 'increase' ? price + amount : price - amount);
  if (!Number.isSafeInteger(Math.round(final * 100)) || !Number.isSafeInteger(Math.round(amount * 100))) {
    throw new Error('O resultado ultrapassa o limite de precisão em centavos. Use valores menores.');
  }
  return { original: price, rate, amount, final };
}
