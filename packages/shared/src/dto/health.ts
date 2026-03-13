import type { HealthCheckResult, HealthReport } from "../contracts/api";

export interface ReadinessSnapshot {
  report: HealthReport;
  healthyChecks: HealthCheckResult[];
  failedChecks: HealthCheckResult[];
}
