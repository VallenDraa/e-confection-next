import { clientUnauthedApiResponse } from '@/lib/auth/user-auth-checker';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { IndividualSeriProduksiGETResponse } from '../seri-produksi-route.types';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await clientUnauthedApiResponse();
    const { id } = params;

    const seriProduksi = await prisma.seriProduksi.findUnique({
      where: { id },
    });

    return NextResponse.json<IndividualSeriProduksiGETResponse>(
      { data: seriProduksi },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal mengambil seri produksi!' },
      { status: 500 },
    );
  }
}
