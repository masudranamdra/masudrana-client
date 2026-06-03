import { NextRequest, NextResponse } from 'next/server';
import api from '../../../../services/api';

// Force dynamic route to prevent static analysis during build
export const dynamic = 'force-dynamic';

const validKind = (kind: string): kind is 'images' | 'videos' => kind === 'images' || kind === 'videos';

export async function GET(request: NextRequest, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (!validKind(kind)) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  
  try {
    const response = await api.get(`/gallery/${kind}`);
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    console.error(`GET /gallery/${kind} error:`, err);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch gallery items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (!validKind(kind)) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  
  try {
    const body = await request.json();
    const response = await api.post(`/gallery/${kind}`, body);
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    console.error(`POST /gallery/${kind} error:`, err);
    return NextResponse.json(
      { success: false, message: 'Failed to create gallery item' },
      { status: 500 }
    );
  }
}
