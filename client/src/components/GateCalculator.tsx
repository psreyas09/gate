import React, { useState, useEffect, useCallback } from 'react';
import { Calculator as CalcIcon, X, Minus, Copy, Check, CornerDownLeft } from 'lucide-react';

interface GateCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertValue?: (val: string) => void;
}

function cleanMathEvaluate(expr: string): number {
  let cleaned = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/mod/g, '%')
    .replace(/π/g, `(${Math.PI})`)
    .replace(/\^/g, '**');

  // Strip trailing incomplete operators if any
  cleaned = cleaned.trim().replace(/[\+\-\*\/%^]+$/, '').trim();
  if (!cleaned) throw new Error('Empty expression');

  // Auto-balance open parentheses
  const openCount = (cleaned.match(/\(/g) || []).length;
  const closeCount = (cleaned.match(/\)/g) || []).length;
  if (openCount > closeCount) {
    cleaned += ')'.repeat(openCount - closeCount);
  }

  // Ensure safe expression characters
  if (!/^[0-9+\-*/%.() eE]+$/.test(cleaned)) {
    throw new Error('Invalid characters in calculation');
  }

  // Safe evaluation
  // eslint-disable-next-line no-new-func
  const fn = new Function(`'use strict'; return (${cleaned});`);
  const val = fn();
  if (typeof val !== 'number' || !isFinite(val) || isNaN(val)) {
    throw new Error('Calculation result is invalid');
  }
  return val;
}

function formatResult(val: number): string {
  if (Math.abs(val) < 1e-12) return '0';
  if (Number.isInteger(val) && Math.abs(val) < 1e14) return String(val);
  const prec = parseFloat(val.toPrecision(10));
  return String(prec);
}

