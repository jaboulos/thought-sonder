import { FieldError } from '../generated/graphql';

export const toErrorMap = (errors: FieldError[]) => {
  // map that has a string key and a string value
  const errorMap: Record<string, string> = {};
  // destructure from FieldError array
  errors.forEach(({ field, message }) => {
    errorMap[field] = message;
  });
  return errorMap;
};
