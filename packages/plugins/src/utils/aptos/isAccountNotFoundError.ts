// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isAccountNotFoundError(error: any) {
  return error.errorCode === 'account_not_found';
}
