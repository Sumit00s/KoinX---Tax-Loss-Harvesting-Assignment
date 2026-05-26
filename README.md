# KoinX - Crypto Tax Loss Harvesting Dashboard 🚀

A highly responsive, premium, and fully functional **Tax Loss Harvesting Dashboard** built using **Next.js 16 (App Router)** and **Tailwind CSS v4**. This tool perfectly mirrors the KoinX Figma specifications, handles complex capital gains offset rules in real-time, features seamless Dark/Light theme toggling, and compiles completely warning-free.

### 🌐 Live Production URL: [https://koinx-harversting.vercel.app](https://koinx-harversting.vercel.app)

---

## ⚡ Key Highlights & Premium Features

- **Dynamic Tax Offset Math**: Simulates real-time set-off calculations matching standard capital gain guidelines when selecting/deselecting assets.
- **Advanced Dual-Theme Integration**: Premium toggling system for Light and Dark modes. Features customized CSS variable overrides, sleek glassmorphism panels, and elegant transitions.
- **recruiter-focused Testing Guide**: Embedded within the README and an interactive `"How it works?"` modal in the UI.
- **Smart Scientific Balance Truncation**: Elegant parsing of floating-point fractions to prevent ugly raw exponential strings (e.g. displaying `< 0.0001 BTC` instead of `3.469446951953614e-17`).
- **Initial Sort by Harvesting Priority**: The holdings list is sorted initially by highest losses first to immediately put the most valuable tax-offsetting options at the very top of the table.
- **"View All" Footer folding**: Table limits visible items to 6 by default and folds out smoothly with a custom CSS transition to keep the main viewport uncluttered.
- **Fail-Safe Image CDNs**: External coingecko asset icons are wrapped in a safe `<img>` load handler that automatically swaps in a custom `DefaultCoin.svg` in case of external network outages.

---

## 📊 Tax Offset Math & Assumptions

To calculate realistic, valuable tax savings, this dashboard implements standard capital gains rules:
1. **Short-Term Capital Gains (STCG)**: Taxed at a standard rate of **15%**. Short-Term Capital Losses (STCL) can set off both short-term and long-term gains.
2. **Long-Term Capital Gains (LTCG)**: Taxed at a standard rate of **10%**. Long-Term Capital Losses (LTCL) can *only* offset long-term gains.
3. **Liquidation**: Upon row selection, the "Amount to Sell" column is populated automatically with the total holdings of that asset, indicating full liquidation to harvest maximum losses.
4. **Savings Formulas**:
   - `Net Gain = Profits - Losses`
   - `Realised Capital Gains = STCG Net + LTCG Net`
   - `Pre-Harvesting Tax = (max(0, Net STCG) * 15%) + (max(0, Net LTCG) * 10%)`
   - `Post-Harvesting Tax = (max(0, Post Net STCG) * 15%) + (max(0, Post Net LTCG) * 10%)`
   - `Tax Savings = max(0, Pre-Harvesting Tax - Post-Harvesting Tax)`
   *A pulsing celebratory party-popper badge (`🥳 You are going to save up to $X in taxes!`) triggers automatically if Pre-Harvesting Tax > Post-Harvesting Tax.*

---

## 🎨 Walkthrough: How to Test the Live Dashboard

Recruiters and evaluators can verify the robust engineering of the dashboard by running these simple visual tests on the [Live Site](https://koinx-harversting.vercel.app):

1. **Light / Dark Mode Swapping**: Click the **Sun/Moon toggle** in the top-right of the header. Watch the page transition seamlessly between a clean, high-contrast Slate light theme and a gorgeous deep midnight-blue `#0B0E14` dark theme.
2. **Loss Harvesting Verification**:
   - **SOL**: Select `SOL` (which has a simulated loss of `-$1,200` STCG and `-$3,000` LTCG). Watch the **After Harvesting card (Blue)** update its profits/losses, the Effective Gains drop, and a gold **glowing celebration badge** slide in declaring a tax savings of **`$480.00`** (`1,200 * 15% + 3,000 * 10%`)!
   - **MATIC**: Select `MATIC` (which has a simulated loss of `-$800` STCG). Watch the card update to show exact tax savings of **`$120.00`** (`800 * 15%`)!
   - **EZ**: Select `EZ` (which has a very tiny loss of `-$0.003`). Because the savings are less than half a cent, it mathematically rounds to **`$0`**, showing a correct savings of `$0.00`.
   - **ETH**: Select `ETH` (which has a positive profit of `+$89.41`). Because it is a profit, it increases your tax liability rather than saving you money, so no celebration savings badge is shown—exactly as per tax guidelines!
3. **Asset Search**: Type `BTC` or `USDT` into the search bar. The list will filter in real-time.
4. **"View All" Accordion**: Scroll to the bottom of the table and click `View All (24)` to expand all rows, and `View Less` to collapse back to the compact dashboard view.
5. **Interactive Modal**: Click **"How it works?"** next to the main title to trigger a beautiful overlay modal outlining the mathematical set-off regulations.
6. **Mobile View**: Inspect the page and scale down to 375px (mobile). The capital gains cards stack vertically, table balances scale down, and the table slides horizontally so nothing overlaps.

---

## 🛠️ Project Structure

```
├── app
│   ├── api
│   │   ├── capital-gains
│   │   │   └── route.js        # Mock Capital Gains API Route Handler
│   │   └── holdings
│   │       └── route.js        # Mock Holdings API Route Handler
│   ├── components
│   │   ├── ThemeContext.js     # Client Context for Dark/Light Mode
│   │   ├── Disclaimers.js      # Collapsible Accordion Info Banner
│   │   ├── GainsCard.js        # Reusable Capital Gains visual cards
│   │   ├── HoldingsTable.js    # Filterable, sortable asset listing
│   │   └── TaxHarvestingDashboard.js # Core State Coordinator
│   ├── globals.css             # Tailwind CSS v4 variables & custom animations
│   ├── layout.js               # SEO headers, viewport configurations & HTML shell
│   └── page.js                 # Next.js Server Component entry point
├── data
│   ├── capital-gains-api.json  # Raw capital gains initial payload
│   └── holdings-api.json       # Raw holdings portfolio payload
├── README.md                   # Recruiter-facing Documentation
```

---

## 💻 Local Setup & Development

### 1. Installation
Ensure you have **Node.js v18+** installed. Clone the repository, navigate to the project directory, and install the dependencies:
```bash
npm install
```

### 2. Launch Local Development
Start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 3. Production Build Validation
Verify that the Next.js production build bundles and optimizes successfully:
```bash
npm run build
```
The build process compiles TypeScript definitions, minifies assets, and structures dynamic route pre-rendering warning-free.
