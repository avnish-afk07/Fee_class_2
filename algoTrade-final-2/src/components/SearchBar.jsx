import { useEffect, useRef, useState } from 'react';
import { SearchIcon } from './icons';

export default function SearchBar({ placeholder = 'Search assets, orders, wallets...', value, onChange }) {
  const [internalValue, setInternalValue] = useState('');
  const isControlled = value !== undefined;
  const query = isControlled ? value : internalValue;

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    if (isControlled) {
      onChange?.(e.target.value);
    } else {
      setInternalValue(e.target.value);
    }
  };

  return (
    <div className="search-bar">
      <span className="search-icon">
        <SearchIcon width={16} height={16} />
      </span>
      <input
        ref={inputRef}
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={handleChange}
        aria-label="Search"
      />
    </div>
  );
}
