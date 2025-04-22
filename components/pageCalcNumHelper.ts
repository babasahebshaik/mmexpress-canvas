export function mapMilesToObject(
  start: number,
  end: number,
  scale: number
): { [key: string]: number } {
  const obj: { [key: string]: number } = {};
  let index = 1;

  for (let i = start; i <= end; i += scale) {
    obj[String(index)] = parseFloat(i.toFixed(2)); // Convert index to string
    index++;
  }

  return obj;
}

export function findKeysBelowLogPoint(
  data: { [key: string]: number },
  logPoint: number
) {
  const result: string[] = [];
  for (const [key, value] of Object.entries(data)) {
    if ((value as number) < logPoint) {
      result.push(key);
    }
  }
  return result;
}
