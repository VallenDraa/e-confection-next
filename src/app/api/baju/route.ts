import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BajuGETResponse } from './baju-route.types';
import { searchParamsExtractor } from '@/lib/api';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    // route queries
    const searchQueries = searchParamsExtractor(searchParams, [
      'rekapGajiKaryawanId',
      'karyawanId',
      'sizeId',
      'grupWarnaBajuId',
      'merekId',
    ]);

    const bajuList = await prisma.baju.findMany({
      where: searchQueries,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json<BajuGETResponse>(
      { data: bajuList },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal untuk memuat data rekap gaji!' },
      { status: 500 },
    );
  }
}
