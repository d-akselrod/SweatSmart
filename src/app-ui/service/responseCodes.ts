const errorCodeMessages: Map<number, string> = new Map([
  //Account Services
  [1000, 'An account with that email already exists'], //Email already exists
  [1001, 'An account with that username already exists '], //Username already exists
  [1002, 'No account exists with that email'], //No email exists
  [1003, 'No account exists with that username'], //No username exists
  [1004, 'Incorrect password'], //Incorrect password
  [1005, 'Invalid password'], //Invalid password
]);

export const getErrorMessage = (
  statusCode: number,
  insertions?: string[],
): string => {
  let message = errorCodeMessages.get(statusCode) || '';

  if (!insertions) return message;

  for (let i = 1; i < insertions.length + 1; i++) {
    message = message.replace(`{${i}}`, insertions[i]);
  }

  return message;
};
