import { Post } from '@/src/types';

interface PostListItemProps {
  post: Post;
  onTogglePublish: (post: Post) => void;
  onDelete: (post: Post) => void;
}

export function PostListItem({ post, onTogglePublish, onDelete }: PostListItemProps) {
  const getDisplayStyleBadge = (style: string) => {
    const styles: Record<string, { bg: string; text: string; label: string }> = {
      'BLOG': { bg: 'bg-blue-950/50', text: 'text-blue-400', label: '📝 Blog' },
      'PROJECT': { bg: 'bg-purple-950/50', text: 'text-purple-400', label: '🚀 Project' },
      'TITLE_ONLY': { bg: 'bg-gray-950/50', text: 'text-gray-400', label: '📌 Title' },
      'blog': { bg: 'bg-blue-950/50', text: 'text-blue-400', label: '📝 Blog' },
      'project': { bg: 'bg-purple-950/50', text: 'text-purple-400', label: '🚀 Project' },
      'title_only': { bg: 'bg-gray-950/50', text: 'text-gray-400', label: '📌 Title' },
    };
    const s = styles[style] || styles['BLOG'];
    return (
      <span className={`px-2 py-0.5 rounded text-[11px] ${s.bg} ${s.text}`}>
        {s.label}
      </span>
    );
  };

  return (
    <div className="bg-[#101010] p-5 rounded-xl border border-[#1a1a1a] hover:border-[#2a2a2a] transition">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="text-[15px] text-white font-medium truncate">{post.title}</h3>
            {getDisplayStyleBadge(post.subsection.displayStyle)}
            <span
              className={`px-2 py-0.5 rounded text-[11px] shrink-0 ${
                post.published
                  ? 'bg-green-950/50 text-green-400'
                  : 'bg-[#1a1a1a] text-[#707070]'
              }`}
            >
              {post.published ? 'Published' : 'Draft'}
            </span>
          </div>
          <div className="text-[13px] text-[#707070] mb-1">
            {post.subsection.name} • {post.views} views
            {post.subsection.displayStyle === 'PROJECT' && post.projectLink && (
              <span className="ml-2">
                • <a href={post.projectLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View Project →</a>
              </span>
            )}
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 bg-[#1a1a1a] text-[#707070] rounded text-[11px]"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onTogglePublish(post)}
            className="text-[13px] text-[#707070] hover:text-white transition"
          >
            {post.published ? 'Unpublish' : 'Publish'}
          </button>
          <button
            onClick={() => onDelete(post)}
            className="text-[13px] text-red-400 hover:text-red-300 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}