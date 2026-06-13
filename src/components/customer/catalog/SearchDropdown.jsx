import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Clock, TrendingUp, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const POPULAR_SEARCHES = ['Cement', 'Steel', 'Power Tools', 'Safety Gear', 'Paints'];
const RECENT_SEARCHES_KEY = 'inframart_recent_searches';

export default function SearchDropdown({ 
  searchTerm = '', 
  onSearchChange = () => {}, 
  className = '',
  placeholder = 'Search for Products, Brands and More'
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Redux state
  const rawProducts = useSelector((state) => state.product?.products);
  const products = Array.isArray(rawProducts) ? rawProducts : [];

  // Load recent searches on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load recent searches', e);
    }
  }, []);

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveRecentSearch = (term) => {
    if (!term || term.trim() === '') return;
    const trimmed = term.trim();
    let updated = [trimmed, ...recentSearches.filter(t => t.toLowerCase() !== trimmed.toLowerCase())];
    updated = updated.slice(0, 5); // Keep max 5
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save recent search', e);
    }
  };

  const removeRecentSearch = (e, termToRemove) => {
    e.stopPropagation();
    const updated = recentSearches.filter(t => t !== termToRemove);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save recent search', e);
    }
  };

  const handleSelectSearchTerm = (term) => {
    saveRecentSearch(term);
    onSearchChange(term);
    setIsFocused(false);
    // If we are not on products page, navigate to it
    if (!window.location.pathname.includes('/products')) {
      navigate('/products');
    }
  };

  const handleSelectProduct = (product) => {
    saveRecentSearch(product.name);
    setIsFocused(false);
    const idToUse = product?.id || product?._id || product?.productId;
    if (idToUse) {
      navigate(`/product/${idToUse}`);
    }
  };

  const handleSelectCategory = (category) => {
    saveRecentSearch(category);
    onSearchChange(category);
    setIsFocused(false);
    if (!window.location.pathname.includes('/products')) {
      navigate('/products');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSelectSearchTerm(searchTerm);
    }
  };

  // Compute matches
  const normalizedSearch = searchTerm.trim().toLowerCase();
  
  const matchingCategories = useMemo(() => {
    if (!normalizedSearch) return [];
    const allCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    return allCategories
      .filter(cat => cat.toLowerCase().includes(normalizedSearch))
      .slice(0, 3);
  }, [products, normalizedSearch]);

  const matchingProducts = useMemo(() => {
    if (!normalizedSearch) return [];
    return products
      .filter(p => {
        const searchable = [p.name, p.category, p.vendor].filter(Boolean).join(' ').toLowerCase();
        return searchable.includes(normalizedSearch);
      })
      .slice(0, 5);
  }, [products, normalizedSearch]);

  const showDropdown = isFocused && (
    (!normalizedSearch && (recentSearches.length > 0 || POPULAR_SEARCHES.length > 0)) ||
    (normalizedSearch && (matchingCategories.length > 0 || matchingProducts.length > 0))
  );

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <div className={`flex items-center bg-[#F1F3F6] rounded overflow-hidden ${isFocused ? 'ring-1 ring-[#1E3A8A] bg-white shadow-sm' : ''}`}>
        <div className="pl-3 pr-2 flex items-center pointer-events-none text-slate-500">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          className="w-full bg-transparent text-slate-800 text-[15px] font-medium py-2.5 pr-4 focus:outline-none placeholder-slate-500"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
        />
        {searchTerm && (
          <button 
            className="pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
            onClick={() => {
              onSearchChange('');
              setIsFocused(true);
            }}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-slate-200 z-[100] overflow-hidden">
          <div className="max-h-[400px] overflow-y-auto overscroll-contain">
            
            {/* Empty Search: Recent & Popular */}
            {!normalizedSearch && (
              <div className="py-2">
                {recentSearches.length > 0 && (
                  <div className="mb-2">
                    <div className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Recent Searches
                    </div>
                    {recentSearches.map((term, idx) => (
                      <div 
                        key={`recent-${idx}`}
                        className="flex items-center justify-between px-4 py-2 hover:bg-slate-50 cursor-pointer group"
                        onClick={() => handleSelectSearchTerm(term)}
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span className="text-sm font-medium text-slate-700">{term}</span>
                        </div>
                        <button 
                          className="text-slate-300 hover:text-slate-500 hidden group-hover:block"
                          onClick={(e) => removeRecentSearch(e, term)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {POPULAR_SEARCHES.length > 0 && (
                  <div>
                    <div className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Popular Searches
                    </div>
                    {POPULAR_SEARCHES.map((term, idx) => (
                      <div 
                        key={`popular-${idx}`}
                        className="flex items-center px-4 py-2 hover:bg-slate-50 cursor-pointer"
                        onClick={() => handleSelectSearchTerm(term)}
                      >
                        <TrendingUp className="h-4 w-4 text-slate-400 mr-3" />
                        <span className="text-sm font-medium text-slate-700">{term}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Active Search: Categories & Products */}
            {normalizedSearch && (
              <div className="py-2">
                {matchingCategories.length > 0 && (
                  <div className="mb-2 border-b border-slate-100 pb-2">
                    {matchingCategories.map((cat, idx) => (
                      <div 
                        key={`cat-${idx}`}
                        className="flex items-center px-4 py-2 hover:bg-slate-50 cursor-pointer"
                        onClick={() => handleSelectCategory(cat)}
                      >
                        <Search className="h-4 w-4 text-slate-400 mr-3" />
                        <div className="text-sm">
                          <span className="font-bold text-[#1E3A8A]">{normalizedSearch}</span>
                          <span className="text-slate-500 font-medium ml-1">in {cat}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {matchingProducts.length > 0 ? (
                  <div>
                    {matchingProducts.map((product, idx) => (
                      <div 
                        key={`prod-${product._id || product.id || idx}`}
                        className="flex items-center px-4 py-2 hover:bg-slate-50 cursor-pointer"
                        onClick={() => handleSelectProduct(product)}
                      >
                        <Search className="h-4 w-4 text-slate-400 mr-3 min-w-[16px]" />
                        <div className="text-sm font-medium text-slate-700 truncate">
                          {product.name}
                        </div>
                        {product.category && (
                          <div className="ml-auto pl-4 text-xs text-slate-400 truncate max-w-[100px]">
                            {product.category}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  matchingCategories.length === 0 && (
                    <div className="px-4 py-4 text-center text-sm text-slate-500">
                      No results found for "{searchTerm}"
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
