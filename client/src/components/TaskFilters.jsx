const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
];

export default function TaskFilters({ filter, onFilterChange, search, onSearchChange }) {
  return (
    <div className="filters">
      <input
        type="search"
        className="search-input"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search tasks…"
      />
      <div className="filter-tabs">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`tab ${filter === f.key ? 'tab-active' : ''}`}
            onClick={() => onFilterChange(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
