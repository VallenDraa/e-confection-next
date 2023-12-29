import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { prisma } from '@/lib/prisma';
import { RekapGajiGETResponse } from '../rekap-gaji-route.types';

export async function GET(
  req: NextRequest,
  { params }: { params: { karyawanId: string } },
) {
  try {
    const { karyawanId } = params;

    const parseResult = await z.string().safeParseAsync(karyawanId);

    if (!parseResult.success) {
      return NextResponse.json(
        { message: 'Data body yang diberikan tidak valid!' },
        { status: 400 },
      );
    }

    const { data: parsedKaryawanId } = parseResult;

    const page = Number(req.nextUrl.searchParams.get('page') ?? 1);
    const size = Number(req.nextUrl.searchParams.get('size') ?? 6);

    const totalData = await prisma.rekapGajiKaryawan.count({
      where: { karyawanId: parsedKaryawanId },
    });
    const totalPages = Math.ceil(totalData / size) || 1;

    const rekapGajiList = await prisma.rekapGajiKaryawan.findMany({
      where: { karyawanId: parsedKaryawanId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * size,
      take: size,
    });

    return NextResponse.json<RekapGajiGETResponse>(
      {
        data: rekapGajiList,
        metadata: {
          prev: page > 1 ? page - 1 : 1,
          current: page,
          next: page < totalPages ? page + 1 : totalPages,
          last: totalPages,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal untuk memuat data rekap gaji!' },
      { status: 500 },
    );
  }
}
