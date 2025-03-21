import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Define User type based on the database schema
export type User = Database['public']['Tables']['users']['Row'];

/**
 * Fetches all users/team members
 */
export async function fetchUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('name');

  if (error) throw new Error(`Error fetching users: ${error.message}`);
  return data || [];
}

/**
 * Fetches a specific user by ID
 */
export async function fetchUserById(id: number): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(`Error fetching user: ${error.message}`);
  return data;
}

/**
 * Creates a new user/team member
 */
export async function createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .insert([user])
    .select()
    .single();

  if (error) throw new Error(`Error creating user: ${error.message}`);
  return data;
}

/**
 * Updates an existing user
 */
export async function updateUser(id: number, updates: Partial<Omit<User, 'id' | 'created_at'>>): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Error updating user: ${error.message}`);
  return data;
}

/**
 * Deletes a user
 */
export async function deleteUser(id: number): Promise<void> {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Error deleting user: ${error.message}`);
}

/**
 * Fetches users by their alert level
 */
export async function fetchUsersByLevel(level: string): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('level', level)
    .order('name');

  if (error) throw new Error(`Error fetching users by level: ${error.message}`);
  return data || [];
}