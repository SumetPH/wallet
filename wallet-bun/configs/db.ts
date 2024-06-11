import { Kysely, PostgresDialect } from "kysely";
import type { DB } from "kysely-codegen";
import { Pool, types } from "pg";
import dayjs from "dayjs";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

types.setTypeParser(1114, (str) => dayjs(str).format("YYYY-MM-DD HH:mm:ss"));

const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
  // log: ["query", "error"],
});

export default db;
