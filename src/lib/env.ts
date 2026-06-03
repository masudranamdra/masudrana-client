import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url('NEXT_PUBLIC_API_BASE_URL must be a valid URL'),
  NEXT_PUBLIC_SITE_URL: z.string().url('NEXT_PUBLIC_SITE_URL must be a valid URL').optional(),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().min(1, 'NEXT_PUBLIC_GOOGLE_CLIENT_ID must not be empty'),
});

const envData = {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
};

let validatedEnv = {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || '',
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
};

try {
  const result = envSchema.parse(envData);
  validatedEnv = {
    NEXT_PUBLIC_API_BASE_URL: result.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_SITE_URL: result.NEXT_PUBLIC_SITE_URL || '',
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: result.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  };
} catch (error) {
  // Only log detailed errors on the server-side to avoid exposing details in browser console
  if (typeof window === 'undefined') {
    console.error('⚠️ Warning: Frontend Environment variables validation failed:');
    if (error instanceof z.ZodError) {
      error.issues.forEach((err) => {
        console.error(`   - ${err.path.join('.')}: ${err.message}`);
      });
    }
  }
}

export const env = validatedEnv;
