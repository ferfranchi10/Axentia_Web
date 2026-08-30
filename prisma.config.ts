import { defineConfig, env } from "@prisma/config";
import { config as loadEnv } from "dotenv";

// La CLI de Prisma no carga .env.local automáticamente (esa es una
// convención de Next.js, no de Prisma), así que lo cargamos acá a mano.
loadEnv({ path: ".env.local" });

// Prisma 7: la CLI (migrate/studio) ya no lee la URL desde schema.prisma,
// se configura acá. El cliente en tiempo de ejecución usa un adapter
// (ver src/lib/db.ts), este archivo solo es para los comandos de Prisma CLI.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
