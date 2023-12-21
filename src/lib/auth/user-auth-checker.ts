import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { authOptions } from '.';

export const clientUnauthedRedirect = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/sign-in');
  }
};

export const clientUnauthedApiResponse = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: 'Unauthorized request!' },
      { status: 401 },
    );
  }
};

export const clientUnauthedServerAction = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error('Unauthorized action!');
  }
};
