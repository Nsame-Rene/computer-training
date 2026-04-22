export function isMissingTableError(error: unknown): boolean {
  const code = (error as { code?: string } | null)?.code;
  const message =
    (error as { message?: string } | null)?.message?.toLowerCase?.() || "";

  return code === "P2021" || message.includes("does not exist");
}

export function getDbInitHelpMessage() {
  return "Database is not initialized yet. Run: npx prisma db push && npx tsx src/db/seed.ts";
}
