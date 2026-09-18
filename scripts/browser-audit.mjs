// Browser integration audit with Chrome DevTools Protocol; no test framework dependency.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
const origin = 'http://127.0.0.1:3100';
const browserPath = process.env.BROWSER_PATH;
if (!browserPath) throw new Error('Set BROWSER_PATH to an installed Chromium executable.');
const output = '/tmp/desconta-portal-audit';
mkdirSync(output, { recursive: true });
const children = [];
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function retry(task, attempts = 100) {
  for (let count = 0; count < attempts; count++) {
    try { return await task(); } catch (error) { if (count === attempts - 1) throw error; await delay(200); }
  }
}
function start(command, args) {
  const child = spawn(command, args, { env: process.env, stdio: ['ignore', 'pipe', 'pipe'] });
  child.stdout.on('data', chunk => process.stdout.write(chunk));
  child.stderr.on('data', chunk => process.stderr.write(chunk));
  children.push(child);
  return child;
}
let socket;
try {
  start(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '3100', '-H', '127.0.0.1']);
  await retry(async () => { const response = await fetch(origin); assert.equal(response.status, 200); });
  start(browserPath, ['--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', `--user-data-dir=${output}/profile`, '--remote-debugging-port=9223', 'about:blank']);
  const targets = await retry(async () => (await fetch('http://127.0.0.1:9223/json')).json());
  socket = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let id = 0;
  const pending = new Map();
  const runtimeErrors = [];
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') runtimeErrors.push(message.params.exceptionDetails.text);
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    if (message.error) request.reject(new Error(JSON.stringify(message.error))); else request.resolve(message.result);
  };
  function command(method, params = {}) {
    return new Promise((resolve, reject) => { const key = ++id; pending.set(key, { resolve, reject }); socket.send(JSON.stringify({ id: key, method, params })); });
  }
  async function evaluate(expression) {
    const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
  await command('Page.enable');
  await command('Runtime.enable');
  await command('Page.addScriptToEvaluateOnNewDocument', { source: `window.auditVitals={cls:0,lcp:0};new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.auditVitals.cls+=e.value}).observe({type:'layout-shift',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())window.auditVitals.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});` });
  async function navigate(path, width) {
    await command('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
    await command('Page.navigate', { url: origin + path });
    await retry(async () => assert.equal(await evaluate(`document.readyState === 'complete' && location.pathname === ${JSON.stringify(path)}`), true));
    await delay(300);
  }
  async function screenshot(name) {
    const shot = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
    writeFileSync(`${output}/${name}.png`, Buffer.from(shot.data, 'base64'));
  }
  const measurements = [];
  for (const width of [320, 360, 375, 390, 430, 768, 1024, 1440]) {
    await navigate('/calculadora-desconto', width);
    const state = await evaluate(`({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length, toolTop:document.querySelector('#calculadora').getBoundingClientRect().top, ...window.auditVitals})`);
    assert.ok(state.scrollWidth <= width, `Horizontal overflow at ${width}px`);
    assert.equal(state.h1, 1);
    measurements.push(state);
    await screenshot(`desconto-${width}`);
  }
  await navigate('/calculadora-desconto', 375);
  // Wait until React hydration is demonstrably active before testing interactions.
  await retry(async () => {
    await evaluate(`document.getElementById('tab-original').click()`);
    assert.equal(await evaluate(`document.getElementById('tab-original').getAttribute('aria-selected')`), 'true');
  });
  assert.match(await evaluate(`document.querySelector('.result-details').textContent`), /1.000,00/);
  await evaluate(`document.getElementById('tab-increase').click()`); await delay(50);
  assert.match(await evaluate(`document.querySelector('.final-price strong').textContent`), /1.200,00/);
  await evaluate(`document.getElementById('tab-percentage').click()`); await delay(50);
  assert.match(await evaluate(`document.querySelector('.percentage-result').textContent`), /20%/);
  await evaluate(`document.querySelectorAll('.example-buttons button')[2].click()`); await delay(50);
  assert.match(await evaluate(`document.querySelector('.final-price strong').textContent`), /700,00/);
  await evaluate(`Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.auditCopied=text}}});Object.defineProperty(navigator,'share',{configurable:true,value:async data=>{window.auditShared=data}});document.querySelector('.copy-button').click()`);
  await delay(50);
  assert.match(await evaluate('window.auditCopied'), /700,00/);
  await evaluate(`document.querySelector('.share-button').click()`); await delay(50);
  assert.equal(await evaluate('window.auditShared.url'), origin + '/calculadora-desconto');
  assert.match(await evaluate('window.auditShared.text'), /700,00/);
  await evaluate(`document.getElementById('tab-discount').focus()`);
  await command('Input.dispatchKeyEvent', { type: 'keyDown', key: 'End', code: 'End', windowsVirtualKeyCode: 35 });
  await delay(50);
  assert.equal(await evaluate(`document.activeElement.id`), 'tab-original');
  await evaluate(`document.querySelector('.reset-button').click()`); await delay(50);
  assert.equal(await evaluate(`document.querySelector('.copy-button').disabled`), true);
  await evaluate(`document.querySelector('.calculate-button').click()`); await delay(50);
  assert.equal(await evaluate(`document.activeElement.id`), 'original');
  assert.equal(await evaluate(`document.getElementById('original').getAttribute('aria-invalid')`), 'true');
  await screenshot('erro-mobile');
  for (const path of ['/', '/calculadoras', '/sobre', '/contato', '/politica-de-privacidade', '/termos']) {
    await navigate(path, 375);
    assert.ok(await evaluate(`document.documentElement.scrollWidth <= innerWidth`), path);
    await screenshot(path === '/' ? 'home-mobile' : path.slice(1));
    const response = await fetch(origin + path);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(html.includes('rel="canonical"'), path);
  }
  assert.equal((await fetch(origin + '/nao-existe')).status, 404);
  const redirect = await fetch(origin + '/privacidade', { redirect: 'manual' });
  assert.equal(redirect.status, 308);
  assert.equal(redirect.headers.get('location'), '/politica-de-privacidade');
  for (const path of ['/robots.txt', '/sitemap.xml']) assert.equal((await fetch(origin + path)).status, 200);
  assert.deepEqual(runtimeErrors, []);
  writeFileSync(`${output}/measurements.json`, JSON.stringify(measurements, null, 2));
  process.stdout.write(`Browser audit passed. Screenshots and local lab observations: ${output}\n`);
} finally {
  socket?.close();
  for (const child of children.reverse()) child.kill('SIGTERM');
}
