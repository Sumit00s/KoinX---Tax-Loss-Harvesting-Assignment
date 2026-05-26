"use client";

import { useState, useMemo } from "react";

export default function HoldingsTable({
  holdings = [],
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
}) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("losses"); // "losses" is default to put best harvestable options first!
  const [sortOrder, setSortOrder] = useState("asc"); // asc/desc
  const [isExpanded, setIsExpanded] = useState(false);

  // Formatting helpers
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const formatTokenAmount = (amount, symbol) => {
    if (!amount || amount === 0 || Math.abs(amount) < 1e-8) return `0 ${symbol}`;
    if (Math.abs(amount) < 0.0001) {
      return `< 0.0001 ${symbol}`;
    }
    const formatted = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 5,
      minimumFractionDigits: 2,
    }).format(amount);
    return `${formatted} ${symbol}`;
  };

  const formatGain = (gain) => {
    if (gain === 0 || Math.abs(gain) < 1e-4) return { text: "$0.00", style: "text-slate-500 dark:text-slate-400" };
    
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(gain));

    if (gain > 0) {
      return { text: `+${formatted}`, style: "text-emerald-600 dark:text-emerald-400 font-semibold" };
    } else {
      return { text: `-${formatted}`, style: "text-rose-600 dark:text-rose-400 font-semibold" };
    }
  };

  // Handle image loading error fallback
  const handleLogoError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg";
  };

  // Sorting handlers
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Filter and Sort holdings
  const processedHoldings = useMemo(() => {
    let result = [...holdings];

    // 1. Search Filter
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (h) =>
          h.coin.toLowerCase().includes(query) ||
          h.coinName.toLowerCase().includes(query)
      );
    }

    // 2. Sort Logic
    result.sort((a, b) => {
      let valA, valB;
      
      switch (sortBy) {
        case "coin":
          valA = a.coin.toLowerCase();
          valB = b.coin.toLowerCase();
          break;
        case "value":
          valA = a.totalHolding * a.currentPrice;
          valB = b.totalHolding * b.currentPrice;
          break;
        case "stcg":
          valA = a.stcg?.gain || 0;
          valB = b.stcg?.gain || 0;
          break;
        case "ltcg":
          valA = a.ltcg?.gain || 0;
          valB = b.ltcg?.gain || 0;
          break;
        case "losses":
          // Custom sort: prioritizes assets with the highest total combined losses first
          valA = (a.stcg?.gain || 0) + (a.ltcg?.gain || 0);
          valB = (b.stcg?.gain || 0) + (b.ltcg?.gain || 0);
          break;
        default:
          valA = a.coin;
          valB = b.coin;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [holdings, search, sortBy, sortOrder]);

  // View All / view limited list
  const visibleHoldings = useMemo(() => {
    if (isExpanded || processedHoldings.length <= 5) {
      return processedHoldings;
    }
    return processedHoldings.slice(0, 6);
  }, [processedHoldings, isExpanded]);

  // Check if all visible items are selected
  const isAllSelected = useMemo(() => {
    if (processedHoldings.length === 0) return false;
    return processedHoldings.every((h) => selectedIds.includes(h.coin));
  }, [processedHoldings, selectedIds]);

  const isSomeSelected = useMemo(() => {
    if (processedHoldings.length === 0) return false;
    return (
      processedHoldings.some((h) => selectedIds.includes(h.coin)) &&
      !isAllSelected
    );
  }, [processedHoldings, selectedIds, isAllSelected]);

  return (
    <div className="w-full bg-card border border-card-border rounded-2xl shadow-sm overflow-hidden smooth-transition glass-panel">
      {/* Table Header Section */}
      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-card-border">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            Asset Holdings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sort by losses to easily identify tax harvesting opportunities. Selected assets auto-fill sell quantities.
          </p>
        </div>

        {/* Search and Filter Inputs */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search assets (e.g. BTC, ETH)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs md:text-sm bg-slate-50 dark:bg-slate-900 border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-koinx-blue/50 focus:border-koinx-blue text-slate-800 dark:text-slate-200 smooth-transition"
            />
          </div>

          {/* Quick Clear Button if active search */}
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-xs font-semibold text-slate-500 hover:text-koinx-blue smooth-transition"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Table View */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-xs md:text-sm">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-card-border text-slate-500 dark:text-slate-400 font-semibold select-none">
              {/* Select All Checkbox */}
              <th className="px-5 py-4 w-[60px] text-center">
                <label className="relative flex items-center justify-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isSomeSelected;
                    }}
                    onChange={() => onToggleSelectAll(processedHoldings.map(h => h.coin))}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 peer-checked:bg-koinx-blue peer-checked:border-koinx-blue flex items-center justify-center smooth-transition hover:border-koinx-blue peer-indeterminate:bg-koinx-blue peer-indeterminate:border-koinx-blue">
                    {isAllSelected && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {isSomeSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                      </svg>
                    )}
                  </div>
                </label>
              </th>

              {/* Header: Asset */}
              <th className="px-4 py-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/10 smooth-transition" onClick={() => handleSort("coin")}>
                <div className="flex items-center gap-1.5">
                  <span>Asset</span>
                  {sortBy === "coin" && (sortOrder === "asc" ? "↑" : "↓")}
                </div>
              </th>

              {/* Header: Holdings & Buy Price */}
              <th className="px-4 py-4 font-semibold">
                <div>Holdings</div>
                <div className="text-[10px] text-slate-400 font-normal">Current Market Rate</div>
              </th>

              {/* Header: Total Current Value */}
              <th className="px-4 py-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/10 smooth-transition" onClick={() => handleSort("value")}>
                <div className="flex items-center gap-1.5">
                  <span>Total Current Value</span>
                  {sortBy === "value" && (sortOrder === "asc" ? "↑" : "↓")}
                </div>
              </th>

              {/* Header: Short term */}
              <th className="px-4 py-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/10 smooth-transition" onClick={() => handleSort("stcg")}>
                <div className="flex items-center gap-1.5">
                  <span>Short-term</span>
                  {sortBy === "stcg" && (sortOrder === "asc" ? "↑" : "↓")}
                </div>
              </th>

              {/* Header: Long term */}
              <th className="px-4 py-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/10 smooth-transition" onClick={() => handleSort("ltcg")}>
                <div className="flex items-center gap-1.5">
                  <span>Long-term</span>
                  {sortBy === "ltcg" && (sortOrder === "asc" ? "↑" : "↓")}
                </div>
              </th>

              {/* Header: Amount to Sell */}
              <th className="px-5 py-4 font-semibold text-right">Amount to Sell</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-card-border">
            {visibleHoldings.map((h, idx) => {
              const isSelected = selectedIds.includes(h.coin);
              const totalValue = h.totalHolding * h.currentPrice;
              const stcgGain = formatGain(h.stcg?.gain || 0);
              const ltcgGain = formatGain(h.ltcg?.gain || 0);

              return (
                <tr
                  key={`${h.coin}-${idx}`}
                  onClick={() => onToggleSelect(h.coin)}
                  className={`cursor-pointer smooth-transition hover:bg-slate-50/50 dark:hover:bg-slate-800/10 ${
                    isSelected ? "bg-blue-50/20 dark:bg-blue-900/5" : ""
                  }`}
                >
                  {/* Row Checkbox */}
                  <td className="px-5 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <label className="relative flex items-center justify-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(h.coin)}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 peer-checked:bg-koinx-blue peer-checked:border-koinx-blue flex items-center justify-center smooth-transition hover:border-koinx-blue">
                        {isSelected && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </label>
                  </td>

                  {/* Cell: Asset Logo & Name */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={h.logo}
                        alt={h.coin}
                        onError={handleLogoError}
                        className="w-8 h-8 rounded-full border border-card-border shrink-0 bg-slate-100 dark:bg-slate-800 p-0.5"
                      />
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {h.coin}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">
                          {h.coinName}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Cell: Holdings & Buy Price */}
                  <td className="px-4 py-4 font-semibold text-slate-700 dark:text-slate-300">
                    <div>{formatTokenAmount(h.totalHolding, h.coin)}</div>
                    <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                      {formatCurrency(h.currentPrice)}/{h.coin}
                    </div>
                  </td>

                  {/* Cell: Total Value */}
                  <td className="px-4 py-4 font-bold text-slate-800 dark:text-slate-200">
                    {formatCurrency(totalValue)}
                  </td>

                  {/* Cell: STCG */}
                  <td className="px-4 py-4">
                    <div className={stcgGain.style}>{stcgGain.text}</div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                      {formatTokenAmount(h.stcg?.balance || 0, h.coin)}
                    </div>
                  </td>

                  {/* Cell: LTCG */}
                  <td className="px-4 py-4">
                    <div className={ltcgGain.style}>{ltcgGain.text}</div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                      {formatTokenAmount(h.ltcg?.balance || 0, h.coin)}
                    </div>
                  </td>

                  {/* Cell: Amount to Sell */}
                  <td className="px-5 py-4 text-right font-bold text-slate-700 dark:text-slate-300">
                    {isSelected ? (
                      <span className="bg-blue-100/60 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded text-xs">
                        {formatTokenAmount(h.totalHolding, h.coin)}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                </tr>
              );
            })}

            {visibleHoldings.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-slate-400 font-medium">
                  No assets found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Accordion Expand Footer Control */}
      {processedHoldings.length > 6 && (
        <div className="p-4 border-t border-card-border bg-slate-50/20 dark:bg-slate-900/10 flex items-center justify-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-xs font-bold text-koinx-blue hover:text-koinx-blue-hover smooth-transition focus:outline-none cursor-pointer"
          >
            <span>{isExpanded ? "View Less" : `View All (${processedHoldings.length})`}</span>
            <svg
              className={`w-4 h-4 smooth-transition ${isExpanded ? "transform rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
