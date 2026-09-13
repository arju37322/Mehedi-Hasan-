export function safeParse(data: any, fallback: any = []) {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (e) {
      return fallback;
    }
  }
  return data || fallback;
}
