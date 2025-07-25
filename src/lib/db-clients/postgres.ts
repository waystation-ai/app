import { Pool, DatabaseError } from 'pg';
import { DatabaseClient } from './types';

type Schema = Record<string, { column: string; type: string }[]>;

export class PostgreSqlDbClient implements DatabaseClient {
  private pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  private handleError(error: unknown): string {
    if (error instanceof DatabaseError) {
      if (error.code === 'ENOTFOUND') {
        return 'Error Occurred: Could not resolve database host. Please check your connection string.';
      }
      if (error.code === '28P01') {
        return `Error Occurred: Authentication error: ${error.message}`;
      }
      return error.message;
    }
    if (error instanceof Error) {
      return `Error Occurred: ${error.message}`;
    }
    return 'Error Occurred: An unknown error occurred.';
  }

  async fetchSchema(): Promise<Schema | string> {
    const schemaQuery = `
      SELECT
        c.table_name,
        c.column_name,
        c.data_type
      FROM
        information_schema.columns c
      WHERE
        c.table_schema = 'public'
      ORDER BY
        c.table_name, c.ordinal_position;
    `;
    try {
      const { rows } = await this.pool.query(schemaQuery);

      const schema = rows.reduce<Schema>((acc: Schema, { table_name, column_name, data_type }: { table_name: string; column_name: string; data_type: string }) => {
        if (!acc[table_name]) {
          acc[table_name] = [];
        }
        acc[table_name].push({ column: column_name, type: data_type });
        return acc;
      }, {});

      return schema;
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  async executeQuery<T = unknown>(sql: string, params?: unknown[]): Promise<T[] | string> {
    try {
      const { rows } = await this.pool.query(sql, params);
      return rows as T[];
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
