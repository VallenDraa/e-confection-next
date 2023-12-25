import { clientUnauthedApiResponse } from '@/lib/auth/user-auth-checker';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { WarnaGETResponse } from './warna-route.types';
import { warnaSchema } from '@/schema/warna.schema';

export async function GET() {
  try {
    await clientUnauthedApiResponse();

    const warnaList = await prisma.warna.findMany({
      where: { softDelete: null },
    });

    return NextResponse.json<WarnaGETResponse>(
      { data: warnaList },
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

    const warnaBody = await req.json();
    const parsingResult = await warnaSchema.safeParseAsync(warnaBody);

    if (!parsingResult.success) {
      return NextResponse.json(
        { message: 'Data body yang diberikan tidak valid!' },
        { status: 400 },
      );
    }

    const { data: warnaData } = parsingResult;
    const hasExists = await prisma.warna.count({
      where: { nama: warnaData.nama },
    });

    if (hasExists) {
      return NextResponse.json(
        { message: 'Warna sudah ada!' },
        { status: 400 },
      );
    }

    await prisma.warna.create({ data: warnaData });
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal untuk mengambil data karyawan!' },
      { status: 500 },
    );
  }
}
