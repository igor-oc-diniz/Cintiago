export function parseCorsOrigins(raw: string | undefined): string[] {
  const fallback = 'http://localhost:5173,http://localhost:5175';
  return (raw ?? fallback).split(',').map((origin) => origin.trim());
}
