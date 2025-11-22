/**
 * Standardized API response format for all endpoints
 * Ensures consistent response structure across the application
 */

import { NextResponse } from 'next/server';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
  timestamp: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Successful response wrapper
 */
export function successResponse<T>(
  data: T,
  message?: string,
  meta?: any
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
    meta,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Error response wrapper
 */
export function errorResponse(
  message: string,
  statusCode: number = 500,
  data?: any
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      data,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  );
}

/**
 * Validation error response
 */
export function validationError(
  message: string,
  data?: any
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      data,
      timestamp: new Date().toISOString(),
    },
    { status: 400 }
  );
}

/**
 * Unauthorized response
 */
export function unauthorizedResponse(): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      error: 'Unauthorized - Please authenticate',
      timestamp: new Date().toISOString(),
    },
    { status: 401 }
  );
}

/**
 * Forbidden response
 */
export function forbiddenResponse(): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      error: 'Forbidden - Access denied',
      timestamp: new Date().toISOString(),
    },
    { status: 403 }
  );
}

/**
 * Not found response
 */
export function notFoundResponse(): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      error: 'Not found',
      timestamp: new Date().toISOString(),
    },
    { status: 404 }
  );
}
