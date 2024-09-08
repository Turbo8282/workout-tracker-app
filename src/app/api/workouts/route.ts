// app/api/workouts/route.ts
import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';
import { getServerSession } from 'next-auth/next';
import { options as authOptions } from '@/app/api/auth/[...nextauth]/options'; // Update the path to your NextAuthOptions
export async function GET() {
  try {
    const result = await query('SELECT * FROM workout_log');
    return NextResponse.json(result.rows); // Send the workouts as JSON
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
  }
}
