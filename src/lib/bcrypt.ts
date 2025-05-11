export const bcryptPasswordCompare = async (
  password: string,
  hashedPassword: string
) => {
  const { default: bcrypt } = await import("bcryptjs");
  return bcrypt.compare(password, hashedPassword);
};

export const bcryptPasswordHash = async (password: string) => {
  const { default: bcrypt } = await import("bcryptjs");
  const bcryptSaltRound = Number.parseInt("10", 10);
  return bcrypt.hash(password, bcryptSaltRound);
};
