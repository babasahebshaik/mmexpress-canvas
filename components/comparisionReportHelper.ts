import {
  ChildrenEntity1,
  ChildrenEntity1Compare,
  NoPassingReportData,
  NpZonesArrEntity,
  NpZonesDiffArrEntity,
  ReportType,
} from "./types";

export const processCompData = (
  result: NoPassingReportData,
  minDistance: number,
  compMilePointAll: boolean
): NoPassingReportData => {
  const resultCopy = structuredClone(result);
  const reportType = resultCopy.reportType;
  const npZonesDifferenceArr: NpZonesDiffArrEntity[] = [];
  const npZonesWithNoneZones: NpZonesArrEntity[] = [];
  const npZonesdifferences: NpZonesArrEntity[] = [];

  resultCopy.npZonesArr.forEach((npZoneEnt) => {
    const recommendedChildren = filterChildren(
      npZoneEnt?.children || [],
      "Recommended"
    );
    const currentChildren = filterChildren(npZoneEnt.children || [], "Current");
    const noneChildren = filterNoneZones(npZoneEnt.children || []);

    npZonesDifferenceArr.push({
      GroupLabel: npZoneEnt.GroupLabel,
      currentChildren,
      recommendedChildren,
    });

    npZonesWithNoneZones.push({
      GroupLabel: npZoneEnt.GroupLabel,
      children: noneChildren,
    });
  });

  const isCurrentBaseReport =
    reportType ===
    ReportType.NO_PASSING_ROUTE_GRAPHICAL_ZONES_COMPARISON_CURRENT_BASE_REPORT;
  const isRecommendedBaseReport =
    reportType ===
    ReportType.NO_PASSING_ROUTE_GRAPHICAL_ZONES_COMPARISON_RECOMMENDED_BASE_REPORT;

  if (isCurrentBaseReport || isRecommendedBaseReport) {
    npZonesDifferenceArr.forEach((npZoneEnt) => {
      const { currentChildren, recommendedChildren, GroupLabel } = npZoneEnt;
      if (currentChildren && recommendedChildren) {
        const npZoneDiff = findNpzoneDifferences(
          isCurrentBaseReport ? currentChildren : recommendedChildren,
          isCurrentBaseReport ? recommendedChildren : currentChildren,
          isCurrentBaseReport ? "Current" : "Recommended",
          minDistance
        );
        npZonesdifferences.push({
          GroupLabel,
          children: npZoneDiff,
        });
      }
    });
  }

  resultCopy.npZonesArr.forEach((npZoneEnt) => {
    npZoneEnt.children = npZoneEnt.children?.filter(
      (child) => !["06", "11", "12"].includes(child?.zone_code)
    );
  });

  npZonesdifferences.forEach((npZoneDiff, i) => {
    markZones(resultCopy.npZonesArr[i].children || []);
    markZones(npZonesWithNoneZones[i].children || []);
    markDifferenceZones(npZoneDiff.children || []);

    const excludedZones = npZonesWithNoneZones[i]?.children?.filter((item) =>
      ["11", "12"].includes(item.zone_code)
    );

    npZoneDiff.children?.forEach((child) => {
      if (!["06", "11", "12"].includes(child.zone_code)) {
        child.inExcluded = excludedZones?.some((excludedZone) => {
          return (
            child.b_trulog >= excludedZone.b_trulog &&
            child.e_trulog <= excludedZone.e_trulog
          );
        });
      }
    });

    const mergedData = comparisionallMilePoints(
      resultCopy.npZonesArr[i]?.children || [],
      npZonesWithNoneZones[i].children || [],
      npZoneDiff.children || [],
      reportType
    );

    if (npZoneDiff.children?.length) {
      resultCopy.npZonesArr[i].children = compMilePointAll
        ? [
            ...(resultCopy.npZonesArr[i].children || []),
            ...(npZoneDiff.children || []),
            ...(npZonesWithNoneZones[i].children || []),
          ]
        : [...mergedData];
    } else {
      resultCopy.npZonesArr[i].children = [
        ...(filterByStudyType(
          resultCopy.npZonesArr[i].children || [],
          isCurrentBaseReport ? "Current" : "Recommended"
        ) || []),
        ...(filterByStudyType(
          npZonesWithNoneZones[i].children || [],
          isCurrentBaseReport ? "Current" : "Recommended"
        ) || []),
      ];
    }
  });

  return resultCopy;
};

