
export function getTotal(arr: any) {
  if (!Array.isArray(arr)) return;
  return arr.reduce((a, v) => a + v);
}
