ALTER TABLE "Post" ADD COLUMN "archiveYear" INTEGER;

-- IEEE conference publication years (document IDs 10731013, 10463246, 10502684).
UPDATE "Post" SET "archiveYear" = 2024
WHERE "slug" IN (
  'nestedvgg-a-novel-deep-learning-based-architecture-for-brain-tumour-diagnosis',
  'revolutionizing-pandemic-healthcare-mask-detection-and-patient-face-recognition',
  'combining-focal-loss-with-cross-entropy-loss-for-pneumonia-classification-with-a-weighted-sampling-approach'
);

-- GitHub repository creation years for the existing project entries.
UPDATE "Post" SET "archiveYear" = 2025
WHERE "slug" IN ('zapp', 'collabdraw', 'notra', 'chatterstack');
