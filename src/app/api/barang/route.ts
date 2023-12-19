import { prisma } from '@/lib/prisma';
import { SeriProduksiSchema } from '@/schema/baju.schema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { seriProduksi, grupWarnaBaju } = await req.json();

    const seriParsingResult =
      await SeriProduksiSchema.safeParseAsync(seriProduksi);

    if (!seriParsingResult.success) {
      return NextResponse.json(
        { message: 'Data body yang diberikan tidak valid!' },
        { status: 400 },
      );
    }

    // Create new Seri entry
    const { data: seriProduksiData } = seriParsingResult;
    await prisma.seriProduksi.create({ data: seriProduksiData });

    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal menambahkan data baju baru!' },
      { status: 500 },
    );
  }
}
