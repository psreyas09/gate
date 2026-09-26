import React, { useState } from 'react';
import { Calculator as CalcIcon, X, Minus, Copy, Check, CornerDownLeft } from 'lucide-react';

interface GateCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertValue?: (val: string) => void;
}

export const GateCalculator: React.FC<GateCalculatorProps> = ({
  isOpen,
  onClose,
  onInsertValue,
}) => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [memory, setMemory] = useState(0);
  const [isRad, setIsRad] = useState(true);
  const [isInv, setIsInv] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [copied, setCopied] = useState(false);
  const [justCalculated, setJustCalculated] = useState(false);

  if (!isOpen) return null;

  const handleDigit = (d: string) => {
    if (justCalculated || display === '0' || display === 'Error') {
      setDisplay(d);
      setJustCalculated(false);
    } else {
      setDisplay(display + d);
    }
  };

  const handleDecimal = () => {
    if (justCalculated) {
      setDisplay('0.');
      setJustCalculated(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
    setJustCalculated(false);
  };

  const handleClearEntry = () => {
    setDisplay('0');
    setJustCalculated(false);
  };

  const handleBackspace = () => {
    if (justCalculated || display === 'Error') {
      setDisplay('0');
      setJustCalculated(false);
      return;
    }
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleToggleSign = () => {
    if (display === '0' || display === 'Error') return;
    if (display.startsWith('-')) {
      setDisplay(display.substring(1));
    } else {
      setDisplay('-' + display);
    }
  };

  const handleOperator = (op: string) => {
    if (display === 'Error') return;
    setExpression((prev) => `${prev} ${display} ${op}`);
    setDisplay('0');
    setJustCalculated(false);
  };

  const handleParenthesis = (p: '(' | ')') => {
    if (p === '(') {
      setExpression((prev) => `${prev} (`);
    } else {
      setExpression((prev) => `${prev} ${display} )`);
      setDisplay('0');
    }
  };

  const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  };

  const handleScientific = (fn: string) => {
    const val = parseFloat(display);
    if (isNaN(val)) return;

    let res = 0;
    const toAngle = (x: number) => (isRad ? x : (x * Math.PI) / 180);
    const fromAngle = (x: number) => (isRad ? x : (x * 180) / Math.PI);

    switch (fn) {
      case 'sin':
        res = isInv ? fromAngle(Math.asin(val)) : Math.sin(toAngle(val));
        break;
      case 'cos':
        res = isInv ? fromAngle(Math.acos(val)) : Math.cos(toAngle(val));
        break;
      case 'tan':
        res = isInv ? fromAngle(Math.atan(val)) : Math.tan(toAngle(val));
        break;
      case 'sinh':
        res = Math.sinh(val);
        break;
      case 'cosh':
        res = Math.cosh(val);
        break;
      case 'tanh':
        res = Math.tanh(val);
        break;
      case 'ln':
        res = Math.log(val);
        break;
      case 'log':
        res = Math.log10(val);
        break;
      case 'sqrt':
        res = Math.sqrt(val);
        break;
      case 'cbrt':
        res = Math.cbrt(val);
        break;
      case 'sqr':
        res = val * val;
        break;
      case 'cube':
        res = val * val * val;
        break;
      case 'inv':
        res = val !== 0 ? 1 / val : NaN;
        break;
      case 'exp':
        res = Math.exp(val);
        break;
      case '10^x':
        res = Math.pow(10, val);
        break;
      case 'fact':
        res = factorial(val);
        break;
      case 'pi':
        res = Math.PI;
        break;
      case 'e':
        res = Math.E;
        break;
      default:
        return;
    }

    if (isNaN(res) || !isFinite(res)) {
      setDisplay('Error');
    } else {
      // Fix floating point issues e.g. sin(pi) ~ 0
      const formatted = Math.abs(res) < 1e-12 ? 0 : parseFloat(res.toFixed(8));
      setDisplay(String(formatted));
    }
    setJustCalculated(true);
  };

  const handleEquals = () => {
    if (display === 'Error') return;
    const fullExpr = `${expression} ${display}`;

    try {
      // Clean safe expression evaluation
      let cleaned = fullExpr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/mod/g, '%')
        .replace(/π/g, `${Math.PI}`)
        .replace(/\^/g, '**');

      // Simple validation for safe math
      if (!/^[0-9+\-*/%.() eE]+$/.test(cleaned)) {
        setDisplay('Error');
        return;
      }

      // eslint-disable-next-line no-new-func
      const result = Function(`'use strict'; return (${cleaned})`)();
      if (isNaN(result) || !isFinite(result)) {
        setDisplay('Error');
      } else {
        const formatted = Math.abs(result) < 1e-12 ? 0 : parseFloat(Number(result).toFixed(8));
        setDisplay(String(formatted));
        setExpression('');
        setJustCalculated(true);
      }
    } catch {
      setDisplay('Error');
    }
  };

  const handleMemory = (op: 'MC' | 'MR' | 'MS' | 'M+' | 'M-') => {
    const val = parseFloat(display);
    if (isNaN(val)) return;

    switch (op) {
      case 'MC':
        setMemory(0);
        break;
      case 'MR':
        setDisplay(String(memory));
        setJustCalculated(true);
        break;
      case 'MS':
        setMemory(val);
        break;
      case 'M+':
        setMemory((prev) => prev + val);
        break;
      case 'M-':
        setMemory((prev) => prev - val);
        break;
    }
  };

  const copyResult = () => {
    if (display !== 'Error') {
      navigator.clipboard.writeText(display);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const insertResult = () => {
    if (display !== 'Error' && onInsertValue) {
      onInsertValue(display);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 shadow-2xl rounded-2xl border border-cyan-500/40 bg-slate-900/98 text-slate-100 font-mono w-[340px] xs:w-[380px] overflow-hidden backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-200">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950/80 border-b border-slate-800 text-xs select-none">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-cyan-500/20 text-cyan-400">
            <CalcIcon className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-200 tracking-wide text-[11px]">
            GATE TCS-iON Calculator
          </span>
          {memory !== 0 && (
            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
              M
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-3 space-y-2.5">
          {/* LCD Screen Display */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-right space-y-1 shadow-inner">
            <div className="text-[11px] text-slate-500 h-4 truncate">
              {expression || ' '}
            </div>
            <div className="text-2xl font-bold tracking-wider text-cyan-300 overflow-x-auto whitespace-nowrap">
              {display}
            </div>
            {/* Quick Actions under screen */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px]">
              <div className="flex items-center gap-1.5 text-slate-400">
                <button
                  onClick={() => setIsRad(!isRad)}
                  className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                    isRad ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  RAD
                </button>
                <button
                  onClick={() => setIsRad(!isRad)}
                  className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                    !isRad ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  DEG
                </button>
                <button
                  onClick={() => setIsInv(!isInv)}
                  className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                    isInv ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  INV
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={copyResult}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                  title="Copy value"
                >
                  {copied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                {onInsertValue && (
                  <button
                    onClick={insertResult}
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                    title="Insert directly into NAT answer"
                  >
                    <CornerDownLeft className="w-2.5 h-2.5" />
                    <span>Insert</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-6 gap-1 text-[11px] select-none">
            {/* Memory Row */}
            <button onClick={() => handleMemory('MC')} className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 font-semibold">MC</button>
            <button onClick={() => handleMemory('MR')} className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 font-semibold">MR</button>
            <button onClick={() => handleMemory('MS')} className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 font-semibold">MS</button>
            <button onClick={() => handleMemory('M+')} className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 font-semibold">M+</button>
            <button onClick={() => handleMemory('M-')} className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 font-semibold">M-</button>
            <button onClick={handleBackspace} className="p-1.5 rounded bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 font-bold">⌫</button>

            {/* Row 1 */}
            <button onClick={() => handleScientific('sin')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-cyan-300">{isInv ? 'asin' : 'sin'}</button>
            <button onClick={() => handleScientific('cos')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-cyan-300">{isInv ? 'acos' : 'cos'}</button>
            <button onClick={() => handleScientific('tan')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-cyan-300">{isInv ? 'atan' : 'tan'}</button>
            <button onClick={handleClearEntry} className="p-1.5 rounded bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/40 text-amber-300 font-bold">CE</button>
            <button onClick={handleClear} className="p-1.5 rounded bg-rose-950/50 hover:bg-rose-900/70 border border-rose-800/50 text-rose-300 font-bold">C</button>
            <button onClick={handleToggleSign} className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold">±</button>

            {/* Row 2 */}
            <button onClick={() => handleScientific('ln')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-cyan-300">ln</button>
            <button onClick={() => handleScientific('log')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-cyan-300">log</button>
            <button onClick={() => handleScientific('sqrt')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-cyan-300">√</button>
            <button onClick={() => handleDigit('7')} className="p-2 rounded bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs">7</button>
            <button onClick={() => handleDigit('8')} className="p-2 rounded bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs">8</button>
            <button onClick={() => handleDigit('9')} className="p-2 rounded bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs">9</button>

            {/* Row 3 */}
            <button onClick={() => handleScientific('exp')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-cyan-300">eˣ</button>
            <button onClick={() => handleScientific('10^x')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-cyan-300">10ˣ</button>
            <button onClick={() => handleOperator('^')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-cyan-300">xʸ</button>
            <button onClick={() => handleDigit('4')} className="p-2 rounded bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs">4</button>
            <button onClick={() => handleDigit('5')} className="p-2 rounded bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs">5</button>
            <button onClick={() => handleDigit('6')} className="p-2 rounded bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs">6</button>

            {/* Row 4 */}
            <button onClick={() => handleScientific('sqr')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-cyan-300">x²</button>
            <button onClick={() => handleScientific('inv')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-cyan-300">1/x</button>
            <button onClick={() => handleScientific('fact')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-cyan-300">n!</button>
            <button onClick={() => handleDigit('1')} className="p-2 rounded bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs">1</button>
            <button onClick={() => handleDigit('2')} className="p-2 rounded bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs">2</button>
            <button onClick={() => handleDigit('3')} className="p-2 rounded bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs">3</button>

            {/* Row 5 */}
            <button onClick={() => handleScientific('pi')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-indigo-300">π</button>
            <button onClick={() => handleScientific('e')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-indigo-300">e</button>
            <button onClick={() => handleOperator('mod')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-indigo-300">mod</button>
            <button onClick={() => handleDigit('0')} className="p-2 rounded bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs">0</button>
            <button onClick={handleDecimal} className="p-2 rounded bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs">.</button>
            <button onClick={() => handleOperator('/')} className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold">÷</button>

            {/* Row 6: Operator controls & Equals */}
            <button onClick={() => handleParenthesis('(')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-slate-300">(</button>
            <button onClick={() => handleParenthesis(')')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-slate-300">)</button>
            <button onClick={() => handleOperator('*')} className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold">×</button>
            <button onClick={() => handleOperator('-')} className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold">−</button>
            <button onClick={() => handleOperator('+')} className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold">+</button>
            <button onClick={handleEquals} className="p-2 rounded bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm shadow-md shadow-cyan-900/40">=</button>
          </div>
        </div>
      )}
    </div>
  );
};
