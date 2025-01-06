import { CanvasScrollInteraction } from "./CanvasScroll";

import { data } from "./data.js";

export function Canva() {
  const _controlsArr = data.controlsArr[0].children;
  _controlsArr.sort((a, b) => Number(a.log_point) - Number(b.log_point));
  const cpArr = _controlsArr.map((item) => {
    const positionY = Math.round(Number(item.log_point) * 1000) - 800; // 3000 is the initial position need to be adjusted dynamically **

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

  const recommendedZones = data.npZonesArr[0].children.filter(
    (zone) => zone.study_type === "Recommended" // for now only for recommended zones
  );
  recommendedZones.sort((a, b) => {
    if (a.study_type === b.study_type) {
      return a.b_trulog - b.b_trulog;
    }
    return a.study_type.localeCompare(b.study_type);
  });

  const recArr = recommendedZones.map((item) => {
    const positionYBegin = Math.round(Number(item.b_trulog) * 1000) - 800; // 3000 is the initial position need to be adjusted dynamically **
    const positionYEnd = Math.round(Number(item.e_trulog) * 1000) - 800;
    return {
      positionYBegin: -positionYBegin,
      positionYEnd: -positionYEnd,
      item: item,
    };
  });
  // console.log(data.npZonesArr[0].children, recommendedZones, recArr);
  // console.log(recArr); 

  // console.log(groupedByPositionYArray);
  // console.log(cpArr);
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
      <CanvasScrollInteraction data={data} cpArr={groupedByPositionYArray} recArr={recArr}/>
    </div>
  );
}
