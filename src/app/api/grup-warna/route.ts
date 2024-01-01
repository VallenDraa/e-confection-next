import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { prisma } from '@/lib/prisma';
import { GrupWarnaGETResponse } from './group-warna-route.types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const seriProduksiId = searchParams.get('seriProduksiId');
    const parseResult = await z.string().safeParseAsync(seriProduksiId);

    if (!parseResult.success) {
      return NextResponse.json(
        { message: 'Data body yang diberikan tidak valid!' },
        { status: 400 },
      );
    }

    const { data: parsedSeriProduksiId } = parseResult;

    const grupWarnaList = await prisma.grupWarnaBaju.findMany({
      where: { seriProduksiId: parsedSeriProduksiId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json<GrupWarnaGETResponse>(
      { data: grupWarnaList },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal untuk memuat data rekap gaji!' },
      { status: 500 },
    );
  }
}
