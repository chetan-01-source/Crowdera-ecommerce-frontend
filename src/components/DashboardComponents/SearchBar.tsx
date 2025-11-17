import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  searchProductsThunk, 
  clearSearchResults, 
  setSearchQuery,
  clearSearchError
} from '../../store/productSlice';

interface SearchBarProps {
  onSearchStateChange?: (isSearching: boolean) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearchStateChange, 
  placeholder = "Search products...",
  className = ""
}) => {
  const dispatch = useAppDispatch();
  const { searchQuery, isSearching, searchError } = useAppSelector(state => state.product);
  
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const debounceTimeoutRef = useRef<number | null>(null);
  const lastSearchRef = useRef<string>('');

  // Debounced search function
  const performSearch = useCallback((query: string) => {
    const trimmedQuery = query.trim();
    
    // Avoid duplicate searches
    if (trimmedQuery === lastSearchRef.current) {
      return;
    }
    
    lastSearchRef.current = trimmedQuery;
    
    if (trimmedQuery) {
      dispatch(setSearchQuery(trimmedQuery));
      dispatch(searchProductsThunk({ 
        query: trimmedQuery, 
        limit: 20,
        sortOrder: 'desc'
      }));
    } else {
      dispatch(clearSearchResults());
      dispatch(setSearchQuery(''));
    }
  }, [dispatch]);

  // Handle input changes with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout for debounced search
    debounceTimeoutRef.current = window.setTimeout(() => {
      performSearch(newValue);
    }, 300);
  };

  // Notify parent component about search state changes
  useEffect(() => {
    if (onSearchStateChange) {
      onSearchStateChange(!!searchQuery || isSearching);
    }
  }, [isSearching, searchQuery, onSearchStateChange]);

  // Clear search error when input changes
  useEffect(() => {
    if (searchError) {
      dispatch(clearSearchError());
    }
  }, [inputValue, dispatch, searchError]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleClearSearch = () => {
    setInputValue('');
    lastSearchRef.current = '';
    
    // Clear any pending debounced search
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
    
    dispatch(clearSearchResults());
    dispatch(setSearchQuery(''));
    dispatch(clearSearchError());
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClearSearch();
    } else if (e.key === 'Enter') {
      // Immediate search on Enter, clear debounce
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
      performSearch(inputValue);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`relative transition-all duration-200 ${
        isFocused ? 'transform scale-[1.02]' : ''
      }`}>
     
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className={`h-5 w-5 transition-colors duration-200 ${
            isFocused ? 'text-blue-400' : 'text-gray-400'
          }`} />
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full pl-12 pr-12 py-3 
            bg-gray-900 border border-gray-700 rounded-lg
            text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all duration-200
            ${isFocused ? 'bg-gray-800 border-blue-500' : 'hover:border-gray-600'}
            ${searchError ? 'border-red-500' : ''}
          `}
          disabled={false}
        />

        {/* Clear Button / Loading Spinner */}
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          {isSearching ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent" />
          ) : inputValue && (
            <button
              onClick={handleClearSearch}
              className="text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {searchError && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-red-900 border border-red-700 rounded-md text-red-300 text-sm z-10">
          {searchError}
        </div>
      )}
    </div>
  );
};

export default SearchBar;