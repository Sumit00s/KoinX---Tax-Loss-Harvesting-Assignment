"use client";

import { useState, useMemo } from "react";
import { useTheme } from "./ThemeContext";
import Disclaimers from "./Disclaimers";
import GainsCard from "./GainsCard";
import HoldingsTable from "./HoldingsTable";

export default function TaxHarvestingDashboard({
  initialCapitalGains = {},
  initialHoldings = [],
}) {
  const { theme, toggleTheme } = useTheme();
  
  // States
  const [selectedIds, setSelectedIds] = useState([]);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  // Pre-harvesting capital gains values
  const preGains = useMemo(() => {
    return initialCapitalGains.capitalGains || {
      stcg: { profits: 0, losses: 0 },
      ltcg: { profits: 0, losses: 0 }
    };
  }, [initialCapitalGains]);

  // Handle single holding selection toggle
  const handleToggleSelect = (coinId) => {
    setSelectedIds((prev) =>
      prev.includes(coinId)
        ? prev.filter((id) => id !== coinId)
        : [...prev, coinId]
    );
  };

  // Handle multi/all selection toggle
  const handleToggleSelectAll = (visibleIds) => {
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      // Remove all visibleIds from selection
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      // Add all visibleIds to selection
      setSelectedIds((prev) => {
        const union = new Set([...prev, ...visibleIds]);
        return Array.from(union);
      });
    }
  };

  // Recalculate Post-harvesting ("After Harvesting") capital gains
  const postGains = useMemo(() => {
    // Start with pre-harvesting values
    const stcg = { ...preGains.stcg };
    const ltcg = { ...preGains.ltcg };

    // Process each selected holding
    selectedIds.forEach((id) => {
      const holding = initialHoldings.find((h) => h.coin === id);
      if (!holding) return;

      // STCG
      const stcgGain = holding.stcg?.gain || 0;
      if (stcgGain > 0) {
        stcg.profits += stcgGain;
      } else if (stcgGain < 0) {
        stcg.losses += Math.abs(stcgGain);
      }

      // LTCG
      const ltcgGain = holding.ltcg?.gain || 0;
      if (ltcgGain > 0) {
        ltcg.profits += ltcgGain;
      } else if (ltcgGain < 0) {
        ltcg.losses += Math.abs(ltcgGain);
      }
    });

    return { stcg, ltcg };
  }, [preGains, selectedIds, initialHoldings]);

  // Tax Savings Calculation Model
  // STCG tax rate = 15%, LTCG tax rate = 10%
  const taxSavings = useMemo(() => {
    const stcgNetPre = preGains.stcg.profits - preGains.stcg.losses;
    const ltcgNetPre = preGains.ltcg.profits - preGains.ltcg.losses;

    const stcgNetPost = postGains.stcg.profits - postGains.stcg.losses;
    const ltcgNetPost = postGains.ltcg.profits - postGains.ltcg.losses;

    // Pre-harvesting tax liability
    const stcgTaxPre = Math.max(0, stcgNetPre) * 0.15;
    const ltcgTaxPre = Math.max(0, ltcgNetPre) * 0.10;
    const totalTaxPre = stcgTaxPre + ltcgTaxPre;

    // Post-harvesting tax liability
    const stcgTaxPost = Math.max(0, stcgNetPost) * 0.15;
    const ltcgTaxPost = Math.max(0, ltcgNetPost) * 0.10;
    const totalTaxPost = stcgTaxPost + ltcgTaxPost;

    // Tax Saved
    return Math.max(0, totalTaxPre - totalTaxPost);
  }, [preGains, postGains]);

  return (
    <div className="min-h-screen pb-20 bg-background text-foreground smooth-transition">
      {/* BRAND NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0B0E14]/80 backdrop-blur-md border-b border-card-border smooth-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Elegant Premium KoinX SVG Logo */}
            <svg
              className="w-24 h-6 text-blue-600 dark:text-blue-500"
              viewBox="0 0 100 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.5 4h3.5v6.5l4-6.5h3.8l-5 7.8 5.5 8.2h-3.8l-4.5-6.8v6.8H4.5V4z"
                fill="currentColor"
              />
              <path
                d="M17.5 13.8c0-3.6 2.5-6 6-6s6 2.4 6 6-2.5 6-6 6-6-2.4-6-6zm8.3 0c0-2.2-1.4-3.5-2.3-3.5s-2.3 1.3-2.3 3.5 1.4 3.5 2.3 3.5 2.3-1.3 2.3-3.5z"
                fill="currentColor"
              />
              <path d="M31.5 8h3.5v12h-3.5V8zm1.8-4c1 0 1.8.8 1.8 1.8s-.8 1.8-1.8 1.8-1.8-.8-1.8-1.8.8-1.8 1.8-1.8z" fill="currentColor" />
              <path
                d="M37.2 8h3.2v1.5c1-1.3 2.2-1.8 3.8-1.8 2.5 0 4 1.5 4 4.2V20h-3.5v-7.2c0-1.4-.6-2-1.8-2s-2.2 1-2.2 2.5V20h-3.5V8z"
                fill="currentColor"
              />
              {/* Premium colored X */}
              <path
                d="M51 4h3.8l3 5 3-5h3.8l-4.8 7.5 5 8.5H61l-3.2-5.5-3.2 5.5h-3.8l5-8.5L51 4z"
                fill="#F59E0B"
              />
              {/* Trademark */}
              <circle cx="70" cy="5" r="1.5" stroke="currentColor" strokeWidth="0.5" fill="none" />
              <text x="69.2" y="6.2" fontSize="1.5" fontFamily="sans-serif" fill="currentColor">R</text>
            </svg>
          </div>

          {/* Theme Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center border border-card-border rounded-xl bg-card hover:bg-slate-100 dark:hover:bg-slate-800 smooth-transition cursor-pointer"
            aria-label="Toggle Dark/Light Mode"
          >
            {theme === "light" ? (
              // Moon Icon
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              // Sun Icon
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* DASHBOARD SHELL CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Title and Help Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            Tax Harvesting
          </h1>
          <button
            onClick={() => setIsHowItWorksOpen(true)}
            className="text-xs md:text-sm font-bold text-koinx-blue hover:text-koinx-blue-hover underline cursor-pointer focus:outline-none"
          >
            How it works?
          </button>
        </div>

        {/* Collapsible disclaimers banner */}
        <Disclaimers />

        {/* CAPITAL GAINS CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <GainsCard
            type="pre"
            title="Pre Harvesting"
            stcg={preGains.stcg}
            ltcg={preGains.ltcg}
            savings={0}
          />
          <GainsCard
            type="post"
            title="After Harvesting"
            stcg={postGains.stcg}
            ltcg={postGains.ltcg}
            savings={taxSavings}
          />
        </div>

        {/* HOLDINGS TABLE COMPONENT */}
        <HoldingsTable
          holdings={initialHoldings}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
        />
      </main>

      {/* HOW IT WORKS MODAL OVERLAY */}
      {isHowItWorksOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-2xl bg-card border border-card-border rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in-up">
            <div className="flex items-center justify-between pb-4 border-b border-card-border">
              <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span className="text-xl">📊</span> Tax Loss Harvesting Guide
              </h3>
              <button
                onClick={() => setIsHowItWorksOpen(false)}
                className="w-8 h-8 rounded-full border border-card-border flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 smooth-transition cursor-pointer"
                aria-label="Close guide modal"
              >
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="py-5 space-y-4 text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-h-[60vh] overflow-y-auto">
              <p>
                <strong>Tax-Loss Harvesting</strong> is a powerful investment strategy used to minimize overall capital gains taxes by selling assets currently sitting at a loss.
              </p>
              
              <div className="p-4 bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/30 rounded-xl space-y-2">
                <h4 className="font-bold text-blue-800 dark:text-blue-300">How the math works:</h4>
                <p>
                  By selling assets that have declined in value, you generate "realized losses" that offset your "realized gains" from other investments. This reduces your overall taxable net capital gains, resulting in massive tax savings!
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Rule Framework Applied in This Tool:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Short-Term Gains/Losses (STCG)</strong>: Subject to standard short-term tax rates (we assume 15%). Short-term losses can set off both short-term and long-term gains.</li>
                  <li><strong>Long-Term Gains/Losses (LTCG)</strong>: Subject to lower long-term tax rates (we assume 10%). Long-term losses can only offset long-term gains.</li>
                  <li><strong>Sell Amount</strong>: When you check a row, the tool automatically calculates the amount to sell to offset the gains, reflecting your entire holding.</li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-card-border flex justify-end">
              <button
                onClick={() => setIsHowItWorksOpen(false)}
                className="px-5 py-2.5 bg-koinx-blue text-white rounded-xl text-xs md:text-sm font-bold hover:bg-koinx-blue-hover smooth-transition cursor-pointer shadow-md shadow-blue-500/10"
              >
                Got it, let's harvest!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
