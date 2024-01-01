import { clientUnauthedApiResponse } from '@/lib/auth/user-auth-checker';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { SeriProduksiGETResponse } from './seri-produksi-route.types';
import { newSeriProduksiSchema } from '@/schema/seri-produksi.schema';

export async function GET(req: { query: { page: string; size: string } }) {
  try {
    await clientUnauthedApiResponse();

    const page = Number(req.query?.page ?? 1);
    const size = Number(req.query?.size ?? 15);

    const totalData = await prisma.seriProduksi.count();
    const totalPages = Math.ceil(totalData / size) || 1;

    const seriProduksiData = await prisma.seriProduksi.findMany({
      skip: (page - 1) * size,
      take: size,
      include: {
        grupWarnaBaju: { include: { baju: true } },
      },
    });

    return NextResponse.json<SeriProduksiGETResponse>(
      {
        data: seriProduksiData,
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
      { message: 'Gagal untuk mengambil data seri produksi!' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const seriProduksi = await req.json();

    const seriParsingResult =
      await newSeriProduksiSchema.safeParseAsync(seriProduksi);

    if (!seriParsingResult.success) {
      return NextResponse.json(
        { message: 'Data body yang diberikan tidak valid!' },
        { status: 400 },
      );
    }

    const { data: parsedSeriProduksi } = seriParsingResult;

    await prisma.$transaction([
      prisma.seriProduksi.create({
        data: {
          id: parsedSeriProduksi.id,
          nomorSeri: parsedSeriProduksi.nomorSeri,
          nama: parsedSeriProduksi.nama,
        },
      }),
      prisma.grupWarnaBaju.createMany({
        data: parsedSeriProduksi.grupWarnaList,
      }),
      prisma.rekapGajiKaryawan.createMany({
        data: parsedSeriProduksi.rekapGajiList,
      }),
      prisma.baju.createMany({ data: parsedSeriProduksi.bajuList }),
    ]);

    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal menambahkan data seri produksi baru!' },
      { status: 500 },
    );
  }
}
