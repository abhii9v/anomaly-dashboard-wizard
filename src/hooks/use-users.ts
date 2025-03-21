import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
  fetchUsersByLevel,
  type User
} from '@/services/userService';

// Query keys for caching and invalidation
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: () => [...userKeys.lists()] as const,
  listByLevel: (level: string) => [...userKeys.lists(), 'byLevel', level] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

/**
 * Hook to get all users
 */
export function useUsers() {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: () => fetchUsers(),
  });
}

/**
 * Hook to get users by their level (L1, L2, L3, etc.)
 */
export function useUsersByLevel(level: string) {
  return useQuery({
    queryKey: userKeys.listByLevel(level),
    queryFn: () => fetchUsersByLevel(level),
    enabled: !!level,
  });
}

/**
 * Hook to get a specific user's details
 */
export function useUserDetails(id: number) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUserById(id),
    enabled: id > 0, // Only fetch if we have a valid ID
  });
}

/**
 * Hook to create a new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (user: Omit<User, 'id' | 'created_at'>) => createUser(user),
    onSuccess: () => {
      // Invalidate user lists
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

/**
 * Hook to update an existing user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { 
      id: number; 
      updates: Partial<Omit<User, 'id' | 'created_at'>>
    }) => updateUser(id, updates),
    onSuccess: (_, variables) => {
      // Invalidate the specific user and user lists
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: (_, id) => {
      // Invalidate and remove the user from the cache
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.removeQueries({ queryKey: userKeys.detail(id) });
    },
  });
}