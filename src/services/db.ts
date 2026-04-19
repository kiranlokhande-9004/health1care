/**
 * Generic data access layer over Supabase.
 * Every helper assumes RLS is enabled — the user only ever sees their own rows.
 *
 * Usage:
 *   const meals = await getAll('meals', { orderBy: { column: 'created_at', ascending: false } });
 *   const meal  = await getById('meals', id);
 *   await createRecord('meals', { name, type, ... });   // user_id auto-injected
 *   await updateRecord('meals', id, { name: 'New name' });
 *   await removeRecord('meals', id);
 */
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type TableName = keyof Database["public"]["Tables"];

export interface QueryOptions {
  filters?: Record<string, string | number | boolean | null>;
  orderBy?: { column: string; ascending?: boolean };
  page?: number;
  pageSize?: number;
  search?: { column: string; query: string }; // ilike search
}

async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Not authenticated");
  return data.user.id;
}

export async function getAll<T = any>(
  table: TableName,
  options: QueryOptions = {},
): Promise<T[]> {
  let query = supabase.from(table).select("*");

  if (options.filters) {
    for (const [k, v] of Object.entries(options.filters)) {
      query = query.eq(k, v as any);
    }
  }
  if (options.search?.query) {
    query = query.ilike(options.search.column, `%${options.search.query}%`);
  }
  if (options.orderBy) {
    query = query.order(options.orderBy.column, {
      ascending: options.orderBy.ascending ?? true,
    });
  }
  if (options.page !== undefined && options.pageSize) {
    const from = options.page * options.pageSize;
    query = query.range(from, from + options.pageSize - 1);
  }

  const { data, error } = await query;
  if (error) {
    console.error(`[db] getAll(${table}) failed:`, error);
    throw error;
  }
  return (data ?? []) as T[];
}

export async function getById<T = any>(table: TableName, id: string): Promise<T | null> {
  const { data, error } = await supabase.from(table).select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error(`[db] getById(${table}, ${id}) failed:`, error);
    throw error;
  }
  return data as T | null;
}

export async function createRecord<T = any>(
  table: TableName,
  values: Record<string, any>,
): Promise<T> {
  const userId = await requireUserId();
  const payload = { ...values, user_id: values.user_id ?? userId };
  const { data, error } = await supabase.from(table).insert(payload as any).select().single();
  if (error) {
    console.error(`[db] createRecord(${table}) failed:`, error, payload);
    throw error;
  }
  return data as T;
}

export async function updateRecord<T = any>(
  table: TableName,
  id: string,
  values: Record<string, any>,
): Promise<T> {
  const { data, error } = await supabase
    .from(table)
    .update(values as any)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.error(`[db] updateRecord(${table}, ${id}) failed:`, error);
    throw error;
  }
  return data as T;
}

export async function removeRecord(table: TableName, id: string): Promise<void> {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) {
    console.error(`[db] removeRecord(${table}, ${id}) failed:`, error);
    throw error;
  }
}
