import type { BackendError } from "../types/errors";
import { isBackendError } from "../types/errors";

export type { BackendError };
export { isBackendError };

export function parseBackendError(response: Response): Promise<BackendError> {
  return response.json().then((data: BackendError) => data);
}

export async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await parseBackendError(response);
    throw errorData;
  }

  return response.json();
}
