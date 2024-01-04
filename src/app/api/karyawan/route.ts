import * as z from 'zod';
import { clientUnauthedApiResponse } from '@/lib/auth/user-auth-checker';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { KaryawanGETResponse, KaryawanPUTBody } from './karyawan-route.types';
import v from 'validator';

export async function GET(req: NextRequest) {
  try {
    await clientUnauthedApiResponse();

    const page = Number(req.nextUrl.searchParams.get('page') || 1);
    const search = req.nextUrl.searchParams.get('search') || '';
    const size = Number(req.nextUrl.searchParams.get('size') || 6);

    const totalData = await prisma.karyawan.count({
      where: {
        softDelete: null,
      },
    });
    const totalPages = Math.ceil(totalData / size) || 1;

    const karyawanData = await prisma.karyawan.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        nama: { contains: search },
        softDelete: null,
      },
      skip: (page - 1) * size,
      take: size,
    });

    return NextResponse.json<KaryawanGETResponse>(
      {
        data: karyawanData,
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
    // eslint-disable-next-line no-console
    console.log('🚀 ~ file: route.ts:38 ~ GET ~ error:', error);
    return NextResponse.json(
      { message: 'Gagal untuk mengambil data karyawan!' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await clientUnauthedApiResponse();

    const body = await req.json();

    const parsingRes = await z
      .object({ nama: z.string(), telepon: z.string().refine(v.isMobilePhone) })
      .safeParseAsync(body);
    if (!parsingRes.success) {
      return NextResponse.json(
        { message: 'Data body yang diberikan tidak valid!' },
        { status: 400 },
      );
    }

    await prisma.karyawan.create({
      data: {
        nama: parsingRes.data.nama,
        telepon: parsingRes.data.telepon,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal untuk menambahkan karyawan!' },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await clientUnauthedApiResponse();

    const body = await req.json();
    const bodySchema: z.ZodType<KaryawanPUTBody> = z.object({
      id: z.string(),
      nama: z.string(),
      telepon: z.string().refine(v.isMobilePhone),
    });

    const parsingRes = await bodySchema.safeParseAsync(body);

    if (!parsingRes.success) {
      return NextResponse.json(
        { message: 'Data body yang diberikan tidak valid!' },
        { status: 400 },
      );
    }

    if (!parsingRes.data.id) {
      return NextResponse.json(
        { message: 'Data body yang diberikan tidak valid!' },
        { status: 400 },
      );
    }

    await prisma.karyawan.update({
      where: { id: parsingRes.data.id },
      data: { nama: parsingRes.data.nama, telepon: parsingRes.data.telepon },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal untuk mengedit karyawan!' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await clientUnauthedApiResponse();

    const data = await req.json();
    const parsingRes = await z.array(z.string()).safeParseAsync(data.ids);

    if (!parsingRes.success) {
      return NextResponse.json(
        { message: 'Data body yang diberikan tidak valid!' },
        { status: 400 },
      );
    }

    const softDelete = new Date();
    await prisma.karyawan.updateMany({
      where: { id: { in: parsingRes.data } },
      data: { softDelete },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal untuk menghapus karyawan!' },
      { status: 500 },
    );
  }
}
