import { defineConfig } from "rayfin";

export default defineConfig({
  name: "Wildfire Command Center",
  description: "Real-time operational command center for SDIS wildfire coordinators",
  icon: "🔥",

  // Fabric workspace where this app will be published
  workspace: process.env.FABRIC_WORKSPACE_ID || "<your-workspace-id>",

  dataSources: [
    {
      id: "eventhouse",
      type: "kusto",
      cluster: process.env.EVENTHOUSE_CLUSTER || "https://EH_Wildfire.westeurope.kusto.fabric.microsoft.com",
      database: "WildfireDB",
    },
  ],

  pages: [
    { path: "/", title: "Command Center", icon: "🗺️" },
    { path: "/dispatch", title: "Dispatch", icon: "🎯" },
    { path: "/alerts", title: "Alerts", icon: "🚨" },
  ],

  // Auto-refresh interval (ms) for real-time data
  refreshInterval: 30_000,

  theme: {
    primary: "#e74c3c",
    accent: "#3498db",
    background: "#0f0f23",
    surface: "#1e1e3a",
  },
});
