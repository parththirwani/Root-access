import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/src/lib/authWrapper';
import { uploadToCloudinary } from '@/src/lib/cloudinary';

async function postHandler(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { message: 'No image provided' },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(image);

    return NextResponse.json(
      { 
        message: 'Image uploaded successfully',
        url: result.url,
        publicId: result.publicId
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { message: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(postHandler);