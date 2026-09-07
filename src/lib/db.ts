import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Evita crear una conexión nueva a la base de datos en cada recarga
// durante desarrollo (Next.js recarga módulos con cada cambio de archivo).
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// El driver `pg` no respeta el matiz de `sslmode=require` de libpq (que no
// valida el certificado): sin este flag, rechaza el certificado autofirmado
// de Postgres en Railway. La conexión sigue siendo cifrada, solo no se
// valida la cadena de certificados contra una CA pública.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
