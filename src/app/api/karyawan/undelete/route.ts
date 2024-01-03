import { clientUnauthedApiResponse } from '@/lib/auth/user-auth-checker';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';

export async function PUT(req: NextRequest) {
  try {
    await clientUnauthedApiResponse();

    const { data } = await req.json();
    const parsingRes = await z.array(z.string()).safeParseAsync(data.ids);

    if (!parsingRes.success) {
      return NextResponse.json(
        { message: 'Data body yang diberikan tidak valid!' },
        { status: 400 },
      );
    }

    await prisma.karyawan.updateMany({
      where: { id: { in: parsingRes.data } },
      data: { softDelete: null },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal untuk menghapus karyawan!' },
      { status: 500 },
    );
  }
}
