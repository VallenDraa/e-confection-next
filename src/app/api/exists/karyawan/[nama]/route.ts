import { prisma } from '@/lib/prisma';
import * as z from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { ExistsGETResponse } from '../../exists.types';

export async function GET(
  req: NextRequest,
  { params }: { params: { nama: string } },
) {
  try {
    const { nama } = params;

    const parsingResult = await z.string().safeParseAsync(nama);

    if (!parsingResult.success) {
      return NextResponse.json(
        { message: 'Nama karyawan tidak valid!' },
        { status: 400 },
      );
    }

    const namaKaryawan = parsingResult.data;
    const data = await prisma.karyawan.count({ where: { nama: namaKaryawan } });

    return NextResponse.json<ExistsGETResponse>(
      { data: data > 0 },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal untuk mengecek nama merek!' },
      { status: 500 },
    );
  }
}
