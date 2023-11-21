import { NextResponse } from 'next/server';
import { clientUnauthedApiResponse } from '@/lib/auth/user-auth-checker';
import { prisma } from '@/lib/prisma';
import { benangSchemaWithoutId } from '@/store/benang';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const GET = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
  clientUnauthedApiResponse();

  const { id } = params;

  if (id === undefined || id === null) {
    return NextResponse.json(
      { message: 'Invalid id, cannot process request!' },
      { status: 400 },
    );
  }

  try {
    const benang = await prisma.benang.findFirst({
      where: { id },
    });

    return NextResponse.json({ benang }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Fail to get Benang data!' },
      { status: 500 },
    );
  }
};

export const PUT = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
  clientUnauthedApiResponse();

  const { id } = params;

  console.log({ id });

  const updatedBenang = await req.json();
  const parsedBenang =
    await benangSchemaWithoutId.safeParseAsync(updatedBenang);

  if (!parsedBenang.success) {
    return NextResponse.json(
      { message: 'Invalid Benang value!' },
      { status: 400 },
    );
  }

  const { quantity, color } = parsedBenang.data;

  try {
    await prisma.benang.update({
      where: { id },
      data: { quantity, color },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          message:
            "Can't find Benang from the given id. Fail to update Benang!",
        },
        { status: 400 },
      );
    } else {
      return NextResponse.json(
        { message: 'Fail to update Benang!' },
        { status: 400 },
      );
    }
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
  clientUnauthedApiResponse();

  const { id } = params;

  if (typeof id !== 'string' || id.trim() === '') {
    return NextResponse.json(
      { message: 'Invalid Benang id, cannot process request!' },
      { status: 400 },
    );
  }

  try {
    await prisma.benang.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Fail to delete Benang!' },
      { status: 500 },
    );
  }
};
