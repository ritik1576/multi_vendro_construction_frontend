import React, { useState, useMemo } from 'react';
import { Search, User, Briefcase } from 'lucide-react';

export const UserSearchList = ({ users, loading, error, onSelectUser, selectedUserId }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = useMemo(() => {
    if (!users || !Array.isArray(users)) return [];
    if (!searchTerm.trim()) return users;
    
    const query = searchTerm.toLowerCase();
    return users.filter(user => {
      const name = (user.fullName || user.name || '').toLowerCase();
      const email = (user.email || '').toLowerCase();
      const role = (user.role || '').toLowerCase();
      return name.includes(query) || email.includes(query) || role.includes(query);
    });
  }, [users, searchTerm]);

  return (
    <div className="flex flex-col space-y-3 h-full">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-xs font-medium text-[var(--color-customText-primary)] border border-[var(--color-customBorder-main)] rounded focus:outline-none focus:border-[var(--color-primary-main)] focus:ring-1 focus:ring-[var(--color-primary-main)] transition-colors bg-white shadow-sm"
        />
      </div>

      <div className="flex-1 overflow-y-auto border border-[var(--color-customBorder-light)] rounded bg-gray-50/30 max-h-[250px]">
        {loading ? (
          <div className="flex items-center justify-center p-6 text-xs text-gray-500">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-[var(--color-primary-main)] rounded-full animate-spin mr-2"></div>
            Loading users...
          </div>
        ) : error ? (
          <div className="p-4 text-xs text-red-500 text-center">{error}</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-6 text-xs text-gray-500 text-center">No users found.</div>
        ) : (
          <ul className="divide-y divide-[var(--color-customBorder-light)]">
            {filteredUsers.map((user) => {
              const isSelected = selectedUserId === user.id;
              const isVendor = user.role?.toLowerCase() === 'vendor';
              return (
                <li 
                  key={user.id}
                  onClick={() => onSelectUser(user)}
                  className={`p-3 cursor-pointer transition-colors flex items-center justify-between hover:bg-gray-100 ${
                    isSelected ? 'bg-blue-50/50 border-l-4 border-[var(--color-primary-main)]' : 'border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isVendor ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                      {isVendor ? <Briefcase className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[var(--color-customText-primary)]">{user.fullName || user.name || 'Unknown'}</span>
                      <span className="text-[10px] text-gray-500">{user.email}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded ${isVendor ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                    {user.role}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
