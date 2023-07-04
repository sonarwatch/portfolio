function getBasicAuthAuthorizationHeader(username: string, password: string) {
  return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
}

export function getBasicAuthHeaders(
  username: string,
  password: string
): {
  Authorization: string;
} {
  return {
    Authorization: getBasicAuthAuthorizationHeader(username, password),
  };
}
