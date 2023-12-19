import { prisma } from '@/lib/prisma';
import { KaryawanSchema } from '@/schema/karyawan.schema';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';

export async function GET(req: { query: { page: string; size: string } }) {
  try {
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 15;

    const totalData = await prisma.karyawan.count();
    const totalPages = Math.ceil(totalData / size);

    const karyawanData = await prisma.karyawan.findMany({
      skip: (page - 1) * size,
      take: size,
    });

    return NextResponse.json(
      {
        data: karyawanData,
        metadata: {
          prev: page > 1 ? page - 1 : null,
          current: page,
          next: page < totalPages ? page + 1 : null,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal untuk menambahkan karyawan!' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsingRes = await KaryawanSchema.safeParseAsync(body);
    if (!parsingRes.success) {
      return NextResponse.json(
        { message: 'Data body yang diberikan tidak valid!' },
        { status: 400 },
      );
    }

    await prisma.karyawan.create({ data: parsingRes.data });

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
    const body = await req.json();

    const parsingRes = await KaryawanSchema.safeParseAsync(body);
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
      data: { nama: parsingRes.data.nama },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal untuk menambahkan karyawan!' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const parsingRes = await z.string().cuid().safeParseAsync(body.id);

    if (!parsingRes.success) {
      return NextResponse.json(
        { message: 'Data body yang diberikan tidak valid!' },
        { status: 400 },
      );
    }

    await prisma.$transaction([
      prisma.rekapGajiKaryawan.deleteMany({
        where: { karyawanId: parsingRes.data },
      }),
      prisma.karyawan.delete({ where: { id: parsingRes.data } }),
    ]);
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal untuk menambahkan karyawan!' },
      { status: 500 },
    );
  }
}
