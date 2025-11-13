import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

// Check if secret is available (for debugging)
const secret = process.env.UPLOADTHING_SECRET;
if (!secret) {
  console.warn(
    "⚠️ UPLOADTHING_SECRET is not set. UploadThing may not work correctly."
  );
}

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // For now, let's simplify to test if UploadThing works at all
      // Extract token from Authorization header
      const authHeader = req.headers.get("authorization");
      const token = authHeader?.replace("Bearer ", "");

      // Temporarily allow uploads without auth to test
      // Remove this after confirming UploadThing works
      if (!token) {
        console.warn("No token provided, but allowing upload for testing");
        return { userId: "anonymous" };
      }

      // Validate token and get user ID
      try {
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
        const response = await fetch(`${API_BASE_URL}/user/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new UploadThingError("Unauthorized - Invalid token");
        }

        const user = await response.json();
        return { userId: user.id };
      } catch (error) {
        if (error instanceof UploadThingError) {
          throw error;
        }
        console.error("Token validation error:", error);
        // For testing, allow anonymous uploads
        return { userId: "anonymous" };
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
