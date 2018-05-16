export function isSucceedResponse (response: Response): boolean {
  return response.status >= 200 && response.status < 300
}
