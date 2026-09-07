import { defineConfig } from "@prisma/config";
import { config as loadEnv } from "dotenv";

// La CLI de Prisma no carga .env.local automáticamente.
loadEnv({ path: ".env.local" });

// Placeholder para que `prisma generate` (postinstall / CI) funcione sin base
// de datos. `prisma migrate` y `studio` sí necesitan la URL real en .env.local.
const url =
  process.env.DATABASE_URL ??
  "postgresql://user:pass@localhost:5432/placeholder";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: { url },
});
