export function adjustFromToBasedOnZones(
  from: number,
  to: number,
  beginObj: any,
  endObj: any,
  side: string,
  ZonelistArray: any[],
  rtecode: string
): {
  adjustedFrom: number;
  adjustedTo: number;
  passbeginObj: any;
  passendObj: any;
} {
  let adjustedFrom = from;
  let adjustedTo = to;
  let passbeginObj = beginObj;
  let passendObj = endObj;

  // Determine zones based on side
  const sideZones =
    side === "left"
      ? ["07", "03", "04", "02", "06", "01", "11", "12"]
      : ["08", "03", "04", "02", "06", "01", "11", "12"];

  // Filter and sort the zones by b_trulog
  const passZonesList = ZonelistArray.filter((zone) =>
    sideZones.includes(zone.zone_code)
  ).sort((a, b) => a.b_trulog - b.b_trulog);

  // Remove nested zones
  const passDashZones = passZonesList.filter(
    (zone, i) =>
      !passZonesList.some(
        (otherZone, j) =>
          i !== j &&
          otherZone.b_trulog <= zone.b_trulog &&
          otherZone.e_trulog >= zone.e_trulog
      )
  );

  // Helper function to adjust boundaries
  const adjustBoundary = (
    boundary: number,
    obj: any,
    zone: any,
    isFrom: boolean
  ) => {
    if (boundary > zone.b_trulog && boundary < zone.e_trulog) {
      return { boundary: isFrom ? zone.e_trulog : zone.b_trulog, obj: zone };
    }
    if (
      boundary === (isFrom ? zone.b_trulog : zone.e_trulog) &&
      !["07", "08"].includes(zone.zone_code)
    ) {
      return { boundary: isFrom ? zone.e_trulog : zone.b_trulog, obj: zone };
    }
    return { boundary, obj };
  };

  // Adjust `from` and `to` based on non-nested zones
  for (const zone of passDashZones) {
    ({ boundary: adjustedFrom, obj: passbeginObj } = adjustBoundary(
      adjustedFrom,
      passbeginObj,
      zone,
      true
    ));
    ({ boundary: adjustedTo, obj: passendObj } = adjustBoundary(
      adjustedTo,
      passendObj,
      zone,
      false
    ));
  }

  // Adjust `from` and `to` based on previous passing zones
  for (const passZone of this.passZoneEquivAc) {
    if (
      passZone.side === side &&
      passZone.study_type === this.studyType &&
      passZone.rtecode === rtecode
    ) {
      if (adjustedFrom > passZone.from && adjustedFrom < passZone.to) {
        adjustedFrom = passZone.to;
        passbeginObj = passZone.toObj;
      }
      if (adjustedTo > passZone.from && adjustedTo < passZone.to) {
        adjustedTo = passZone.from;
        passendObj = passZone.fromObj;
      }
    }
  }

  return { adjustedFrom, adjustedTo, passbeginObj, passendObj };
}

export const insertPassingZone = (
  from: number,
  to: number,
  side: string,
  rtecode: string,
  beginObj: any,
  endObj: any
): void => {
  try {
    // Create a new zone object
    const zone = {
      b_trulog: from,
      e_trulog: to,
      zone_code: side === "left" ? "09" : "10",
      rtecode,
      study_type: this.studyType,
    };

    // Check if the zone already exists
    const exists = this.dashlineAC.some(
      (existingZone: any) =>
        existingZone.b_trulog === zone.b_trulog &&
        existingZone.e_trulog === zone.e_trulog &&
        existingZone.rtecode === zone.rtecode &&
        existingZone.zone_code === zone.zone_code
    );

    // If the zone doesn't exist, process and add it
    if (!exists) {
      const processedZone = this.beginObjectHandler(
        this.endObjectHandler(zone, endObj, beginObj),
        beginObj,
        endObj
      );
      this.dashlineAC.push(processedZone);
    }
  } catch (error) {
    console.error("Error inserting passing zone:", error);
  }
};
