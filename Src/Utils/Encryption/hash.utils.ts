import { hashSync, compareSync } from "bcrypt";

export const generateHash = (
  plainText: string,
  saltRounds: number = parseInt(process.env.SALT_Rounds as string)
): string => {
  return hashSync(plainText, saltRounds);
};

export const compareHash = (plainText: string, hash: string): boolean => {
  return compareSync(plainText, hash);
};
