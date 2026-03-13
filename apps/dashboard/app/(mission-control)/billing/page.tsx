import { EmptyState } from "../../../components/empty-state";
import { PageHeader } from "../../../components/page-header";

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Billing"
        title="Cost visibility placeholder"
        description="Usage and spend reporting will arrive with provider metering, channel accounting and workspace-level forecasting."
      />

      <EmptyState
        title="Billing is intentionally staged"
        description="The shell is already present so VEXUSCLAW can grow into usage analytics, provider spend attribution and budget controls without redesigning the dashboard."
        actionLabel="Plan reporting model"
      />
    </div>
  );
}
