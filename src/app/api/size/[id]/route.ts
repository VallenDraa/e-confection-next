import { clientUnauthedApiResponse } from '@/lib/auth/user-auth-checker';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { SizeBody } from '../size-route.types';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await clientUnauthedApiResponse();
    const { id } = params;

    const body = await req.json();
    const bodySchema: z.ZodType<SizeBody> = z.object({
      nama: z.string(),
      harga: z.number(),
      softDelete: z.date().nullable(),
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

    const { data: sizeData } = bodyParsingResult;
    const { data: parsedId } = idParsingResult;

    await prisma.size.update({
      where: { id: parsedId },
      data: {
        nama: sizeData.nama,
        harga: sizeData.harga,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal menghapus data size!' },
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
    await prisma.size.update({
      where: { id: parsedId },
      data: { softDelete: new Date() },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal menghapus data size!' },
      { status: 500 },
    );
  }
}
