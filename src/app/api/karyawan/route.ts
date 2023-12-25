import * as z from 'zod';
import { clientUnauthedApiResponse } from '@/lib/auth/user-auth-checker';
import { prisma } from '@/lib/prisma';
import { KaryawanSchema } from '@/schema/karyawan.schema';
import { NextRequest, NextResponse } from 'next/server';
import { KaryawanGETResponse, KaryawanPUTBody } from './karyawan-route.types';
import v from 'validator';

export async function GET(req: { query: { page: string; size: string } }) {
  try {
    await clientUnauthedApiResponse();

    const page = Number(req.query?.page ?? 1);
    const size = Number(req.query?.size ?? 15);

    const totalData = await prisma.karyawan.count();
    const totalPages = Math.ceil(totalData / size) || 1;

    const karyawanData = await prisma.karyawan.findMany({
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

    const parsingRes = await KaryawanSchema.safeParseAsync(body);
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
      id: z.string().cuid(),
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
    const parsingRes = await z
      .array(z.string().cuid())
      .safeParseAsync(data.ids);

    if (!parsingRes.success) {
      return NextResponse.json(
        { message: 'Data body yang diberikan tidak valid!' },
        { status: 400 },
      );
    }

    await prisma.$transaction([
      prisma.rekapGajiKaryawan.deleteMany({
        where: { karyawanId: { in: parsingRes.data } },
      }),

      prisma.karyawan.deleteMany({ where: { id: { in: parsingRes.data } } }),
    ]);

    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal untuk menghapus karyawan!' },
      { status: 500 },
    );
  }
}
