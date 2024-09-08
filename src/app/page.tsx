"use client";

import { useEffect, useState } from "react";
type Workout = {
  id: number;
  exercise: string;
  repetitions: number;
  workout_date: string;
};

export default function Home() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0"); // Add leading zero if necessary
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed, so add 1
  const year = today.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  const [todayPushups, setTodayPushups] = useState(0);
  const [todayPullups, setTodayPullups] = useState(0);
  const [todaySquats, setTodaySquats] = useState(0);

  // Define the state with the correct type
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [pushups, setPushups] = useState<Workout[]>([]);
  const [pullups, setPullups] = useState<Workout[]>([]);
  const [squats, setSquats] = useState<Workout[]>([]);
  const [pushupsCount, setPushupsCount] = useState(0);
  const [pullupsCount, setPullupsCount] = useState(0);
  const [squatsCount, setSquatsCount] = useState(0);
  const [triggerFetch, setTriggerFetch] = useState(false);

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        const response = await fetch("/api/workouts");
        const data = await response.json();

        // Ensure the data is an array before setting the state
        if (Array.isArray(data)) {
          setWorkouts(data);
        } else {
          console.error("API did not return an array");
        }
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    }

    fetchWorkouts();

    async function fetchPushups() {
      try {
        const response = await fetch("/api/workouts/pushups");
        const data = await response.json();

        // Ensure the data is an array before setting the state
        if (Array.isArray(data)) {
          setPushups(data);
        } else {
          console.error("API did not return an array");
        }
      } catch (error) {
        console.error("Error fetching pushups:", error);
      }
    }

    fetchPushups();

    async function fetchPullups() {
      try {
        const response = await fetch("/api/workouts/pullups");
        const data = await response.json();

        if (Array.isArray(data)) {
          setPullups(data);
        } else {
          console.error("API did not return an array");
        }
      } catch (error) {
        console.error("Error fetching pullups:", error);
      }
    }

    fetchPullups();

    async function fetchSquats() {
      try {
        const response = await fetch("/api/workouts/squats");
        const data = await response.json();

        // Ensure the data is an array before setting the state
        if (Array.isArray(data)) {
          setSquats(data);
        } else {
          console.error("API did not return an array");
        }
      } catch (error) {
        console.error("Error fetching squats:", error);
      }
    }

    fetchSquats();

    async function fetchPushupsCount() {
      try {
        const response = await fetch("/api/today/pushups");
        const data = await response.json();

        setPushupsCount(data[0].sum);
      } catch (error) {
        console.error("Error fetching pushups:", error);
      }
    }

    fetchPushupsCount();

    async function fetchPullupsCount() {
      try {
        const response = await fetch("/api/today/pullups");
        const data = await response.json();

        setPullupsCount(data[0].sum);
      } catch (error) {
        console.error("Error fetching pullups:", error);
      }
    }

    fetchPullupsCount();

    async function fetchSquatsCount() {
      try {
        const response = await fetch("/api/today/squats");
        const data = await response.json();

        setSquatsCount(data[0].sum);
      } catch (error) {
        console.error("Error fetching squats:", error);
      }
    }

    fetchSquatsCount();
  }, [triggerFetch]);

  const [exercise, setExercise] = useState("");
  const [repetitions, setRepetitions] = useState(0);
  const [workoutDate, setWorkoutDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await addWorkout(exercise, repetitions, workoutDate);

    if (result) {
      // Handle successful workout addition
      alert("Workout added successfully!");
    } else {
      // Handle failure
      console.log(exercise);
      console.log(repetitions);
      console.log(workoutDate);

      alert("Failed to add workout");
    }

    // Reset form fields
    setExercise("");
    setRepetitions(0);
    setWorkoutDate("");
  };

  async function addWorkout(
    exercise: string,
    repetitions: number,
    workout_date: string
  ) {
    try {
      const response = await fetch("/api/add-workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ exercise, repetitions, workout_date }),
      });

      if (!response.ok) {
        throw new Error("Failed to add workout");
      }

      const data = await response.json();
      if (pullups.length > 0 || pushups.length > 0 || squats.length > 0) {
        // Trigger data fetch by changing `triggerFetch` state
        setTriggerFetch((prev) => !prev);
      }
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  return (
    <main className="mx-auto w-[92%]">
      <div className="flex space-x-16 2xl:space-x-28 mt-12">
        <div className="mb-20">
          <h1 className="text-3xl font-bold mb-4">Workout Log</h1>
          <ul>
            {workouts.map((workout) => (
              <li key={workout.id}>
                {workout.exercise}: {workout.repetitions} reps on{" "}
                {Intl.DateTimeFormat("en-AU", {
                  timeZone: "Australia/Sydney",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false, // Optional: Use 24-hour format
                })
                  .format(new Date(workout.workout_date))
                  .substring(0, 10)}
              </li>
            ))}
          </ul>
        </div>
        <div className="">
          <h1 className="text-3xl font-bold mb-4">Pushups Log</h1>
          <ul>
            {pushups.map((pushups) => (
              <li key={pushups.id}>
                {pushups.exercise}: {pushups.repetitions} reps on{" "}
                {Intl.DateTimeFormat("en-AU", {
                  timeZone: "Australia/Sydney",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false, // Optional: Use 24-hour format
                })
                  .format(new Date(pushups.workout_date))
                  .substring(0, 10)}
              </li>
            ))}
          </ul>
        </div>
        <div className="">
          <h1 className="text-3xl font-bold mb-4">Pullups Log</h1>
          <ul>
            {pullups.map((pullups) => (
              <li key={pullups.id}>
                {pullups.exercise}: {pullups.repetitions} reps on{" "}
                {Intl.DateTimeFormat("en-AU", {
                  timeZone: "Australia/Sydney",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false, // Optional: Use 24-hour format
                })
                  .format(new Date(pullups.workout_date))
                  .substring(0, 10)}
              </li>
            ))}
          </ul>
        </div>
        <div className="">
          <h1 className="text-3xl font-bold mb-4">Squats Log</h1>
          <ul>
            {squats.map((squats) => (
              <li key={squats.id}>
                {squats.exercise}: {squats.repetitions} reps on{" "}
                {Intl.DateTimeFormat("en-AU", {
                  timeZone: "Australia/Sydney",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false, // Optional: Use 24-hour format
                })
                  .format(new Date(squats.workout_date))
                  .substring(0, 10)}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full space-y-40">
          <div className="flex flex-col border-2 shadow-md px-12 h-64 2xl:h-40 w-full">
            <h1 className="text-3xl font-bold mx-auto mb-8 mt-4">
              Add a Workout
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="text-xl mr-12">
                <span className="mr-4">Exercise:</span>
                <select
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value)}
                  className="border-2 px-4"
                  required
                >
                  <option value="" disabled>
                    Select an exercise
                  </option>
                  <option value="Pushups">Pushups</option>
                  <option value="Pullups">Pullups</option>
                  <option value="Squats">Squats</option>
                </select>
              </label>
              <label className="text-xl mr-12">
                <span className="mr-4">Repetitions:</span>
                <input
                  type="number"
                  value={repetitions}
                  onChange={(e) => setRepetitions(Number(e.target.value))}
                  className="border-2 px-2"
                  required
                />
              </label>
              <label className="text-xl mr-12">
                <span className="mr-4">Date:</span>
                <input
                  type="date"
                  value={workoutDate}
                  onChange={(e) => setWorkoutDate(e.target.value)}
                  className="border-2 px-2"
                  required
                />
              </label>
              <button
                type="submit"
                className="text-xl border-2 rounded-full px-4 py-1"
              >
                Add Workout
              </button>
            </form>
          </div>
          <div className="flex flex-col border-2 shadow-md px-12 h-40 w-full">
            <h1 className="text-3xl font-bold mx-auto mb-8 mt-4">Today</h1>
            <div className="flex w-full justify-around text-xl">
              <div>Pushups: {pushupsCount}</div>
              <div>Pullups: {pullupsCount}</div>
              <div>Squats: {squatsCount}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
