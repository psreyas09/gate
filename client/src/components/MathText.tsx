import React from 'react';
import katex from 'katex';

interface MathTextProps {
  text: string;
  className?: string;
}

export const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // 1. Tokenize Math to prevent markdown from mangling LaTeX underscores and asterisks
  const mathTokens: { token: string; html: string; isBlock: boolean }[] = [];
  let tokenCounter = 0;

  // Replace block math $$...$$
  let processed = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
    const token = `__MATH_BLOCK_${tokenCounter++}__`;
    try {
      const html = katex.renderToString(math.trim(), { displayMode: true, throwOnError: false });
      mathTokens.push({ token, html, isBlock: true });
    } catch {
      mathTokens.push({ token, html: `<pre class="text-amber-400 font-mono text-xs">${math}</pre>`, isBlock: true });
    }
    return token;
  });

  // Replace inline math $...$
  processed = processed.replace(/\$([^$\n]+?)\$/g, (_, math) => {
    const token = `__MATH_INLINE_${tokenCounter++}__`;
    try {
      const html = katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
      mathTokens.push({ token, html, isBlock: false });
    } catch {
      mathTokens.push({ token, html: `<code class="text-amber-400 font-mono text-xs">${math}</code>`, isBlock: false });
    }
    return token;
  });

  // Function to format inline markdown (bold, italic, code) on a string
  const formatInline = (str: string): string => {
    // Code: `code`
    str = str.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-xs border border-slate-700/60">$1</code>');
    // Bold: **text**
    str = str.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-slate-100">$1</strong>');
    // Italic: *text* (excluding already formatted tags)
    str = str.replace(/(^|[^\*])\*([^\*]+)\*([^\*]|$)/g, '$1<em class="italic text-slate-300">$2</em>$3');
    return str;
  };

  // Re-insert math tokens into HTML string
  const restoreMath = (htmlStr: string): string => {
    mathTokens.forEach(({ token, html, isBlock }) => {
      if (isBlock) {
        htmlStr = htmlStr.replace(
          token,
          `<div class="my-3 overflow-x-auto py-1 text-center">${html}</div>`
        );
      } else {
        htmlStr = htmlStr.replace(
          token,
          `<span class="inline-math px-0.5">${html}</span>`
        );
      }
    });
    return htmlStr;
  };

  // 2. Parse block elements (tables, headers, lists, paragraphs)
  const blocks = processed.split(/\n\n+/);

  return (
    <div className={`space-y-3 leading-relaxed text-slate-300 ${className}`}>
      {blocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Check Table: lines with '|'
        const lines = trimmed.split('\n');
        if (lines.length >= 2 && lines[0].includes('|') && lines[1].includes('|') && lines[1].includes('-')) {
          const headerCols = lines[0].split('|').filter(c => c.trim().length > 0).map(c => c.trim());
          const rowLines = lines.slice(2);

          return (
            <div key={bIdx} className="overflow-x-auto my-4 rounded-xl border border-slate-800 bg-slate-900/60 shadow-inner">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/50 text-slate-200">
                    {headerCols.map((col, cIdx) => (
                      <th
                        key={cIdx}
                        className="py-2.5 px-3 font-semibold text-cyan-300"
                        dangerouslySetInnerHTML={{ __html: restoreMath(formatInline(col)) }}
                      />
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {rowLines.map((row, rIdx) => {
                    const cols = row.split('|').filter(c => c.trim().length > 0).map(c => c.trim());
                    if (cols.length === 0) return null;
                    return (
                      <tr key={rIdx} className="hover:bg-slate-800/30 transition-colors">
                        {cols.map((col, cIdx) => (
                          <td
                            key={cIdx}
                            className="py-2 px-3 text-slate-300"
                            dangerouslySetInnerHTML={{ __html: restoreMath(formatInline(col)) }}
                          />
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }

        // Headers: ### or ####
        if (trimmed.startsWith('### ')) {
          const content = trimmed.replace(/^###\s+/, '');
          return (
            <h3
              key={bIdx}
              className="text-base sm:text-lg font-bold text-white mt-4 mb-2 flex items-center gap-2 border-b border-slate-800 pb-1"
              dangerouslySetInnerHTML={{ __html: restoreMath(formatInline(content)) }}
            />
          );
        }

        if (trimmed.startsWith('#### ')) {
          const content = trimmed.replace(/^####\s+/, '');
          return (
            <h4
              key={bIdx}
              className="text-sm sm:text-md font-semibold text-cyan-300 mt-3 mb-1"
              dangerouslySetInnerHTML={{ __html: restoreMath(formatInline(content)) }}
            />
          );
        }

        // Bullet lists or numbered lists
        const isList = lines.every(l => l.trim().startsWith('- ') || l.trim().startsWith('* ') || /^\d+\.\s/.test(l.trim()));
        if (isList) {
          const isOrdered = /^\d+\.\s/.test(lines[0].trim());
          const ListTag = isOrdered ? 'ol' : 'ul';

          return (
            <ListTag
              key={bIdx}
              className={`my-2 space-y-1.5 text-xs sm:text-sm pl-5 ${isOrdered ? 'list-decimal' : 'list-disc'}`}
            >
              {lines.map((l, lIdx) => {
                const clean = l.replace(/^[-*]\s+|\d+\.\s+/, '');
                return (
                  <li
                    key={lIdx}
                    className="text-slate-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: restoreMath(formatInline(clean)) }}
                  />
                );
              })}
            </ListTag>
          );
        }

        // Standard paragraph (with possible line breaks)
        const formatted = restoreMath(formatInline(trimmed.replace(/\n/g, '<br/>')));
        return (
          <p
            key={bIdx}
            className="leading-relaxed text-slate-300 text-xs sm:text-sm"
            dangerouslySetInnerHTML={{ __html: formatted }}
          />
        );
      })}
    </div>
  );
};
