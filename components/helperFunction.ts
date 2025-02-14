// Function to generate new passzone objects based on the gap
const generatePasszone = (
  prevETrulog: number,
  currBTrulog: number,
  zoneCode: string,
  study_type: string
) => {
  if (prevETrulog === currBTrulog) return null;

  return {
    b_trulog: prevETrulog,
    e_trulog: currBTrulog,
    zone_code: zoneCode === "07" ? "09" : "10",
    rtecode: "",
    study_type: study_type,
    s_date: "",
    zone_orig: "",
    upduser: "",
    beg_lat: "",
    beg_lon: "",
    beg_alt: "",
    effdate: "",
    end_lat: "",
    end_lon: "",
    end_alt: "",
    endeffdate: "",
  };
};

// Function to group and sort data
type NPZoneItem = {
  zone_code: string;
  b_trulog: number;
  e_trulog: number;
  children: NPZoneItem[];
};

const groupAndSortData = (
  npZonesArr: NPZoneItem[]
): Record<"07" | "08", NPZoneItem[]> => {
  return {
    "07": npZonesArr[0].children
      .filter(
        (item: { zone_code: string }) =>
          !["08", "09", "10"].includes(item.zone_code)
      )
      .sort((a: NPZoneItem, b: NPZoneItem) => a.b_trulog - b.b_trulog),
    "08": npZonesArr[0].children
      .filter(
        (item: { zone_code: string }) =>
          !["07", "09", "10"].includes(item.zone_code)
      )
      .sort(
        (a: { e_trulog: number }, b: { e_trulog: number }) =>
          a.e_trulog - b.e_trulog
      ),
  };
};

// Function to remove duplicates based on b_trulog and e_trulog
const removeDuplicates = (array: { b_trulog: number; e_trulog: number }[]) => {
  const seen = new Set();
  return array.filter(({ b_trulog, e_trulog }) => {
    const key = `${b_trulog}-${e_trulog}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// Adjust overlaps in the array
const adjustOverlaps = (array: { b_trulog: number; e_trulog: number }[]) => {
  for (let i = 0; i < array.length - 1; i++) {
    const current = array[i];
    const next = array[i + 1];

    if (next.b_trulog < current.e_trulog) {
      next.b_trulog = current.e_trulog;
    }
  }
  return array.filter((item) => !(item.b_trulog === item.e_trulog));
};

// Main processing function
export const processZones = (
  npZonesArr: NPZoneItem[],
  bControl: number,
  eControl: number
) => {
  const customGroupedData = groupAndSortData(npZonesArr);
  const passzoneData = new Map();

  (Object.keys(customGroupedData) as Array<"07" | "08">).forEach((zoneCode) => {
    if (!["07", "08"].includes(zoneCode)) return;

    let prevETrulog: number | null = Number(bControl);
    let lastStudyType: string | null = null;

    customGroupedData[zoneCode].forEach(
      (item: { b_trulog: number; e_trulog: number; study_type: string }) => {
        if (prevETrulog !== null && prevETrulog !== item.b_trulog) {
          const passzone = generatePasszone(
            prevETrulog,
            item.b_trulog,
            zoneCode,
            item.study_type
          );
          if (passzone) {
            const passzoneKey = passzone.zone_code;
            if (!passzoneData.has(passzoneKey)) {
              passzoneData.set(passzoneKey, []);
            }
            passzoneData.get(passzoneKey).push(passzone);
          }
        }
        prevETrulog = item.e_trulog;
        lastStudyType = item.study_type;
      }
    );

    // Generate passzone between last prevETrulog and eControl if there is a gap
    if (prevETrulog !== null && prevETrulog < eControl && lastStudyType) {
      const finalPasszone = generatePasszone(
        prevETrulog,
        eControl,
        zoneCode,
        lastStudyType
      );
      if (finalPasszone) {
        const passzoneKey = finalPasszone.zone_code;
        if (!passzoneData.has(passzoneKey)) {
          passzoneData.set(passzoneKey, []);
        }
        passzoneData.get(passzoneKey).push(finalPasszone);
      }
    }
  });

  // Merge and process the passzones
  const mergedArray = [
    ...(passzoneData.get("10") || []),
    ...(passzoneData.get("09") || []),
  ];
  const uniqueArray = removeDuplicates(mergedArray);
  uniqueArray.sort(
    (a: { b_trulog: number }, b: { b_trulog: number }) =>
      a.b_trulog - b.b_trulog
  );

  return adjustOverlaps(uniqueArray);
};
