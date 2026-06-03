import { NextRequest, NextResponse } from 'next/server';
import api from '../../../../services/api';
import type { ResourceName } from '../../../../types/content';

// Force dynamic route to prevent static analysis during build
export const dynamic = 'force-dynamic';

const resources = ['projects', 'blogs', 'skills', 'testimonials', 'activities', 'articles', 'messages', 'documents', 'config'];

const validResource = (resource: string): resource is ResourceName => resources.includes(resource);

export async function GET(request: NextRequest, { params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await params;
  if (!validResource(resource)) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  
  try {
    const response = await api.get(`/${resource}/${id}`);
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    console.error(`GET /${resource}/${id} error:`, err);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch resource' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await params;
  if (!validResource(resource)) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  
  try {
    const body = await request.json();
    const response = await api.put(`/${resource}/${id}`, body);
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    console.error(`PUT /${resource}/${id} error:`, err);
    return NextResponse.json(
      { success: false, message: 'Failed to update resource' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await params;
  if (!validResource(resource)) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  
  try {
    const response = await api.delete(`/${resource}/${id}`);
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    console.error(`DELETE /${resource}/${id} error:`, err);
    return NextResponse.json(
      { success: false, message: 'Failed to delete resource' },
      { status: 500 }
    );
  }
}
