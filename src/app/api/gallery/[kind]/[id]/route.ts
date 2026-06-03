import { NextRequest, NextResponse } from 'next/server';
import api from '../../../../../services/api';

// Force dynamic route to prevent static analysis during build
export const dynamic = 'force-dynamic';

const validKind = (kind: string): kind is 'images' | 'videos' => kind === 'images' || kind === 'videos';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ kind: string; id: string }> }) {
  const { kind, id } = await params;
  if (!validKind(kind)) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  
  try {
    const body = await request.json();
    const response = await api.put(`/gallery/${kind}/${id}`, body);
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    console.error(`PUT /gallery/${kind}/${id} error:`, err);
    return NextResponse.json(
      { success: false, message: 'Failed to update gallery item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ kind: string; id: string }> }) {
  const { kind, id } = await params;
  if (!validKind(kind)) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  
  try {
    const response = await api.delete(`/gallery/${kind}/${id}`);
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    console.error(`DELETE /gallery/${kind}/${id} error:`, err);
    return NextResponse.json(
      { success: false, message: 'Failed to delete gallery item' },
      { status: 500 }
    );
  }
}
