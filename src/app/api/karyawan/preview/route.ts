import { clientUnauthedApiResponse } from '@/lib/auth/user-auth-checker';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { KaryawanPreviewGETResponse } from './karyawan-preview-route.types';

export async function GET() {
  try {
    await clientUnauthedApiResponse();

    const karyawanPreviewData = await prisma.karyawan.findMany({
      where: { softDelete: null },
      orderBy: { nama: 'desc' },
      select: { id: true, nama: true, telepon: true },
    });

    return NextResponse.json<KaryawanPreviewGETResponse>(
      { data: karyawanPreviewData },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal untuk mengambil data karyawan!' },
      { status: 500 },
    );
  }
}
