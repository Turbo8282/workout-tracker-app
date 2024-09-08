// app/api/workouts/pushups/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { options as authOptions } from '@/app/api/auth/[...nextauth]/options'; // Update the path to your NextAuthOptions

export async function GET() {
  // Get session on the server side
  const session = await getServerSession(authOptions);
  const username = session?.user?.name;

  try {
    const result = await query(`SELECT workout_log.id, workout_log.exercise, workout_log.repetitions, 
        workout_log.workout_date FROM workout_log JOIN "user" ON workout_log.user_id = "user".id WHERE 
        "user".username = $1 AND workout_log.exercise = $2 ORDER BY workout_log.created_time ASC`, [username, 'Pushups']
);
    return NextResponse.json(result.rows); // Send the workouts as JSON
  } catch (error) {
    console.error('Error fetching pushups:', error);
    return NextResponse.json({ error: 'Failed to fetch pushups' }, { status: 500 });
  }
}
