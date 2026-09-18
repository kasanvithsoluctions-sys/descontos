import test from 'node:test';
import assert from 'node:assert/strict';
import { calculate, parseNumber } from '../src/lib/calculations';
test('discount, percentage and increase', () => {
 assert.deepEqual(calculate(500, 20, 'discount'), { original: 500, rate: 20, amount: 100, final: 400 });
 assert.equal(calculate(500, 400, 'percentage').rate, 20);
 assert.equal(calculate(500, 20, 'increase').final, 600);
});
test('bounds and rounding', () => {
 assert.equal(calculate(500, 100, 'discount').final, 0);
 assert.equal(calculate(500, 0, 'discount').final, 500);
 assert.equal(calculate(19.99, 15, 'discount').final, 16.99);
 for (const fn of [() => calculate(0, 20, 'discount'), () => calculate(500, 101, 'discount'), () => calculate(500, 501, 'percentage'), () => calculate(NaN, 20, 'increase')]) assert.throws(fn);
});
test('Brazilian and decimal inputs', () => {
 assert.equal(parseNumber('R$ 1.500,50'), 1500.5);
 assert.equal(parseNumber('500.50'), 500.5);
 assert.ok(Number.isNaN(parseNumber('')));
 assert.ok(Number.isNaN(parseNumber('-20')));
 assert.ok(Number.isNaN(parseNumber('10abc')));
});
test('original price and inverse limits', () => {
 assert.deepEqual(calculate(800, 20, 'original'), { original: 1000, rate: 20, amount: 200, final: 800 });
 assert.equal(calculate(800, 0, 'original').original, 800);
 assert.equal(calculate(0.01, 50, 'original').original, 0.02);
 assert.throws(() => calculate(800, 100, 'original'));
 assert.throws(() => calculate(800, 101, 'original'));
 assert.throws(() => calculate(1e12, 99, 'original'));
});
test('quick examples and successive discounts', () => {
 for (const [price, rate, expected] of [[100, 10, 90], [500, 20, 400], [1000, 30, 700], [250, 50, 125]]) {
  assert.equal(calculate(price, rate, 'discount').final, expected);
 }
 const first = calculate(100, 20, 'discount').final;
 const second = calculate(first, 20, 'discount').final;
 assert.equal(second, 64);
 assert.equal(calculate(100, second, 'percentage').rate, 36);
});
test('Brazilian grouping and malformed inputs', () => {
 assert.equal(parseNumber('1.000'), 1000);
 assert.equal(parseNumber('1.234.567,89'), 1234567.89);
 assert.equal(parseNumber('0,125'), 0.125);
 assert.ok(Number.isNaN(parseNumber('1.23.456')));
 assert.ok(Number.isNaN(parseNumber('20%')));
});
test('rounding conserves original price and rejects nonfinite inputs', () => {
 for (const price of [0.01, 19.99, 100, 1000.01]) {
  for (const rate of [0, 5, 20, 33.33, 99.99, 100]) {
   const result = calculate(price, rate, 'discount');
   assert.equal(Math.round((result.final + result.amount) * 100), Math.round(price * 100));
   assert.ok(result.final >= 0);
  }
 }
 assert.equal(calculate(1.005, 0, 'discount').final, 1.01);
 assert.throws(() => calculate(Infinity, 20, 'discount'));
 assert.throws(() => calculate(100, Infinity, 'increase'));
 assert.throws(() => calculate(0.001, 20, 'discount'));
 assert.throws(() => calculate(1e12, 100000, 'increase'), /precisão/);
});
