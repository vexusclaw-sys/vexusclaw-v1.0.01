import { SkillStatus } from "@prisma/client";

import { prisma } from "../src/client";

const defaultSkills = [
  {
    author: "VEXUSCLAW",
    category: "sales",
    description: "Synchronize contacts and account context from connected CRMs.",
    name: "CRM Sync",
    requiredPermissions: ["contacts:read", "contacts:write"],
    slug: "crm-sync",
    version: "1.0.0"
  },
  {
    author: "VEXUSCLAW",
    category: "operations",
    description: "Assist agents with meeting availability and follow-up scheduling.",
    name: "Calendar Helper",
    requiredPermissions: ["calendar:read", "calendar:write"],
    slug: "calendar-helper",
    version: "1.0.0"
  },
  {
    author: "VEXUSCLAW",
    category: "revenue",
    description: "Provide pipeline-aware replies and qualification hints.",
    name: "Sales Assistant",
    requiredPermissions: ["deals:read"],
    slug: "sales-assistant",
    version: "1.0.0"
  },
  {
    author: "VEXUSCLAW",
    category: "knowledge",
    description: "Expose file lookup across uploaded memory assets.",
    name: "File Search",
    requiredPermissions: ["files:read"],
    slug: "file-search",
    version: "1.0.0"
  },
  {
    author: "VEXUSCLAW",
    category: "observability",
    description: "Provide runtime status, logs and readiness data to operators.",
    name: "System Monitor",
    requiredPermissions: ["system:read"],
    slug: "system-monitor",
    version: "1.0.0"
  }
];

async function main() {
  for (const skill of defaultSkills) {
    await prisma.skill.upsert({
      where: {
        slug: skill.slug
      },
      update: {
        category: skill.category,
        description: skill.description,
        manifest: {
          author: skill.author,
          permissions: skill.requiredPermissions
        },
        name: skill.name,
        requiredPermissions: skill.requiredPermissions,
        status: SkillStatus.PUBLISHED,
        version: skill.version
      },
      create: {
        ...skill,
        manifest: {
          author: skill.author,
          permissions: skill.requiredPermissions
        },
        status: SkillStatus.PUBLISHED
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
