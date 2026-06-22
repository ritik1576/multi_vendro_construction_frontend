export const formatRole = (role) => {
  if (!role) return 'User';
  return role.charAt(0).toUpperCase() + role.slice(1);
};

export const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

export const getDisplayName = (user) => {
  if (!user) return 'User';
  return user.fullName || user.FullName || user.name || user.Name || user.firstName || user.customerName || user.shopName || user.businessName || user.username || user.UserName || 'User';
};
