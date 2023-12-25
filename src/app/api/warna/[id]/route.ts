import { clientUnauthedApiResponse } from '@/lib/auth/user-auth-checker';
import { prisma } from '@/lib/prisma';
import { warnaSchema } from '@/schema/warna.schema';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { WarnaBody } from '../warna-route.types';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await clientUnauthedApiResponse();
    const { id } = params;

    const body = await req.json();
    const bodySchema: z.ZodType<WarnaBody> = z.object({
      nama: z.string(),
      kodeWarna: z.string(),
    });

    const bodyParsingResult = await bodySchema.safeParseAsync(body);
    const idParsingResult = await z.string().cuid().safeParseAsync(id);

    if (!bodyParsingResult.success) {
      return NextResponse.json(
        { message: 'Data yang diberikan tidak valid!' },
        { status: 400 },
      );
    }

    if (!idParsingResult.success) {
      return NextResponse.json(
        { message: 'Data yang diberikan tidak valid!' },
        { status: 400 },
      );
    }

    const { data: warnaData } = bodyParsingResult;
    const { data: parsedId } = idParsingResult;

    await prisma.warna.update({
      where: { id: parsedId },
      data: {
        nama: warnaData.nama,
        kodeWarna: warnaData.kodeWarna,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal menghapus data warna!' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await clientUnauthedApiResponse();
    const { id } = params;

    const idParsingResult = await z.string().cuid().safeParseAsync(id);

    if (!idParsingResult.success) {
      return NextResponse.json(
        { message: 'Data yang diberikan tidak valid!' },
        { status: 400 },
      );
    }

    const { data: parsedId } = idParsingResult;
    await prisma.warna.update({
      where: { id: parsedId },
      data: { softDelete: new Date() },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal menghapus data warna!' },
      { status: 500 },
    );
  }
}