export const GateCalculator: React.FC<GateCalculatorProps> = ({
  isOpen,
  onClose,
  onInsertValue,
}) => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState(0);
  const [isRad, setIsRad] = useState(true);
  const [isInv, setIsInv] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDigit = useCallback((d: string) => {
    setDisplay((prev) => {
      if (waitingForOperand || prev === '0' || prev === 'Error') {
        return d;
      }
      return prev + d;
    });
    setWaitingForOperand(false);
  }, [waitingForOperand]);

  const handleDecimal = useCallback(() => {
    setDisplay((prev) => {
      if (waitingForOperand || prev === 'Error') {
        return '0.';
      }
      if (!prev.includes('.')) {
        return prev + '.';
      }
      return prev;
    });
    setWaitingForOperand(false);
  }, [waitingForOperand]);

  const handleClear = useCallback(() => {
    setDisplay('0');
    setExpression('');
    setWaitingForOperand(false);
  }, []);

  const handleClearEntry = useCallback(() => {
    setDisplay('0');
    setWaitingForOperand(false);
  }, []);

  const handleBackspace = useCallback(() => {
    setDisplay((prev) => {
      if (waitingForOperand || prev === 'Error') {
        return '0';
      }
      if (prev.length > 1) {
        const sliced = prev.slice(0, -1);
        return sliced === '-' ? '0' : sliced;
      }
      return '0';
    });
  }, [waitingForOperand]);

  const handleToggleSign = useCallback(() => {
    setDisplay((prev) => {
      if (prev === '0' || prev === 'Error') return prev;
      return prev.startsWith('-') ? prev.substring(1) : '-' + prev;
    });
  }, []);

  const handleOperator = useCallback((op: string) => {
    if (display === 'Error') return;

    setExpression((prevExpr) => {
      const trimmed = prevExpr.trim();
      // If waiting for operand and previous expression ends with an operator, replace it
      if (waitingForOperand && /[\+\-\*\/%^]$/.test(trimmed)) {
        return trimmed.slice(0, -1) + `${op} `;
      }
      if (trimmed.endsWith(')')) {
        return `${trimmed} ${op} `;
      }
      return `${trimmed} ${display} ${op} `.trimStart();
    });

    setWaitingForOperand(true);
  }, [display, waitingForOperand]);

  const handleParenthesis = useCallback((p: '(' | ')') => {
    if (p === '(') {
      setExpression((prev) => {
        const trimmed = prev.trim();
        if (waitingForOperand || !trimmed) {
          return `${trimmed} ( `.trimStart();
        }
        return `${trimmed} ${display} * ( `.trimStart();
      });
      setDisplay('0');
      setWaitingForOperand(true);
    } else {
      // Closing parenthesis
      setExpression((prev) => {
        const trimmed = prev.trim();
        const openCount = (trimmed.match(/\(/g) || []).length;
        const closeCount = (trimmed.match(/\)/g) || []).length;
        if (openCount <= closeCount) return prev; // No open parenthesis to close

        if (waitingForOperand && trimmed.endsWith(')')) {
          return `${trimmed} ) `;
        }
        return `${trimmed} ${display} ) `;
      });
      setWaitingForOperand(true);
    }
  }, [display, waitingForOperand]);

  const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n) || n > 170) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  };

  const handleScientific = useCallback((fn: string) => {
    const val = parseFloat(display);
    if (isNaN(val)) return;

    let res = 0;
    const toAngle = (x: number) => (isRad ? x : (x * Math.PI) / 180);
    const fromAngle = (x: number) => (isRad ? x : (x * 180) / Math.PI);

    switch (fn) {
      case 'sin':
        if (isInv) {
          if (val < -1 || val > 1) { res = NaN; break; }
          res = fromAngle(Math.asin(val));
        } else {
          res = Math.abs(toAngle(val) % Math.PI) < 1e-12 ? 0 : Math.sin(toAngle(val));
        }
        break;
      case 'cos':
        if (isInv) {
          if (val < -1 || val > 1) { res = NaN; break; }
          res = fromAngle(Math.acos(val));
        } else {
          res = Math.abs((toAngle(val) - Math.PI / 2) % Math.PI) < 1e-12 ? 0 : Math.cos(toAngle(val));
        }
        break;
      case 'tan':
        if (isInv) {
          res = fromAngle(Math.atan(val));
        } else {
          // Check for 90, 270 deg
          if (!isRad && Math.abs((val - 90) % 180) < 1e-6) {
            res = NaN;
          } else {
            res = Math.tan(toAngle(val));
          }
        }
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
        res = val > 0 ? Math.log(val) : NaN;
        break;
      case 'log':
        res = val > 0 ? Math.log10(val) : NaN;
        break;
      case 'sqrt':
        res = val >= 0 ? Math.sqrt(val) : NaN;
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
      setDisplay(formatResult(res));
    }
    setWaitingForOperand(true);
  }, [display, isRad, isInv]);

  const handleEquals = useCallback(() => {
    if (display === 'Error') return;

    let fullExpr = '';
    const trimmed = expression.trim();

    if (!trimmed) {
      // Nothing in expression, keep display
      return;
    }

    if (trimmed.endsWith(')')) {
      fullExpr = waitingForOperand ? trimmed : `${trimmed} * ${display}`;
    } else if (waitingForOperand) {
      // Trailing operator e.g. "5 +" -> evaluate with current display
      fullExpr = `${trimmed} ${display}`;
    } else {
      fullExpr = `${trimmed} ${display}`;
    }

    try {
      const result = cleanMathEvaluate(fullExpr);
      setDisplay(formatResult(result));
      setExpression(`${fullExpr} =`);
      setWaitingForOperand(true);
    } catch {
      setDisplay('Error');
      setWaitingForOperand(true);
    }
  }, [display, expression, waitingForOperand]);

  const handleMemory = useCallback((op: 'MC' | 'MR' | 'MS' | 'M+' | 'M-') => {
    const val = parseFloat(display) || 0;

    switch (op) {
      case 'MC':
        setMemory(0);
        break;
      case 'MR':
        setDisplay(formatResult(memory));
        setWaitingForOperand(true);
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
  }, [display, memory]);

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

  // Keyboard shortcut listener for seamless PC/desktop interaction
  useEffect(() => {
    if (!isOpen || isMinimized) return;

    const onKeyDown = (e: KeyboardEvent) => {
      // If typing inside an input or textarea outside calculator, do not intercept
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') && !target.closest('#gate-virtual-calc')) {
        return;
      }

      const key = e.key;

      if (/^[0-9]$/.test(key)) {
        e.preventDefault();
        handleDigit(key);
      } else if (key === '.') {
        e.preventDefault();
        handleDecimal();
      } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        e.preventDefault();
        handleOperator(key);
      } else if (key === '%') {
        e.preventDefault();
        handleOperator('mod');
      } else if (key === '(' || key === ')') {
        e.preventDefault();
        handleParenthesis(key);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (key === 'Escape') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, isMinimized, handleDigit, handleDecimal, handleOperator, handleParenthesis, handleEquals, handleBackspace, handleClear]);

  if (!isOpen) return null;

  return (
    <div
      id="gate-virtual-calc"
      className="fixed bottom-4 right-4 z-50 shadow-2xl rounded-2xl border border-cyan-500/40 bg-slate-900/98 text-slate-100 font-mono w-[340px] xs:w-[380px] overflow-hidden backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-200"
    >
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
                  type="button"
                  onClick={() => setIsRad(true)}
                  className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                    isRad ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  RAD
                </button>
                <button
                  type="button"
                  onClick={() => setIsRad(false)}
                  className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                    !isRad ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  DEG
                </button>
                <button
                  type="button"
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
                  type="button"
                  onClick={copyResult}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                  title="Copy value"
                >
                  {copied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                {onInsertValue && (
                  <button
                    type="button"
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
            <button type="button" onClick={() => handleMemory('MC')} className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 font-semibold">MC</button>
            <button type="button" onClick={() => handleMemory('MR')} className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 font-semibold">MR</button>
            <button type="button" onClick={() => handleMemory('MS')} className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 font-semibold">MS</button>
            <button type="button" onClick={() => handleMemory('M+')} className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 font-semibold">M+</button>
            <button type="button" onClick={() => handleMemory('M-')} className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 font-semibold">M-</button>
            <button type="button" onClick={handleBackspace} className="p-1.5 rounded bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 font-bold">⌫</button>

            {/* Row 1 */}
            <button type="button" onClick={() => handleScientific('sin')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-cyan-300">{isInv ? 'asin' : 'sin'}</button>
            <button type="button" onClick={() => handleScientific('cos')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-cyan-300">{isInv ? 'acos' : 'cos'}</button>
            <button type="button" onClick={() => handleScientific('tan')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-cyan-300">{isInv ? 'atan' : 'tan'}</button>
            <button type="button" onClick={handleClearEntry} className="p-1.5 rounded bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/40 text-amber-300 font-bold">CE</button>
            <button type="button" onClick={handleClear} className="p-1.5 rounded bg-rose-950/50 hover:bg-rose-900/70 border border-rose-800/50 text-rose-300 font-bold">C</button>
            <button type="button" onClick={handleToggleSign} className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold">±</button>

            {/* Row 2 */}
            <button type="button" onClick={() => handleScientific('ln')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-cyan-300">ln</button>
            <button type="button" onClick={() => handleScientific('log')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-cyan-300">log</button>
            <button type="button" onClick={() => handleScientific('sqrt')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-cyan-300">√</button>
            <button type="button" onClick={() => handleDigit('7')} className="p-2 rounded bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs">7</button>
            <button type="button" onClick={() => handleDigit('8')} className="p-2 rounded bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs">8</button>
            <button type="button" onClick={() => handleDigit('9')} className="p-2 rounded bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs">9</button>

            {/* Row 3 */}
            <button type="button" onClick={() => handleScientific('exp')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-cyan-300">eˣ</button>
            <button type="button" onClick={() => handleScientific('10^x')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-cyan-300">10ˣ</button>
            <button type="button" onClick={() => handleOperator('^')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-cyan-300">xʸ</button>
            <button type="button" onClick={() => handleDigit('4')} className="p-2 rounded bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs">4</button>
            <button type="button" onClick={() => handleDigit('5')} className="p-2 rounded bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs">5</button>
            <button type="button" onClick={() => handleDigit('6')} className="p-2 rounded bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs">6</button>

            {/* Row 4 */}
            <button type="button" onClick={() => handleScientific('sqr')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-cyan-300">x²</button>
            <button type="button" onClick={() => handleScientific('inv')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-cyan-300">1/x</button>
            <button type="button" onClick={() => handleScientific('fact')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-cyan-300">n!</button>
            <button type="button" onClick={() => handleDigit('1')} className="p-2 rounded bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs">1</button>
            <button type="button" onClick={() => handleDigit('2')} className="p-2 rounded bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs">2</button>
            <button type="button" onClick={() => handleDigit('3')} className="p-2 rounded bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs">3</button>

            {/* Row 5 */}
            <button type="button" onClick={() => handleScientific('pi')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-indigo-300">π</button>
            <button type="button" onClick={() => handleScientific('e')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-indigo-300">e</button>
            <button type="button" onClick={() => handleOperator('mod')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-indigo-300">mod</button>
            <button type="button" onClick={() => handleDigit('0')} className="p-2 rounded bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs">0</button>
            <button type="button" onClick={handleDecimal} className="p-2 rounded bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs">.</button>
            <button type="button" onClick={() => handleOperator('/')} className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold">÷</button>

            {/* Row 6: Operator controls & Equals */}
            <button type="button" onClick={() => handleParenthesis('(')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-slate-300">(</button>
            <button type="button" onClick={() => handleParenthesis(')')} className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-slate-300">)</button>
            <button type="button" onClick={() => handleOperator('*')} className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold">×</button>
            <button type="button" onClick={() => handleOperator('-')} className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold">−</button>
            <button type="button" onClick={() => handleOperator('+')} className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold">+</button>
            <button type="button" onClick={handleEquals} className="p-2 rounded bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm shadow-md shadow-cyan-900/40">=</button>
          </div>
        </div>
      )}
    </div>
  );
};
