import {
  Blocks,
  Bot,
  BrainCircuit,
  Cable,
  ChartColumn,
  CreditCard,
  Files,
  House,
  Logs,
  Settings2
} from "lucide-react";

export const primaryNavigation = [
  { href: "/overview", label: "Overview", icon: House },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/channels", label: "Channels", icon: Cable },
  { href: "/sessions", label: "Sessions", icon: ChartColumn },
  { href: "/memory", label: "Memory", icon: BrainCircuit },
  { href: "/skills", label: "Skills", icon: Blocks },
  { href: "/automations", label: "Automations", icon: Files },
  { href: "/logs", label: "Logs", icon: Logs },
  { href: "/settings", label: "Settings", icon: Settings2 },
  { href: "/billing", label: "Billing", icon: CreditCard }
] as const;
