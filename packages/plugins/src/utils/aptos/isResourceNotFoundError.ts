// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isResourceNotFoundError(error: any) {
  return error.errorCode === 'resource_not_found';
}
