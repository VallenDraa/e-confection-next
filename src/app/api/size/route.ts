import { clientUnauthedApiResponse } from '@/lib/auth/user-auth-checker';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { SizeGETResponse } from './size-route.types';
import { sizeSchema } from '@/schema/size.schema';

export async function GET() {
  try {
    await clientUnauthedApiResponse();

    const sizeList = await prisma.size.findMany({
      where: { softDelete: null },
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
    const hasExists = await prisma.size.count({
      where: { nama: sizeData.nama },
    });

    if (hasExists) {
      return NextResponse.json({ message: 'Size sudah ada!' }, { status: 400 });
    }

    await prisma.size.create({ data: sizeData });
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal untuk mengambil data karyawan!' },
      { status: 500 },
    );
  }
}
