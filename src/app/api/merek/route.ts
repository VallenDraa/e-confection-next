import { clientUnauthedApiResponse } from '@/lib/auth/user-auth-checker';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { MerekGETResponse } from './merek-route.types';
import { merekSchema } from '@/schema/merek.schema';

export async function GET() {
  try {
    await clientUnauthedApiResponse();

    const merekList = await prisma.merek.findMany({
      where: { softDelete: null },
    });

    return NextResponse.json<MerekGETResponse>(
      { data: merekList },
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

    const merekBody = await req.json();
    const parsingResult = await merekSchema.safeParseAsync(merekBody);

    if (!parsingResult.success) {
      return NextResponse.json(
        { message: 'Data body yang diberikan tidak valid!' },
        { status: 400 },
      );
    }

    const { data: merekData } = parsingResult;
    const hasExists = await prisma.merek.count({
      where: { nama: merekData.nama },
    });

    if (hasExists) {
      return NextResponse.json(
        { message: 'Merek sudah ada!' },
        { status: 400 },
      );
    }

    await prisma.merek.create({ data: merekData });
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal untuk mengambil data karyawan!' },
      { status: 500 },
    );
  }
}
