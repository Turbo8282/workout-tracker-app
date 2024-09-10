// app/api/add-workout/route.ts
import { NextResponse } from "next/server";
import { query } from "../../../lib/db";
import { getServerSession } from "next-auth/next";
import { options as authOptions } from "@/app/api/auth/[...nextauth]/options"; // Update the path to your NextAuthOptions

export async function POST(req: Request) {
	// Get session on the server side
	const session = await getServerSession(authOptions);
	const username = session?.user?.name;

	try {
		const { exercise, repetitions, workout_date } = await req.json();

		if (!exercise || !repetitions || !workout_date) {
			return NextResponse.json(
				{ error: "Missing workout data" },
				{ status: 400 }
			);
		}
		const idResult = await query(
			`SELECT "id" FROM "user" WHERE "user".username = $1`,
			[username]
		);
		const result = await query(
			"INSERT INTO workout_log (exercise, repetitions, workout_date, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
			[exercise, repetitions, workout_date, idResult.rows[0].id]
		);

		return NextResponse.json(result.rows[0], { status: 201 }); // Return the inserted workout
	} catch (error) {
		console.error("Error adding workout:", error);
		return NextResponse.json(
			{ error: "Failed to add workout" },
			{ status: 500 }
		);
	}
}
