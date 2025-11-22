/**
 * Common middleware functions for API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger';
import { validationError, unauthorizedResponse } from './api-response';
import { ZodError, ZodSchema } from 'zod';

/**
 * Validate request body against a Zod schema
 */
export async function validateRequest<T>(
  req: NextRequest,
  schema: ZodSchema
): Promise<{ data: T } | { error: NextResponse }> {
  try {
    const body = await req.json();
    const validated = schema.parse(body);
    return { data: validated as T };
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join('; ');
      logger.warn('Validation error', message);
      return { error: validationError(message) };
    }
    logger.error('Request parsing error', error);
    return { error: validationError('Invalid request format') };
  }
}

/**
 * Validate CORS and add CORS headers
 */
export function withCORS(request: NextRequest): NextResponse | null {
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }
  return null;
}

/**
 * Add CORS headers to response
 */
export function addCORSHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

/**
 * Validate query parameters
 */
export function getQueryParam(
  request: NextRequest,
  param: string,
  defaultValue?: string
): string | undefined {
  const { searchParams } = new URL(request.url);
  return searchParams.get(param) || defaultValue;
}

/**
 * Get numeric query parameter with validation
 */
export function getNumericQueryParam(
  request: NextRequest,
  param: string,
  defaultValue: number = 0,
  max?: number
): number {
  const value = getQueryParam(request, param);
  if (!value) return defaultValue;
  
  const num = parseInt(value, 10);
  if (isNaN(num)) {
    logger.warn(`Invalid numeric parameter: ${param}=${value}`);
    return defaultValue;
  }
  
  if (max !== undefined && num > max) {
    return max;
  }
  
  return Math.max(0, num); // Ensure non-negative
}

/**
 * Wrap handler with error handling
 */
export function withErrorHandling(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(req);
    } catch (error) {
      logger.error('Handler error', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Internal server error',
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }
  };
}
