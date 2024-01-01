import { RekapGajiGETResponse } from '../../rekap-gaji-route.types';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { grupWarnaBajuId: string } },
) {
  try {
    const { grupWarnaBajuId } = params;

    const rekapGajiList = await prisma.rekapGajiKaryawan.findMany({
      where: { grupWarnaBajuId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json<RekapGajiGETResponse>(
      { data: rekapGajiList },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal untuk memuat data rekap gaji!' },
      { status: 500 },
    );
  }
}
