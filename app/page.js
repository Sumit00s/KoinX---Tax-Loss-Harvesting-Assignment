import TaxHarvestingDashboard from "./components/TaxHarvestingDashboard";
import capitalGainsData from "@/data/capital-gains-api.json";
import holdingsData from "@/data/holdings-api.json";

// Automate metadata generation on every page for SEO best practices
export const metadata = {
  title: "Tax Loss Harvesting - KoinX",
  description: "Assess your capital gains, set off losses, and calculate tax savings with KoinX.",
};

export default async function Home() {
  return (
    <TaxHarvestingDashboard
      initialCapitalGains={capitalGainsData}
      initialHoldings={holdingsData}
    />
  );
}
