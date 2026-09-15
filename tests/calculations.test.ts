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
