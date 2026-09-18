'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { calculate, money, parseNumber, percent, validatePrice, type Mode } from '@/lib/calculations';
import { Icon } from './icon';

const modes = [
  { id: 'discount', label: 'Calcular desconto', short: 'Desconto', icon: 'tag' },
  { id: 'percentage', label: 'Descobrir percentual', short: 'Percentual', icon: 'percent' },
  { id: 'increase', label: 'Calcular acréscimo', short: 'Acréscimo', icon: 'plus' },
  { id: 'original', label: 'Preço original', short: 'Preço original', icon: 'reset' },
] as const;
const descriptions: Record<Mode, string> = {
  discount: 'Veja quanto você economiza e o valor a pagar.',
  percentage: 'Compare o preço original com o preço da promoção.',
  increase: 'Veja o novo preço após aplicar um aumento.',
  original: 'Descubra o preço antes do desconto aplicado.',
};

export function Calculator() {
  const [mode, setMode] = useState<Mode>('discount');
  const [original, setOriginal] = useState('1000,00');
  const [finalPrice, setFinalPrice] = useState('800,00');
  const [shareMessage, setShareMessage] = useState('');
  const [values, setValues] = useState<Record<Mode, string>>({ discount: '20', percentage: '800,00', increase: '20', original: '20' });
  const [touched, setTouched] = useState({ original: false, value: false });
  const [edited, setEdited] = useState(false);
  const [copied, setCopied] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const originalRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const revision = useRef(0);
  const value = values[mode];
  const increase = mode === 'increase';
  const promotional = mode === 'percentage';
  const inverse = mode === 'original';
  const priceInput = inverse ? finalPrice : original;
  let result: ReturnType<typeof calculate> | null = null;
  let originalError = '';
  let valueError = '';

  try { validatePrice(parseNumber(priceInput), inverse); }
  catch (error) { originalError = (error as Error).message; }
  if (!originalError) {
    try { result = calculate(parseNumber(priceInput), parseNumber(value), mode); }
    catch (error) { valueError = (error as Error).message; }
  }
  const showOriginalError = touched.original && !!originalError;
  const showValueError = touched.value && !!valueError;
  const summary = result
    ? `${inverse && result ? `Preço original: ${money(result.original)}. ` : ''}${promotional ? `Desconto de ${percent(result.rate)}%. ` : ''}Preço final: ${money(result.final)}. ${increase ? 'Valor acrescentado' : 'Você economiza'}: ${money(result.amount)}.`
    : '';

  useEffect(() => {
    const timer = setTimeout(() => setAnnouncement(summary), 400);
    return () => clearTimeout(timer);
  }, [summary]);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(''), 3500);
    return () => clearTimeout(timer);
  }, [copied]);

  function markEdited() {
    revision.current += 1;
    setEdited(true);
    setCopied('');
    setShareMessage('');
  }
  function changeMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    setTouched({ original: false, value: false });
    markEdited();
  }
  function navigateTabs(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % modes.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index + modes.length - 1) % modes.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = modes.length - 1;
    else return;
    event.preventDefault();
    changeMode(modes[nextIndex].id);
    document.getElementById(`tab-${modes[nextIndex].id}`)?.focus();
  }
  async function copy() {
    if (!result) return;
    const currentRevision = revision.current;
    try {
      await navigator.clipboard.writeText(`Preço original: ${money(result.original)}\n${increase ? 'Acréscimo' : 'Desconto'}: ${percent(result.rate)}%\n${increase ? 'Valor acrescentado' : 'Você economiza'}: ${money(result.amount)}\nPreço final: ${money(result.final)}`);
      if (revision.current === currentRevision) setCopied('Resultado copiado');
    } catch {
      if (revision.current === currentRevision) setCopied('Não foi possível copiar. Selecione o resultado para copiar.');
    }
  }

  async function share() {
    if (!result) return;
    const currentRevision = revision.current;
    const text = `Preço original: ${money(result.original)}. ${increase ? 'Acréscimo' : 'Desconto'}: ${percent(result.rate)}%. ${summary}`;
    const url = `${window.location.origin}/calculadora-desconto`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Calculadora de Desconto — Desconta', text, url });
        if (revision.current === currentRevision) setShareMessage('Resultado compartilhado.');
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        if (revision.current === currentRevision) setShareMessage('Resultado e link copiados para compartilhar.');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      if (revision.current === currentRevision) setShareMessage('Não foi possível compartilhar. Você pode selecionar e copiar o resultado.');
    }
  }

  return (
    <>
    <section id="calculadora" className="calculator-card" aria-label="Calculadora de preços">
      <div className="mode-tabs" role="tablist" aria-label="Tipo de cálculo">
        {modes.map((item, index) => (
          <button key={item.id} type="button" role="tab" id={`tab-${item.id}`}
            aria-selected={mode === item.id} aria-controls="calculation-panel"
            aria-label={item.label} tabIndex={mode === item.id ? 0 : -1}
            onKeyDown={event => navigateTabs(event, index)} onClick={() => changeMode(item.id)}
            className={mode === item.id ? 'active' : ''}>
            <Icon name={item.icon} size={18} />
            <span className="tab-full">{item.label}</span><span className="tab-short">{item.short}</span>
          </button>
        ))}
      </div>
      <div className="calculator-body" id="calculation-panel" role="tabpanel" aria-labelledby={`tab-${mode}`}>
        <form noValidate onSubmit={event => {
          event.preventDefault();
          setTouched({ original: true, value: true }); setEdited(true);
          if (originalError) originalRef.current?.focus();
          else if (valueError) valueRef.current?.focus();
          else resultRef.current?.focus();
        }}>
          <div className="form-heading"><p className="panel-title">Informe os valores</p>{!edited && <span className="example-badge">Exemplo</span>}</div>
          <p className="field-help mode-description">{descriptions[mode]}</p>
          <div className="field-group">
            <label htmlFor="original">{inverse ? 'Preço final (com desconto)' : 'Preço original'}</label>
            <div className={`input-wrap${showOriginalError ? ' input-error' : ''}`}>
              <span aria-hidden="true">R$</span>
              <input ref={originalRef} id="original" aria-label={inverse ? 'Preço final em reais' : 'Preço original em reais'} inputMode="decimal"
                autoComplete="off" placeholder="0,00" value={priceInput} maxLength={22}
                onChange={event => { if (inverse) setFinalPrice(event.target.value); else setOriginal(event.target.value); markEdited(); }}
                onBlur={() => setTouched(current => ({ ...current, original: true }))}
                aria-invalid={showOriginalError} aria-describedby={showOriginalError ? 'original-error' : undefined} />
            </div>
            {showOriginalError && <p id="original-error" className="field-error">{originalError}</p>}
          </div>
          <div className="field-group">
            <label htmlFor="value">{promotional ? 'Preço promocional' : increase ? 'Acréscimo' : 'Desconto'}<span>{promotional ? 'em reais' : 'em porcentagem'}</span></label>
            <div className={`input-wrap${showValueError ? ' input-error' : ''}`}>
              <span aria-hidden="true">{promotional ? 'R$' : '%'}</span>
              <input ref={valueRef} id="value" inputMode="decimal" autoComplete="off"
                placeholder={promotional ? '0,00' : '0'} value={value} maxLength={22}
                onChange={event => { setValues(current => ({ ...current, [mode]: event.target.value })); markEdited(); }}
                onBlur={() => setTouched(current => ({ ...current, value: true }))}
                aria-invalid={showValueError} aria-describedby={showValueError ? 'value-error' : undefined} />
            </div>
            {showValueError && <p id="value-error" className="field-error">{valueError}</p>}
          </div>
          <div className="shortcuts-area">
            {promotional ? <p className="field-help">Informe o preço pelo qual o produto está sendo vendido.</p> : (
              <div className="quick-values" role="group" aria-label="Porcentagens frequentes">
                {[5, 10, 15, 20, 50].map(number => (
                  <button type="button" key={number} aria-pressed={parseNumber(value) === number}
                    onClick={() => { setValues(current => ({ ...current, [mode]: String(number) })); markEdited(); }}
                    className={parseNumber(value) === number ? 'selected' : ''}>{number}%</button>
                ))}
              </div>
            )}
          </div>
          <button className="calculate-button" type="submit"><Icon name="calculator" size={19} />
            {inverse ? 'Descobrir preço original' : promotional ? 'Descobrir percentual' : increase ? 'Calcular acréscimo' : 'Calcular desconto'}<Icon name="arrow" size={18} />
          </button>
          <button className="reset-button" type="button" onClick={() => {
            setOriginal(''); setFinalPrice(''); setValues({ discount: '', percentage: '', increase: '', original: '' });
            setTouched({ original: false, value: false }); markEdited(); originalRef.current?.focus();
          }}><Icon name="reset" size={15} />Limpar valores</button>
        </form>
        <div ref={resultRef} tabIndex={-1} className={`result${!result ? ' result-empty' : ''}`} role="region" aria-label="Resultado do cálculo">
          <div className="result-heading"><p className="panel-title">Resumo do cálculo</p><span className="live-badge"><i />{result ? 'Atualizado' : 'Aguardando valores'}</span></div>
          <dl className="result-details">
            <div className={inverse ? 'percentage-result' : ''}><dt>Preço original</dt><dd>{result ? money(result.original) : '—'}</dd></div>
            <div className={promotional ? 'percentage-result' : ''}><dt>{increase ? 'Acréscimo aplicado' : 'Desconto aplicado'}</dt><dd>{result ? `${percent(result.rate)}%` : '—'}</dd></div>
          </dl>
          <div className="final-price"><span>Preço final</span><strong className={result && money(result.final).length > 15 ? 'long-price' : ''}>{result ? money(result.final) : 'R$ —'}</strong>
            {result ? <div className="saving"><Icon name={increase ? 'plus' : 'tag'} size={17} /><span>{increase ? 'Valor acrescentado' : 'Você economiza'} <b>{money(result.amount)}</b></span></div>
              : <p className="empty-help">{showOriginalError || showValueError ? 'Revise os valores indicados para continuar.' : 'Preencha os campos para ver o preço final.'}</p>}
          </div>
          <p className="result-note">{result ? 'O resultado acompanha as alterações nos valores.' : 'O resultado será atualizado automaticamente.'}</p>
          <button type="button" className="copy-button" disabled={!result} onClick={copy}><Icon name={copied === 'Resultado copiado' ? 'check' : 'copy'} size={16} />{copied === 'Resultado copiado' ? copied : 'Copiar resultado'}</button>
          <button type="button" className="copy-button share-button" disabled={!result} onClick={share}><Icon name="share" size={16} />Compartilhar resultado</button>
          <p className="share-feedback" role="status">{shareMessage}</p>
          <span className="copy-feedback" role="status">{copied && copied !== 'Resultado copiado' ? copied : <span className="sr-only">{copied}</span>}</span>
        </div>
      </div>
      <p className="sr-only" role="status" aria-atomic="true">{announcement}</p>
      <div className="calculator-bottom"><Icon name="shield" size={16} /><span>Os valores ficam apenas no seu navegador.</span></div>
    </section>
    <noscript><p className="noscript-note">Ative o JavaScript para calcular automaticamente. As fórmulas e os exemplos abaixo continuam disponíveis.</p></noscript>
    <section className="quick-examples" aria-labelledby="quick-examples-title">
      <h2 id="quick-examples-title">Exemplos rápidos</h2>
      <p>Selecione um exemplo para preencher a calculadora.</p>
      <div className="example-buttons">{[[100, 10], [500, 20], [1000, 30], [250, 50]].map(([price, rate]) => (
        <button type="button" key={price} onClick={() => {
          setMode('discount'); setOriginal(String(price));
          setValues(current => ({ ...current, discount: String(rate) }));
          setTouched({ original: false, value: false }); markEdited();
          requestAnimationFrame(() => resultRef.current?.focus());
        }}><span>{rate}% de {money(price)}</span><strong>→ {money(calculate(price, rate, 'discount').final)}</strong></button>
      ))}</div>
    </section>
    </>
  );
}
