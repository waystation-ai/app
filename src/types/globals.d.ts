import { ALL_ROLES } from "@/collections/lib/constants";

export {};

export type Role = (typeof ALL_ROLES)[number];

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      roles?: Role[];
    };
  }
}
