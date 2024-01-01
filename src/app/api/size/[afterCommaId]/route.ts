import { clientUnauthedApiResponse } from '@/lib/auth/user-auth-checker';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { AFTER_COMMA_SUFFIX, SizeBody } from '../size-route.types';

export async function PUT(
  req: NextRequest,
  { params }: { params: { afterCommaId: string } },
) {
  try {
    await clientUnauthedApiResponse();
    const { afterCommaId } = params;

    const body = await req.json();
    const bodySchema: z.ZodType<SizeBody> = z.object({
      nama: z.string(),
      hargaBeforeComma: z.number(),
      hargaAfterComma: z.number(),
      softDelete: z.date().nullable(),
    });

    const bodyParsingResult = await bodySchema.safeParseAsync(body);
    const idParsingResult = await z.string().safeParseAsync(afterCommaId);

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
    const { data: parsedAfterCommaId } = idParsingResult;

    const afterCommaSize = await prisma.size.findUnique({
      where: { id: parsedAfterCommaId },
      select: { afterComma: { select: { id: true } } },
    });

    if (!afterCommaSize?.afterComma?.id) {
      return NextResponse.json(
        { message: 'Gagal mengubah data size!' },
        { status: 500 },
      );
    }

    await prisma.$transaction([
      // Update the price for size after comma
      prisma.size.update({
        where: { id: parsedAfterCommaId },
        data: {
          nama: sizeData.nama,
          harga: sizeData.hargaBeforeComma,
        },
      }),

      // Update the price for size after comma
      prisma.size.update({
        where: { id: afterCommaSize.afterComma.id },
        data: {
          nama: `${sizeData.nama}${AFTER_COMMA_SUFFIX}`,
          harga: sizeData.hargaAfterComma,
        },
      }),
    ]);

    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal mengubah data size!' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { afterCommaId: string } },
) {
  try {
    await clientUnauthedApiResponse();
    const { afterCommaId } = params;

    const idParsingResult = await z.string().safeParseAsync(afterCommaId);

    if (!idParsingResult.success) {
      return NextResponse.json(
        { message: 'Data yang diberikan tidak valid!' },
        { status: 400 },
      );
    }

    const { data: parsedAfterCommaId } = idParsingResult;
    const afterCommaSize = await prisma.size.findUnique({
      where: { id: parsedAfterCommaId },
      select: { afterComma: { select: { id: true } } },
    });

    if (!afterCommaSize?.afterComma?.id) {
      return NextResponse.json(
        { message: 'Gagal menghapus data size!' },
        { status: 500 },
      );
    }

    const deletedTime = new Date();
    await prisma.$transaction([
      prisma.size.update({
        where: { id: parsedAfterCommaId },
        data: { softDelete: deletedTime },
      }),
      prisma.size.update({
        where: { id: afterCommaSize.afterComma.id },
        data: { softDelete: deletedTime },
      }),
    ]);
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal menghapus data size!' },
      { status: 500 },
    );
  }
}
