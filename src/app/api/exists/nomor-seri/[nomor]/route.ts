import { prisma } from '@/lib/prisma';
import { zodNumericString } from '@/schema/helper';
import { NextRequest, NextResponse } from 'next/server';
import { NomorSeriExistsGETResponse } from './nomor-seri-exists.types';

export async function GET(
  req: NextRequest,
  { params }: { params: { nomor: string } },
) {
  try {
    const { nomor } = params;

    const parsingResult = await zodNumericString.safeParseAsync(nomor);

    if (!parsingResult.success) {
      return NextResponse.json(
        { message: 'Nomor seri tidak valid!' },
        { status: 400 },
      );
    }

    const nomorSeri = parsingResult.data;
    const data = await prisma.seriProduksi.count({ where: { nomorSeri } });

    return NextResponse.json<NomorSeriExistsGETResponse>(
      { data: data > 0 },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal untuk mengecek nomor seri!' },
      { status: 500 },
    );
  }
}
