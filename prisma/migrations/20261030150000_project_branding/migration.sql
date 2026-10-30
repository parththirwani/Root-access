UPDATE "Post" SET "coverImage" = '/projects/chatterstack.png' WHERE "slug" = 'chatterstack';
UPDATE "Post" SET "coverImage" = '/projects/mimir.png' WHERE "slug" = 'mimir';
UPDATE "Post" SET "coverImage" = '/projects/newshog.png' WHERE "slug" = 'newshog';

INSERT INTO "Post" (
  "id", "title", "slug", "description", "content", "excerpt", "coverImage",
  "published", "publishedAt", "archiveYear", "subsectionId", "projectLink",
  "metaTitle", "metaDescription", "createdAt", "updatedAt"
)
SELECT
  'project-runes-ai-2026', 'Runes AI', 'runes-ai',
  'A Markdown and LaTeX writing workspace with PDF compilation and AI prose suggestions you review as diffs before applying.',
  '',
  'Write in Markdown or LaTeX, compile a PDF, and review AI prose suggestions before they change your document.',
  '/projects/runes-ai.png', true, CURRENT_TIMESTAMP, 2026, "id",
  'https://github.com/parththirwani/runes-ai',
  'Runes AI',
  'A Markdown and LaTeX writing workspace with PDF compilation and reviewable AI prose suggestions.',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Subsection" WHERE "slug" = 'projects'
ON CONFLICT ("slug") DO NOTHING;

UPDATE "Subsection" SET "postCount" = (
  SELECT COUNT(*) FROM "Post"
  WHERE "subsectionId" = "Subsection"."id" AND "published" = true
) WHERE "slug" = 'projects';
