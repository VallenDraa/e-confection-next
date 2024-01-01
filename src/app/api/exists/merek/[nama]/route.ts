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

    const data = await prisma.merek.count({ where: { nama } });

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
