export const overviewStats = [
  {
    label: "System health",
    value: "99.98%",
    delta: "+0.04%",
    description: "Gateway, Redis and database heartbeat stability"
  },
  {
    label: "Active agents",
    value: "12",
    delta: "+3",
    description: "Agents currently enabled across production workspaces"
  },
  {
    label: "Connected channels",
    value: "5",
    delta: "+2",
    description: "WhatsApp and WebChat connectors online"
  },
  {
    label: "Pending jobs",
    value: "18",
    delta: "-6",
    description: "Automations waiting in BullMQ queues"
  }
] as const;

export const sessionRows = [
  ["WA-1044", "WhatsApp", "Lead Qualifier", "Open", "2m ago"],
  ["WEB-1992", "WebChat", "Support Frontline", "Idle", "6m ago"],
  ["WA-1040", "WhatsApp", "Revenue Desk", "Open", "11m ago"]
] as const;

export const channelRows = [
  ["WhatsApp Production", "Connected", "QR persisted", "2m ago"],
  ["Website Widget", "Connected", "Live preview enabled", "1m ago"],
  ["Sales Sandbox", "Connecting", "Session restore in progress", "14m ago"]
] as const;

export const alerts = [
  "OpenAI provider not connected in production workspace.",
  "One WhatsApp connector is awaiting session recovery.",
  "Backups are configured but not yet validated."
] as const;
