import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

/** 惰性连接；未配置 DATABASE_URL 时返回 null，调用方回退到扫链 */
export function getPool(): mysql.Pool | null {
  if (pool) return pool;
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  pool = mysql.createPool({ uri: url, connectionLimit: 5 });
  return pool;
}
