import { Nullable } from "../globalTypes";


export const checkIdIsNumber = (id: string): Nullable<number> => {
  const preparedNumber = Number.parseInt(id, 10);
  return Number.isNaN(preparedNumber) ? null : preparedNumber;
};