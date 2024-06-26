import { API_AUTH, API_URL } from './config';
import { IExercise } from '../typings/types';

export function getExerciseSortedList(exercises: IExercise[]) {
  const data: any = [];

  const sortedList = exercises?.sort((a: IExercise, b: IExercise) => {
    const nameA = a.name; // Convert names to uppercase for case-insensitive comparison
    const nameB = b.name;

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0; // Names are equal
  });

  const dataWithLetters = sortedList?.reduce(
    (acc, exercise) => {
      const firstLetter = exercise.name.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(exercise);
      return acc;
    },
    {} as Record<string, IExercise[]>,
  );

  Object.entries(dataWithLetters).forEach(([key, value]) => {
    data.push({ title: key, data: value });
  });
  return data;
}

export const getExerciseByEid = (eid: number) => {
  return fetch(`${API_URL}/Exercise/${eid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_AUTH,
    },
  });
};

export const deleteExerciseFromWorkout = (wId: string, eId: number) => {
  return fetch(
    `${API_URL}/WorkoutService/DeleteExerciseFromWorkout?wId=${wId}&eId=${eId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: API_AUTH,
      },
    },
  );
};
