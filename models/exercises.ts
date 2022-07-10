import db from '../db/connection';

/**
 * Get all the exercises
 * 
 * @returns all exercises
 */
export const getAllExercises = async (): Promise<any[]> => {
    const [exercises]: any = await db.query('SElECT * FROM exercise');
    return exercises;
}