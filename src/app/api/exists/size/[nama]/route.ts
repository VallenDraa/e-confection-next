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
    const data = await prisma.size.count({
      where: { nama, softDelete: null },
    });

    return NextResponse.json<ExistsGETResponse>(
      { data: data > 0 },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal untuk mengecek size!' },
      { status: 500 },
    );
  }
}
