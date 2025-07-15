import type { BackendError } from "../types/errors";
import { isBackendError } from "../types/errors";

export type { BackendError };
export { isBackendError };


export async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json().then((data: BackendError) => data);
    throw errorData;
  }

  return response.json();
}