const filterChildren = (
  children: ChildrenEntity1[] | undefined,
  studyType: string
) => {
  return children?.filter(
    (zone) =>
      !["06", "11", "12"].includes(zone.zone_code) &&
      zone.study_type === studyType
  );
};

const filterNoneZones = (children: ChildrenEntity1[] | undefined) => {
  return children?.filter((zone) =>
    ["06", "11", "12"].includes(zone.zone_code)
  );
};

const markZones = (children: ChildrenEntity1[] | undefined) => {
  children?.forEach((child) => {
    child.print_beg = true;
    child.print_end = true;
    child.zonelength = true;
  });
};

const markDifferenceZones = (children: ChildrenEntity1[] | undefined) => {
  children?.forEach((child) => {
    child.print_beg = false;
    child.print_end = false;
    child.zonelength = true;
  });
};

const filterByStudyType = (
  children: ChildrenEntity1[] | undefined,
  studyType: string
) => {
  return children?.filter((item) => item.study_type === studyType);
};

export function findNpzoneDifferences(
  current: ChildrenEntity1[],
  recommended: ChildrenEntity1[],
  studyType: string,
  minDistance: number
) {
  let extraZoneSpace: ChildrenEntity1Compare[] = [];
  studyType = "Difference";
  const currentRight = current.filter((entity) => entity.zone_code !== "07");
  const recommendedRight = recommended.filter(
    (entity) => entity.zone_code !== "07"
  );
  const currentLeft = current.filter((entity) => entity.zone_code !== "08");
  const recommendedLeft = recommended.filter(
    (entity) => entity.zone_code !== "08"
  );

  const leftDiffernce = getDifference(currentLeft, recommendedLeft, studyType);
  const rightDiffernce = getDifference(
    currentRight,
    recommendedRight,
    studyType
  );

  extraZoneSpace = [...leftDiffernce, ...rightDiffernce];

  extraZoneSpace.sort((a, b) => {
    if (a.b_trulog < b.b_trulog) {
      return -1;
    }
    if (a.b_trulog > b.b_trulog) {
      return 1;
    }
    return 0;
  });

  return extraZoneSpace.filter(
    (zone) => zone.e_trulog - zone.b_trulog >= minDistance
  );
}

const getDifference = (
  current: ChildrenEntity1[],
  recommended: ChildrenEntity1[],
  studyType: string
) => {
  const clen = current.length;
  const rlen = recommended.length;
  const extraZoneSpace: ChildrenEntity1Compare[] = [];
  const currentZones = current.sort((a, b) => a.b_trulog - b.b_trulog);
  const recommendedZones = recommended.sort((a, b) => a.b_trulog - b.b_trulog);

  for (let cIndex = 0; cIndex < clen; cIndex++) {
    const c = currentZones[cIndex];
    const nextCurrent = currentZones[cIndex + 1];
    const previousCurrent = cIndex > 0 ? currentZones[cIndex - 1] : null;
    for (let rIndex = 0; rIndex < rlen; rIndex++) {
      const r = recommendedZones[rIndex];
      const nextRecommended = recommendedZones[rIndex + 1];
      const previousRecommended =
        rIndex > 0 ? recommendedZones[rIndex - 1] : null;

      if (c.b_trulog < r.b_trulog && c.e_trulog > r.b_trulog) {
        if (previousRecommended && previousRecommended.e_trulog > c.b_trulog) {
          extraZoneSpace.push(
            createZone(
              r,
              previousRecommended.e_trulog,
              r.b_trulog,
              "green",
              studyType
            )
          );
        } else {
          extraZoneSpace.push(
            createZone(c, c.b_trulog, r.b_trulog, "green", studyType)
          );
        }
      }
      if (r.b_trulog < c.b_trulog && r.e_trulog >= c.b_trulog) {
        if (!previousCurrent || previousCurrent.e_trulog <= r.b_trulog) {
          extraZoneSpace.push(
            createZone(r, r.b_trulog, c.b_trulog, "red", studyType)
          );
        }
      }
      if (c.e_trulog < r.e_trulog && c.e_trulog > r.b_trulog) {
        if (nextCurrent && nextCurrent.b_trulog < r.e_trulog) {
          extraZoneSpace.push(
            createZone(c, c.e_trulog, nextCurrent.b_trulog, "red", studyType)
          );
        } else {
          extraZoneSpace.push(
            createZone(c, c.e_trulog, r.e_trulog, "red", studyType)
          );
        }
      }
      if (c.e_trulog > r.e_trulog && c.b_trulog < r.e_trulog) {
        if (!nextRecommended || nextRecommended.b_trulog >= c.e_trulog) {
          extraZoneSpace.push(
            createZone(c, r.e_trulog, c.e_trulog, "green", studyType)
          );
        }
      }
    }
  }

  extraZoneSpace.push(
    ...getNonOverlappingZones(currentZones, recommendedZones, "red", studyType)
  );
  extraZoneSpace.push(
    ...getNonOverlappingZones(
      recommendedZones,
      currentZones,
      "green",
      studyType
    )
  );

  return extraZoneSpace;
};

