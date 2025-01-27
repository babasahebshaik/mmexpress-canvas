import { useMemo } from "react";
import { CanvasScrollInteraction } from "./CanvasScroll";
import { data } from "./data.js";
import { processZones } from "./helperFunction";

// per pixel * per mile point in canvas window
const canvasScale = 1 * 1000;

export function Canva() {
  const { controlsArr, npZonesArr } = data;

  // genrate passzone
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resultPassZone = processZones(npZonesArr as any);

  const sortedControlsArr = useMemo(() => {
    return controlsArr[0].children.sort(
      (a, b) => Number(a.log_point) - Number(b.log_point)
    );
  }, [controlsArr]);

  // Calculate canvaspageShift based on the first control point's log_point
  const canvaspageShift = useMemo(() => {
    if (sortedControlsArr.length === 0) return 790; // Default shift if no control points
    const firstLogPoint = Number(sortedControlsArr[0].log_point);
    return Math.round(firstLogPoint * canvasScale) + 790;
  }, [sortedControlsArr]);

  const cpArr = useMemo(() => {
    return sortedControlsArr.map((item) => {
      const positionY =
        Math.round(Number(item.log_point) * canvasScale) - canvaspageShift;
      return {
        positionY: -positionY,
        item: item,
      };
    });
  }, [sortedControlsArr]);

  const groupedByPositionYArray = useMemo(() => {
    const map = new Map();
    cpArr.forEach(({ positionY, item }) => {
      if (!map.has(positionY)) {
        map.set(positionY, { positionY, items: [] });
      }
      map.get(positionY).items.push(item);
    });
    return Array.from(map.values());
  }, [cpArr]);

  const recommendedZones = useMemo(() => {
    let zones = npZonesArr[0].children.filter(
      (zone) => zone.study_type === "Recommended"
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    zones = [...zones, ...resultPassZone] as any;
    zones.sort((a, b) => {
      if (a.study_type === b.study_type) {
        return a.b_trulog - b.b_trulog;
      }
      return a.study_type?.localeCompare(b.study_type);
    });
    return zones;
  }, [npZonesArr, resultPassZone]);

  const recArr = useMemo(() => {
    return recommendedZones.map((item) => {
      const positionYBegin =
        Math.round(Number(item.b_trulog) * canvasScale) - canvaspageShift;
      const positionYEnd =
        Math.round(Number(item.e_trulog) * canvasScale) - canvaspageShift;
      return {
        positionYBegin: -positionYBegin,
        positionYEnd: -positionYEnd,
        item: item,
      };
    });
  }, [recommendedZones]);

  return (
    <div
      className="App"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "98vh",
      }}
    >
      <CanvasScrollInteraction
        cpArr={groupedByPositionYArray}
        recArr={recArr}
      />
    </div>
  );
}
