import Database from "better-sqlite3"
import { PrismaClient } from "../src/generated/prisma"

const sqlite = new Database("prisma/dev.db")
const neon = new PrismaClient()

const dateFields = new Set(["createdAt", "updatedAt", "dateAwarded"])

function fixRow(row: any) {
  if (!row) return row
  const fixed = { ...row }
  for (const key of Object.keys(fixed)) {
    if (dateFields.has(key) && typeof fixed[key] === "number") {
      fixed[key] = new Date(fixed[key])
    }
  }
  return fixed
}

async function safeCreate(table: string, rows: any[]) {
  let count = 0
  for (const row of rows) {
    try {
      await (neon as any)[table].create({ data: fixRow(row) })
      count++
    } catch (e: any) {
      console.log(`  ${table} error: ${e.message?.slice(0, 150)}`)
    }
  }
  return count
}

async function main() {
  const users = sqlite.prepare("SELECT * FROM User").all() as any[]
  console.log(`Migrated ${await safeCreate("user", users)} users`)

  const profiles = sqlite.prepare("SELECT * FROM Profile").all() as any[]
  console.log(`Migrated ${await safeCreate("profile", profiles)} profiles`)

  const photos = sqlite.prepare("SELECT * FROM ProfilePhoto").all() as any[]
  console.log(`Migrated ${await safeCreate("profilePhoto", photos)} profile photos`)

  const roles = sqlite.prepare("SELECT * FROM Role").all() as any[]
  console.log(`Migrated ${await safeCreate("role", roles)} roles`)

  const skills = sqlite.prepare("SELECT * FROM Skill").all() as any[]
  console.log(`Migrated ${await safeCreate("skill", skills)} skills`)

  const projects = sqlite.prepare("SELECT * FROM Project").all() as any[]
  console.log(`Migrated ${await safeCreate("project", projects)} projects`)

  const certs = sqlite.prepare("SELECT * FROM Certification").all() as any[]
  console.log(`Migrated ${await safeCreate("certification", certs)} certifications`)

  const msgs = sqlite.prepare("SELECT * FROM ContactMessage").all() as any[]
  console.log(`Migrated ${await safeCreate("contactMessage", msgs)} messages`)

  console.log("Migration complete!")
}

main()
  .catch(console.error)
  .finally(async () => {
    sqlite.close()
    await neon.$disconnect()
  })
