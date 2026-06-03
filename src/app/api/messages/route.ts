import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import api from '../../../services/api';

// Force dynamic route to prevent static analysis during build
export const dynamic = 'force-dynamic';

// Input Zod Validation Schema
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
  phone: z.string().optional().or(z.literal('')),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Zod Validation
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.issues[0].message },
        { status: 400 }
      );
    }

    // 2. Call Backend API
    const response = await api.post('/messages', result.data);
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    console.error('Contact API error:', err);
    return NextResponse.json(
      {
        success: false,
        message: 'An internal error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const response = await api.get('/messages');
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    console.error('Messages API error:', err);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch messages',
      },
      { status: 500 }
    );
  }
}

