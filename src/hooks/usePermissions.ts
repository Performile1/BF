import { useAuth } from '../context/AuthContext';

export function usePermissions() {
  const { currentUser, user } = useAuth();

  const isSuperAdmin = Boolean(
    currentUser?.is_admin ||
    (currentUser?.role as string) === 'SUPER_ADMIN' ||
    (currentUser?.role as string) === 'ADMIN' ||
    currentUser?.role_title?.toLowerCase().includes('admin') ||
    currentUser?.role_title?.toLowerCase().includes('grundare') ||
    currentUser?.id === 'usr_rickard_wigrund' ||
    currentUser?.id === 'usr_rickard_performile' ||
    currentUser?.email === 'rickard@wigrund.se' ||
    currentUser?.email === 'admin@performile.com' ||
    currentUser?.email === 'wigrund81@gmail.com' ||
    user?.email === 'rickard@wigrund.se' ||
    user?.email === 'admin@performile.com' ||
    user?.email === 'wigrund81@gmail.com'
  );

  const isAdmin = isSuperAdmin;

  return {
    isSuperAdmin,
    isAdmin,
    currentUser,
    user
  };
}
