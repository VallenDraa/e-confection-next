import { RekapGajiGETPaginatedResponse } from '../../rekap-gaji-route.types';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { prisma } from '@/lib/prisma';
import { searchParamsExtractor } from '@/lib/api';

export async function GET(
  req: NextRequest,
  { params }: { params: { karyawanId: string } },
) {
  try {
    const { karyawanId } = params;
    const { searchParams } = req.nextUrl;

    const searchQuery = searchParamsExtractor(searchParams, ['page', 'size']);

    const parseResult = await z
      .object({ page: z.number(), size: z.number() })
      .safeParseAsync({
        page: Number(searchQuery.page ?? 1),
        size: Number(searchQuery.size ?? 6),
      });

    if (!parseResult.success) {
      return NextResponse.json(
        { message: 'Data body yang diberikan tidak valid!' },
        { status: 400 },
      );
    }

    const {
      data: { page, size },
    } = parseResult;

    const totalData = await prisma.rekapGajiKaryawan.count({
      where: { karyawanId },
    });

    const totalPages = Math.ceil(totalData / size) || 1;

    const rekapGajiList = await prisma.rekapGajiKaryawan.findMany({
      where: { karyawanId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * size,
      take: size,
    });

    return NextResponse.json<RekapGajiGETPaginatedResponse>(
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
