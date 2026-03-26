import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Exercise {
    duration: bigint;
    name: string;
    description: string;
    category: string;
}
export interface backendInterface {
    addExercise(name: string, description: string, duration: bigint, category: string): Promise<void>;
    getAllExercises(): Promise<Array<Exercise>>;
    removeExercise(name: string): Promise<void>;
}
