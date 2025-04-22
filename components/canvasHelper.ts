import { ChildrenEntity1, ControlsArrEntity, NpZonesArrEntity } from "./types";

export const sepStudyTypeData = (npZonesArr: NpZonesArrEntity[]) => {
  const differenceNPZ = structuredClone(
    npZonesArr[0].children?.filter((zone) =>
      ["Difference"].includes(zone.study_type)
    )
  );

  const currentZones = structuredClone(
    npZonesArr[0].children?.filter((zone) =>
      ["Current"].includes(zone.study_type)
    )
  );

  const recommendedZones = structuredClone(
    npZonesArr[0].children?.filter((zone) =>
      ["Recommended"].includes(zone.study_type)
    )
  );

  return { differenceNPZ, currentZones, recommendedZones };
};
export const getControlPoints = (controlsArr: ControlsArrEntity[]) => {
  const children = controlsArr[0]?.children || [];
  const bControl = Number(children[0]?.log_point || 0);
  const eControl = Number(children[children.length - 1]?.log_point || 0);
  const begControlObj = children[0] || {};
  const endControlObj = children[children.length - 1] || {};
  return [bControl, eControl, begControlObj, endControlObj];
};

export const combineZonesAndPass = (
  zones: ChildrenEntity1[] | undefined,
  resultPassZone: {
    b_trulog: number;
    e_trulog: number;
  }[]
) => {
  // let zones = currentZones;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  zones = [...zones, ...resultPassZone] as any;
  zones.sort((a, b) => {
    if (a.study_type === b.study_type) {
      return a.b_trulog - b.b_trulog;
    }
    return a.study_type?.localeCompare(b.study_type);
  });
  return zones;
};
