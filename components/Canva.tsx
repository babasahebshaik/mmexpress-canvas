import { CanvasScrollInteraction } from "./CanvasScroll";

import { data } from "./data.js";

export function Canva() {
  var _controlsArr = data.controlsArr[0].children;
  _controlsArr.sort((a, b) => Number(a.log_point) - Number(b.log_point));
  const cpArr = _controlsArr.map((item, index, array) => {
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

  console.log(groupedByPositionYArray);
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
      <CanvasScrollInteraction data={data} cpArr={groupedByPositionYArray} />
    </div>
  );
}
