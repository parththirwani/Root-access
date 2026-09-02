-- Revoke public API access to application tables.
REVOKE ALL PRIVILEGES ON TABLE
  "Admin",
  "Profile",
  "TopCategory",
  "Subsection",
  "Post",
  "Tag",
  "_PostToTag",
  "_prisma_migrations"
FROM anon, authenticated;

-- Enable Row Level Security on all tables.
ALTER TABLE "Admin" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TopCategory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subsection" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Post" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_PostToTag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;

-- Prevent future Prisma-created tables from being granted to public roles.
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;
