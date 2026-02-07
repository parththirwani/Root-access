export const hasDatabaseAccess = !!process.env.DATABASE_URL;

export function canAccessDatabase(): boolean {
  return hasDatabaseAccess;
}