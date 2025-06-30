export interface DatabaseClient {
  fetchSchema(): Promise<unknown | string>;
  executeQuery<T = unknown>(sql: string, params?: unknown[]): Promise<T[] | string>;
  close(): Promise<void>;
}
