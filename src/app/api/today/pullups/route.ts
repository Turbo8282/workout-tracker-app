// app/api/today/pullups/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { options as authOptions } from '@/app/api/auth/[...nextauth]/options'; // Update the path to your NextAuthOptions
export async function GET() {
  try {
    const result = await query('SELECT SUM(repetitions) FROM workout_log WHERE workout_date = CURRENT_DATE AND exercise = $1', ['Pullups']);
    return NextResponse.json(result.rows); // Send the workouts as JSON
  } catch (error) {
    console.error('Error fetching today\'s pullups count:', error);
    return NextResponse.json({ error: 'Failed to fetch pullups count' }, { status: 500 });
  }
}
