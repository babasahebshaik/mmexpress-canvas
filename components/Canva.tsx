import { CanvasScrollInteraction } from "./CanvasScroll";

import { data, passzData } from "./data.js";
const canvaspageShift = 800;
const canvasSacle = 1 * 1000;
export function Canva() {
  const _controlsArr = data.controlsArr[0].children;
  _controlsArr.sort((a, b) => Number(a.log_point) - Number(b.log_point));
  const cpArr = _controlsArr.map((item) => {
    const positionY =
      Math.round(Number(item.log_point) * canvasSacle) - canvaspageShift; // 3000 is the initial position need to be adjusted dynamically **

    return {
      positionY: -positionY,
      item: item,
    };
  });

  const groupedByPositionYArray = cpArr.reduce(
    (acc: { positionY: number; items: typeof _controlsArr }[], curr) => {
      const { positionY, item } = curr;
      // Find an existing group with the same positionY
      const existingGroup = acc.find((group) => group.positionY === positionY);
      if (existingGroup) {
        // If a group exists, push the item to its items array
        existingGroup.items.push(item);
      } else {
        // Otherwise, create a new group
        acc.push({
          positionY,
          items: [item],
        });
      }
      return acc;
    },
    []
  );

  let recommendedZones = data.npZonesArr[0].children.filter(
    (zone) => zone.study_type === "Recommended" // for now only for recommended zones
  );

  recommendedZones = [...recommendedZones, ...passzData];
  // console.log(recommendedZones,passzData);
  recommendedZones.sort((a, b) => {
    if (a.study_type === b.study_type) {
      return a.b_trulog - b.b_trulog;
    }
    return a.study_type.localeCompare(b.study_type);
  });

  const recArr = recommendedZones.map((item) => {
    const positionYBegin =
      Math.round(Number(item.b_trulog) * canvasSacle) - canvaspageShift; // 3000 is the initial position need to be adjusted dynamically **
    const positionYEnd =
      Math.round(Number(item.e_trulog) * canvasSacle) - canvaspageShift;
    return {
      positionYBegin: -positionYBegin,
      positionYEnd: -positionYEnd,
      item: item,
    };
  });

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
      {/* <CanvasLineDrawing data={data} /> */}
      <CanvasScrollInteraction
        cpArr={groupedByPositionYArray}
        recArr={recArr}
      />
    </div>
  );
}
