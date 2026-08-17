import { defineConfig } from "rayfin";

export default defineConfig({
  name: "Wildfire SitRep",
  description: "Situation Report generator for prefects and crisis coordinators",
  icon: "📋",

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
    { path: "/", title: "Generate SitRep", icon: "📋" },
    { path: "/history", title: "Report History", icon: "📁" },
  ],

  // AI Skill integration for auto-summary
  aiSkill: {
    workspaceId: process.env.FABRIC_WORKSPACE_ID || "<your-workspace-id>",
    skillId: process.env.AI_SKILL_ID || "<your-ai-skill-id>",
  },
});
