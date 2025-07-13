const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isValidUUID = (id: string): boolean => {
  return Boolean(id && UUID_REGEX.test(id));
};

export const validateUUID = (id: string | undefined, fieldName: string = "ID"): string | null => {
  if (!id) {
    return `${fieldName} is required`;
  }
  if (!isValidUUID(id)) {
    return `Invalid ${fieldName} format`;
  }
  return null;
};