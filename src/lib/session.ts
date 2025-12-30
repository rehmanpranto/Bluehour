import { cookies } from 'next/headers';

export async function getLoggedInUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  return userId && userId.length > 0 ? userId : null;
}
