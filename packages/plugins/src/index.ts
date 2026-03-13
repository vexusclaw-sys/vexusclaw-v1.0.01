import type { PluginManifest } from "@vexus/sdk";

export const seedPluginCatalog: PluginManifest[] = [
  {
    slug: "crm-sync",
    name: "CRM Sync",
    version: "1.0.0",
    author: "VEXUS",
    category: "sales",
    permissions: ["contacts:read", "contacts:write"],
    description: "Synchronize customer records with external CRM systems."
  },
  {
    slug: "calendar-helper",
    name: "Calendar Helper",
    version: "1.0.0",
    author: "VEXUS",
    category: "operations",
    permissions: ["calendar:read", "calendar:write"],
    description: "Assist agents with scheduling and availability checks."
  },
  {
    slug: "sales-assistant",
    name: "Sales Assistant",
    version: "1.0.0",
    author: "VEXUS",
    category: "revenue",
    permissions: ["deals:read"],
    description: "Provide pipeline-aware sales guidance to active agents."
  },
  {
    slug: "file-search",
    name: "File Search",
    version: "1.0.0",
    author: "VEXUS",
    category: "knowledge",
    permissions: ["files:read"],
    description: "Search indexed files and memory assets across the workspace."
  },
  {
    slug: "system-monitor",
    name: "System Monitor",
    version: "1.0.0",
    author: "VEXUS",
    category: "observability",
    permissions: ["system:read"],
    description: "Expose runtime health and operational telemetry as a skill."
  }
];
