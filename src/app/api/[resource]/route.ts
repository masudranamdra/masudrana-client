import { NextRequest, NextResponse } from 'next/server';
import api from '../../../services/api';
import type { ResourceName } from '../../../types/content';

// Force dynamic route to prevent static analysis during build
export const dynamic = 'force-dynamic';

const resources = ['projects', 'blogs', 'skills', 'testimonials', 'activities', 'articles', 'messages', 'documents', 'config'];

const validResource = (resource: string): resource is ResourceName => resources.includes(resource);

export async function GET(request: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!validResource(resource)) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  
  try {
    const response = await api.get(`/${resource}`);
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    console.error(`GET /${resource} error:`, err);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch resource' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!validResource(resource)) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  
  try {
    const body = await request.json();
    const response = await api.post(`/${resource}`, body);
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    console.error(`POST /${resource} error:`, err);
    return NextResponse.json(
      { success: false, message: 'Failed to create resource' },
      { status: 500 }
    );
  }
}
