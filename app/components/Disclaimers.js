"use client";

import { useState } from "react";

export default function Disclaimers() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div 
      className={`w-full border rounded-xl overflow-hidden smooth-transition glass-panel mb-6 
        ${isOpen 
          ? "border-blue-200 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-950/10" 
          : "border-card-border bg-card dark:border-card-border"
        }`}
    >
      {/* Header section trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/10 focus:outline-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
            Important Notes & Disclaimers
          </span>
        </div>
        
        <svg
          className={`w-5 h-5 text-slate-500 dark:text-slate-400 smooth-transition ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Collapsible Content */}
      <div
        className={`smooth-transition overflow-hidden ${
          isOpen ? "max-h-[500px] border-t border-blue-100 dark:border-blue-900/30" : "max-h-0"
        }`}
      >
        <ul className="px-5 py-4 space-y-3.5 text-xs md:text-sm text-slate-600 dark:text-slate-400 list-disc pl-9 leading-relaxed">
          <li className="marker:text-blue-500">
            Tax-loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax advisor before making any decisions.
          </li>
          <li className="marker:text-blue-500">
            Tax harvesting does not apply to derivatives or futures. These are handled separately as business income under tax rules.
          </li>
          <li className="marker:text-blue-500">
            Price and market value data is fetched from Coingecko, not from individual exchanges. As a result, values may slightly differ from the ones on your exchange.
          </li>
          <li className="marker:text-blue-500">
            Some countries do not have a short-term / long-term bifurcation. For now, we are calculating everything as long-term.
          </li>
          <li className="marker:text-blue-500">
            Only realized losses are considered for harvesting. Unrealized losses in held assets are not counted.
          </li>
        </ul>
      </div>
    </div>
  );
}