const createZone = (
  zone: ChildrenEntity1,
  b_trulog: number,
  e_trulog: number,
  type: string,
  study_type: string
): ChildrenEntity1Compare => ({
  ...zone,
  b_trulog,
  e_trulog,
  print_beg: false,
  print_end: false,
  type,
  study_type,
  zonelength: false,
});

const getNonOverlappingZones = (
  zonesA: ChildrenEntity1[],
  zonesB: ChildrenEntity1[],
  type: string,
  study_type: string
): ChildrenEntity1Compare[] => {
  return zonesA
    .filter((a) => !zonesB.some((b) => isOverlapping(a, b)))
    .map((zone) =>
      createZone(zone, zone.b_trulog, zone.e_trulog, type, study_type)
    );
};

const isOverlapping = (a: ChildrenEntity1, b: ChildrenEntity1): boolean => {
  return (
    (a.b_trulog < b.b_trulog && a.e_trulog > b.b_trulog) ||
    (b.b_trulog < a.b_trulog && b.e_trulog >= a.b_trulog) ||
    (a.e_trulog <= b.e_trulog && a.e_trulog >= b.b_trulog) ||
    (a.e_trulog > b.e_trulog && a.b_trulog < b.e_trulog)
  );
};

export const comparisionallMilePoints = (
  npzone: ChildrenEntity1[],
  nonezone: ChildrenEntity1[],
  diffrence: ChildrenEntity1[],
  reportType: string
) => {
  const npzoneswithnone = [...npzone, ...nonezone];
  const recommendedZones = structuredClone(
    npzoneswithnone.filter((entity) => entity.study_type === "Recommended")
  );
  const currentZones = structuredClone(
    npzoneswithnone.filter((entity) => entity.study_type === "Current")
  );
  const baseReportType = reportType.includes("RECOMMENDED")
    ? "RECOMMENDED"
    : "CURRENT";
  const topLayerReport =
    baseReportType === "RECOMMENDED" ? currentZones : recommendedZones;
  const npDiffrence = structuredClone(diffrence);

  npDiffrence.forEach((child) => {
    child.print_beg = false;
    child.print_end = false;
    child.zonelength = true;
  });

  topLayerReport.forEach((child) => {
    const isPrintBeg = npDiffrence.some(
      (diff) =>
        diff.b_trulog === child.b_trulog || diff.e_trulog === child.b_trulog
    );
    const isPrintEnd = npDiffrence.some(
      (diff) =>
        diff.e_trulog === child.e_trulog || diff.b_trulog === child.e_trulog
    );
    child.print_beg = isPrintBeg;
    child.print_end = isPrintEnd;
    child.zonelength = false;
  });

  return [
    ...(recommendedZones || []),
    ...(npDiffrence || []),
    ...(currentZones || []),
  ];
};
