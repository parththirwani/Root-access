interface Subsection {
  id: string;
  name: string;
  slug: string;
}

interface SubsectionFilterProps {
  subsections: Subsection[];
  selectedSubsection: string;
  onChange: (slug: string) => void;
  postCounts: Record<string, number>;
  totalPosts: number;
}

export function SubsectionFilter({
  subsections,
  selectedSubsection,
  onChange,
  postCounts,
  totalPosts
}: SubsectionFilterProps) {
  return (
    <div className="mb-6">
      <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">
        Filter by Subsection
      </label>
      <select
        value={selectedSubsection}
        onChange={(e) => onChange(e.target.value)}
        className="w-full max-w-md px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-[14px] focus:outline-none focus:border-white transition"
      >
        <option value="">All Subsections ({totalPosts})</option>
        {subsections.map((sub) => {
          const count = postCounts[sub.slug] || 0;
          return (
            <option key={sub.id} value={sub.slug}>
              {sub.name} ({count})
            </option>
          );
        })}
      </select>
    </div>
  );
}