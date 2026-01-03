import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "./auth";

type Handler = (
  req: NextRequest,
  context?: any
) => Promise<NextResponse> | NextResponse;

export function withAuth(handler: Handler) {
  return async (req: NextRequest, context?: any) => {
    const session = await getServerSession(req);

    if (!session || !session.userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Attach session to request for use in handler
    (req as any).session = session;

    return handler(req, context);
  };
}