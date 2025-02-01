import { H3Event } from "h3";
import { verifyAccessToken, verifyRefreshToken, generateTokens } from "../utils/jwt";
import { can, getConditions } from "../utils/permissions";
import type { User } from "@prisma/client";
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event: H3Event) => {
  const publicRoutes = [
    "/api/auth/",
    "/api/uploadthing",
    "/api/public/",
  ];
  if (
    !event.path.startsWith("/api/") ||
    publicRoutes.some((route) => event.path.includes(route))
  ) {
    return;
  }

  try {
    const token = event.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      throw new Error("No token provided");
    }

    try {
      // First try to verify the access token
      const payload = verifyAccessToken(token);
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Add auth context for downstream handlers
      event.context.auth = {
        user,
        can: async (resource: string, operation: string, data?: any) =>
          await can(user, resource as any, operation as any, data),
        getConditions: (resource: string) => getConditions(user, resource as any),
      };
    } catch (error) {
      // If access token verification fails, try refresh token
      if (error instanceof jwt.TokenExpiredError) {
        const refreshToken = getCookie(event, 'refresh_token');
        
        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        // Verify refresh token and get user data
        const payload = await verifyRefreshToken(refreshToken);
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
        });

        if (!user) {
          throw new Error("User not found");
        }

        // Generate new tokens
        const tokens = await generateTokens({
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        });

        // Set new tokens
        setCookie(event, 'refresh_token', tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        // Set the new access token in response header
        appendHeader(event, 'X-New-Access-Token', tokens.accessToken);

        // Add auth context for downstream handlers
        event.context.auth = {
          user,
          can: async (resource: string, operation: string, data?: any) =>
            await can(user, resource as any, operation as any, data),
          getConditions: (resource: string) => getConditions(user, resource as any),
        };
      } else {
        throw error; // Re-throw if it's not a token expiration error
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: 401,
      message: error.message || "Unauthorized",
    });
  }
});
