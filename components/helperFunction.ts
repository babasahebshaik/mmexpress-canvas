type NPZones = {
  [key: string]: any;
};

export const findConjunction = (
  index: number,
  positionKey: keyof NPZones,
  positionValue: number,
  zoneCodes: string[],
  itemsArr: NPZones[]
) => {
  if (zoneCodes.includes(itemsArr[index]?.item.zone_code)) {
    return itemsArr.filter(
      (items) =>
        items[positionKey] === positionValue &&
        zoneCodes.includes(items.item.zone_code)
    );
  }
  return null;
};
