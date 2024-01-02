import { clientUnauthedApiResponse } from '@/lib/auth/user-auth-checker';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import {
  AFTER_COMMA_SUFFIX,
  SizeGETResponse,
  SizeQueryType,
} from './size-route.types';
import { sizeSchema } from '@/schema/size.schema';

export async function GET(req: NextRequest) {
  try {
    const queryType: SizeQueryType =
      !req.nextUrl.searchParams.get('type') ||
      (req.nextUrl.searchParams.get('type') !== 'after-comma' &&
        req.nextUrl.searchParams.get('type') !== 'before-comma')
        ? 'before-comma'
        : (req.nextUrl.searchParams.get('type') as SizeQueryType);

    await clientUnauthedApiResponse();

    const sizeList = await prisma.size.findMany({
      where: {
        softDelete: null,
        afterCommaPairId: queryType === 'after-comma' ? null : { not: null },
      },
    });

    return NextResponse.json<SizeGETResponse>(
      { data: sizeList },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal untuk mengambil data karyawan!' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await clientUnauthedApiResponse();

    const sizeBody = await req.json();
    const parsingResult = await sizeSchema.safeParseAsync(sizeBody);

    if (!parsingResult.success) {
      return NextResponse.json(
        { message: 'Data body yang diberikan tidak valid!' },
        { status: 400 },
      );
    }

    const { data: sizeData } = parsingResult;

    const beforeCommaId = crypto.randomUUID();
    const afterCommaId = crypto.randomUUID();

    await prisma.size.createMany({
      data: [
        {
          id: afterCommaId,
          nama: `${sizeData.nama}${AFTER_COMMA_SUFFIX}`,
          harga: sizeData.hargaAfterComma,
        },
        {
          id: beforeCommaId,
          nama: sizeData.nama,
          afterCommaPairId: afterCommaId,
          harga: sizeData.hargaBeforeComma,
        },
      ],
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal untuk mengambil data karyawan!' },
      { status: 500 },
    );
  }
}
