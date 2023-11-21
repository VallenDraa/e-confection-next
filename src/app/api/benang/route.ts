import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { clientUnauthedApiResponse } from '@/lib/auth/user-auth-checker';
import { benangSchemaWithoutId } from '@/store/benang';

export const GET = async (req: Request) => {
  clientUnauthedApiResponse();

  const ITEM_PER_PAGE = 2;

  const searchParams = new URL(req.url).searchParams;
  const page = parseInt(searchParams.get('page') ?? '1');

  if (isNaN(page)) {
    return NextResponse.json(
      { message: 'Invalid page, cannot process request!' },
      { status: 400 },
    );
  }

  try {
    const benang = await prisma.benang.findMany({
      skip: ITEM_PER_PAGE * (page - 1),
      take: ITEM_PER_PAGE,
    });

    const benangQty = await prisma.benang.count();
    const totalPages = Math.ceil(benangQty / ITEM_PER_PAGE);

    return NextResponse.json(
      { benang, meta: { currentPage: page, totalPages: totalPages || 1 } },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Fail to get Benang data!' },
      { status: 500 },
    );
  }
};

export const POST = async (req: Request) => {
  clientUnauthedApiResponse();

  const newBenangData = await req.json();
  const parsedBenang =
    await benangSchemaWithoutId.safeParseAsync(newBenangData);

  if (!parsedBenang.success) {
    return NextResponse.json(
      { message: 'Invalid new Benang value!' },
      { status: 400 },
    );
  }

  try {
    const newBenang = await prisma.benang.create({ data: parsedBenang.data });

    return NextResponse.json({ benang: newBenang }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Fail to create a new Benang!' },
      { status: 500 },
    );
  }
};
