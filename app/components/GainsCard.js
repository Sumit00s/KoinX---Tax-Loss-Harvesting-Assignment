"use client";

export default function GainsCard({
  type = "pre", // "pre" or "post"
  title,
  stcg = { profits: 0, losses: 0 },
  ltcg = { profits: 0, losses: 0 },
  savings = 0,
}) {
  const isPre = type === "pre";
  
  // Calculate gains
  const stcgNet = stcg.profits - stcg.losses;
  const ltcgNet = ltcg.profits - ltcg.losses;
  const totalRealised = stcgNet + ltcgNet;

  // Format currency helpers
  const formatValue = (val) => {
    const isNeg = val < 0;
    const absVal = Math.abs(val);
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(absVal);
    
    return isNeg ? `- ${formatted}` : formatted;
  };

  const formatNetValue = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div
      className={`w-full rounded-2xl p-6 md:p-8 flex flex-col justify-between smooth-transition border shadow-lg ${
        isPre
          ? "bg-slate-900 border-slate-800 text-slate-100 dark:bg-[#111622] dark:border-[#1E2638]"
          : "bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500 text-white dark:from-blue-700 dark:to-blue-800"
      }`}
    >
      <div>
        {/* Title Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <h3 className="text-lg md:text-xl font-bold tracking-tight">
            {title}
          </h3>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium tracking-wide uppercase ${
              isPre
                ? "bg-slate-800 text-slate-300 dark:bg-[#1E2638] dark:text-slate-200"
                : "bg-white/20 text-white"
            }`}
          >
            {isPre ? "Current" : "Simulated"}
          </span>
        </div>

        {/* Short Term & Long Term breakdown table */}
        <div className="grid grid-cols-3 gap-y-4 py-6 text-sm font-medium">
          {/* Columns */}
          <div className="text-xs text-white/50 dark:text-slate-400"></div>
          <div className="text-right text-xs text-white/50 dark:text-slate-400 uppercase tracking-wider font-semibold">
            Short-term
          </div>
          <div className="text-right text-xs text-white/50 dark:text-slate-400 uppercase tracking-wider font-semibold">
            Long-term
          </div>

          {/* Row 1: Profits */}
          <div className={`${isPre ? "text-slate-400" : "text-white/80"}`}>
            Profits
          </div>
          <div className="text-right font-semibold">
            {formatValue(stcg.profits)}
          </div>
          <div className="text-right font-semibold">
            {formatValue(ltcg.profits)}
          </div>

          {/* Row 2: Losses */}
          <div className={`${isPre ? "text-slate-400" : "text-white/80"}`}>
            Losses
          </div>
          <div className="text-right font-semibold text-rose-400 dark:text-rose-400">
            {stcg.losses > 0 ? `- ${formatNetValue(stcg.losses)}` : "$0"}
          </div>
          <div className="text-right font-semibold text-rose-400 dark:text-rose-400">
            {ltcg.losses > 0 ? `- ${formatNetValue(ltcg.losses)}` : "$0"}
          </div>

          {/* Row 3: Net Capital Gains */}
          <div className={`${isPre ? "text-slate-400" : "text-white/80"}`}>
            Net Capital Gains
          </div>
          <div className={`text-right font-bold ${stcgNet >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {formatNetValue(stcgNet)}
          </div>
          <div className={`text-right font-bold ${ltcgNet >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {formatNetValue(ltcgNet)}
          </div>
        </div>
      </div>

      {/* Bottom Summary & Tax Savings Info */}
      <div className="mt-4 pt-6 border-t border-white/10 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className={`text-sm ${isPre ? "text-slate-400" : "text-white/80"} font-medium`}>
            {isPre ? "Realised Capital Gains" : "Effective Capital Gains"}
          </span>
          <span className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {formatNetValue(totalRealised)}
          </span>
        </div>

        {/* Celebration savings alert box */}
        {!isPre && savings > 0 && (
          <div className="w-full bg-white/15 backdrop-blur-md rounded-xl p-3 flex items-center gap-3 border border-white/10 glow-savings smooth-transition">
            <span className="text-xl shrink-0" role="img" aria-label="party popper">
              🥳
            </span>
            <div className="text-xs font-semibold leading-snug">
              <div>You are going to save up to</div>
              <div className="text-sm font-extrabold text-yellow-300">
                {formatNetValue(savings)} in taxes!
              </div>
            </div>
          </div>
        )}
        
        {/* Mirror indicator when post-harvest gains are identical to pre-harvest */}
        {!isPre && savings <= 0 && (
          <div className="w-full bg-white/5 rounded-xl p-3 text-center text-xs font-medium text-white/60">
            Select holdings below to harvest losses & save on taxes!
          </div>
        )}
      </div>
    </div>
  );
}
