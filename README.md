# KoinX - Crypto Tax Loss Harvesting Dashboard

A highly responsive, premium, and fully functional **Tax Loss Harvesting Dashboard** built using **Next.js (App Router)** and **Tailwind CSS v4**. This tool mirrors the KoinX Figma design, provides real-time offset math, features interactive dark/light modes, and runs fully on a robust server-client architecture.

---

## 🚀 Live Demo & Key Highlights

- **Dynamic Tax Offset Math**: Simulates real-time set-off calculations matching standard capital gain guidelines when selecting/deselecting holdings.
- **Double Theme Integration**: Premium toggling system for light and dark modes, utilizing CSS-variable styling with glassmorphism and subtle animations.
- **Mobile First & Responsive**: Seamlessly stacks dashboard cards and scales table fields on smaller devices.
- **Search & Advanced Sort**: Search assets instantly by name or code. Initial sort places assets with harvestable losses at the top of the table.
- **"View All" Footer Folding**: Gracefully folds the table to show a compact view by default and expands smoothly.
- **"How It Works?" Overlay Guide**: Includes an interactive modal explaining tax-loss harvesting rules, set-off methodologies, and tax rates.
- **Warning-Free Compilation**: Completely warning-free, highly optimized production build output.

---

## 🛠️ Tech Stack & Key Files

- **Core**: Next.js v16 (App Router), React v19, Tailwind CSS v4.
- **API Mocking**: Native Next.js API Route Handlers.
- **Styling**: Vanilla Tailwind CSS v4 with dynamic CSS variables.
- **Key Folders**:
  - `app/api/capital-gains/route.js`: Mock API route serving initial capital gains.
  - `app/api/holdings/route.js`: Mock API route serving holdings.
  - `app/components/ThemeContext.js`: Dark/light mode coordinator.
  - `app/components/Disclaimers.js`: Collapsible accordions with SVGs.
  - `app/components/GainsCard.js`: Reusable glassmorphic gains breakdowns cards.
  - `app/components/HoldingsTable.js`: Holdings manager with search, sort, and select.
  - `app/components/TaxHarvestingDashboard.js`: Main state controller.
  - `app/page.js`: Server Component page that fetches initial mock data.

---

## 📊 Core Business Logic & Assumptions

Under standard tax loss harvesting guidelines:
1. **Short-Term Capital Gains (STCG)**: Assumed tax rate is **15%**. Short-Term Capital Losses (STCL) can offset both STCG and LTCG.
2. **Long-Term Capital Gains (LTCG)**: Assumed tax rate is **10%**. Long-Term Capital Losses (LTCL) can only offset LTCG.
3. **Selling Amounts**: On row selection, the "Amount to Sell" column is automatically populated with the total token holdings of that asset, indicating full liquidation.
4. **Calculations**:
   - `Net Gain = Profits - Losses`
   - `Realised Capital Gains = STCG Net + LTCG Net`
   - `Pre-Harvesting Tax = (max(0, Net STCG) * 15%) + (max(0, Net LTCG) * 10%)`
   - `Post-Harvesting Tax = (max(0, Post Net STCG) * 15%) + (max(0, Post Net LTCG) * 10%)`
   - `Tax Savings = max(0, Pre-Harvesting Tax - Post-Harvesting Tax)`
   *Celebration messages are triggered only if Pre-Harvesting Tax > Post-Harvesting Tax.*

---

## 💻 Local Setup & Development

### 1. Prerequisites
Ensure you have **Node.js v18+** installed.

### 2. Clone and Install Dependencies
Navigate to the root directory and install dependencies:
```bash
npm install
```

### 3. Run Development Server
Start the local Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build and Export for Production
Validate that the code compiles perfectly:
```bash
npm run build
```

---

## 🎨 UI Architecture Details

- **Light Theme**: Renders a sleek slate-50 background, white cards with borders, high-contrast text, and a vibrant blue-indigo After Harvesting card.
- **Dark Theme**: Renders a luxurious deep dark-gray background (`#0B0E14`), dark blue cards (`#111622`), white text headers, and glassmorphic tables.
- **Safe Logo Loading**: Direct `<img>` integration with a standard `DefaultCoin.svg` error handler fallback to prevent broken coingecko image links.
- **Clean Balances**: Truncates floating-point decimal noise and represents scientific notations beautifully (e.g. `< 0.0001 BTC` instead of `3.469e-17`).
