import { prisma } from "@/lib/db";

// Control de costes (sección 31 y 0.4 del doc original). Configurable por
// variable de entorno para no tener que tocar código si hay que ajustarlos;
// estos valores por defecto alcanzan de sobra para la Fase 0 (~100 empresas).
export const MAX_RESULTS_PER_SEARCH = Number(process.env.MAX_RESULTS_PER_SEARCH) || 20;
export const MAX_SEARCHES_PER_DAY = Number(process.env.MAX_SEARCHES_PER_DAY) || 20;
export const MAX_AUDITS_PER_DAY = Number(process.env.MAX_AUDITS_PER_DAY) || 40;
export const MAX_AI_CALLS_PER_DAY = Number(process.env.MAX_AI_CALLS_PER_DAY) || 30;

const WARNING_THRESHOLDS = [0.5, 0.75, 0.9, 1] as const;

export interface UsageCheck {
  used: number;
  limit: number;
  remaining: number;
  blocked: boolean;
  warning: string | null;
}

function startOfTodayUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

// Cuenta cuántas llamadas de `type` se hicieron hoy y compara contra el
// límite diario configurado. No bloquea silenciosamente: a partir del 50%
// devuelve un aviso, y solo bloquea al llegar al 100%.
export async function checkDailyUsage(type: string, limit: number): Promise<UsageCheck> {
  const used = await prisma.usageLog.count({
    where: { type, createdAt: { gte: startOfTodayUTC() } },
  });

  const ratio = limit > 0 ? used / limit : 1;
  const blocked = used >= limit;

  let warning: string | null = null;
  if (blocked) {
    warning = `Se alcanzó el límite diario de ${limit} para ${type}. Se puede ajustar con la variable de entorno correspondiente.`;
  } else {
    const crossed = WARNING_THRESHOLDS.filter((t) => ratio >= t).pop();
    if (crossed) {
      warning = `Ya usaste el ${Math.round(crossed * 100)}% del límite diario (${used}/${limit}) para ${type}.`;
    }
  }

  return { used, limit, remaining: Math.max(limit - used, 0), blocked, warning };
}

export async function logUsage(type: string, detail?: string, resultCount?: number) {
  await prisma.usageLog.create({ data: { type, detail, resultCount } });
}
