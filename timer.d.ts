/**
 * Schedules a timeout, given a function and a specified delay.
 * 
 * @param userFN - The function to be executed after the delay.
 * @param ms - The delay in milliseconds before executing the function.
 * @returns A unique identifier for the timer(timeout).
 */
export function timeout(userFN: () => void, ms: number): number;

/**
 * Schedules an interval, to execute a given function as frequent as a specified delay.
 * 
 * @param userFN - The function to be executed after each delay.
 * @param ms - The delay in milliseconds before the function executes.
 * @returns A unique identifier for the timer(interval).
 */
export function interval(userFN: () => void, ms: number): number;

/**
 * Uses timer.timeout to wait for a specified number of milliseconds before resolving.
 * 
 * @param ms - The delay in milliseconds before the promise resolves.
 * @returns A promise that resolves after the specified delay.
 */
export function wait(ms: number): Promise<void>;

/**
 * Clears any timer(timeout or interval) with a given ID.
 * 
 * @param ID - The unique identifier for the timer (whether timeout or interval).
 * @returns A boolean which is true if a timer existed with that ID, false otherwise.
 */
export function clear(ID: number): boolean;