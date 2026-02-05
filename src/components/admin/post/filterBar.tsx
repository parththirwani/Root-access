interface FilterBarProps {
  tags: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function FilterBar({ tags, activeFilter, onFilterChange }: FilterBarProps) {
  if (tags.length <= 1) return null;

  return (
    <div className="mb-10 pb-4 border-b border-[#1a1a1a]">
      <div className="flex gap-2 overflow-x-auto">
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => onFilterChange(tag)}
            className={`px-3 py-1.5 text-sm rounded-lg whitespace-nowrap cursor-pointer transition ${
              activeFilter === tag
                ? 'bg-white text-[#101011]'
                : 'bg-[#1a1a1a] text-neutral-400 hover:bg-[#252525] hover:text-white'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}