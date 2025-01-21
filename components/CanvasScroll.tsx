import React, { useRef, useState, useEffect } from "react";
import {
  draw2DBYL,
  drawDistanceText,
  drawExcluded,
  drawLNoPass,
  drawLPass,
  drawLTLOPP,
  drawLTLSAME,
  drawNONE,
  drawRNoPass,
  drawRPass,
  drawText,
  drawTWLTL,
  drawUndetermined,
} from "./drawZones";
import { findConjunction } from "./helperFunction";
// import "./App.css"; // Create a CSS file or inline styles as needed

interface ControlPoint {
  log_point: string;
  descript: string;
  side: string;
}

interface ControlPointGroup {
  positionY: number;
  items: ControlPoint[];
}

interface NPZones {
  positionYBegin: number;
  positionYEnd: number;
  item: {
    b_trulog: string;
    e_trulog: string;
    zone_code: string;
  };
}

interface CanvasScrollInteractionProps {
  cpArr: ControlPointGroup[];
  recArr: NPZones[];
}

export const CanvasScrollInteraction: React.FC<CanvasScrollInteractionProps> = ({
  cpArr,
  recArr,
}) => {
  // console.log(cpArr);
  // console.log(recArr);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lines, setLines] = useState([400]);
  const [controlP, setControlP] = useState(cpArr);
  const [npZones, setNPZones] = useState(recArr);
  const lineHeight = 50;
  const canvasWidth = 600;
  const canvasHeight = 800;

  useEffect(() => {
    // Add scroll event listener to the canvas container
    const container = document.getElementById("canvasContainer");
    if (container) {
      container.addEventListener("wheel", handleScroll);
    }
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const drawCanvasBackground = () => {
      context.fillStyle = "#f0f0f0";
      context.fillRect(0, 0, canvasWidth, canvasHeight);
    };

    const drawBlackRoad = (x: number, y: number, w: number, h: number) => {
      context.fillStyle = "grey";
      context.fillRect(x, y, w, canvasHeight);
    };

    const drawLines = () => {
      context.clearRect(0, 0, canvasWidth, canvasHeight);

      drawCanvasBackground();
      drawBlackRoad(230, 0, 40, canvasHeight);
      drawBlackRoad(340, 0, 40, canvasHeight);
      npZones.forEach((items, index, itemsArr) => {
        let startConjunction;
        let endConjunction;
        // console.log(index, itemsArr);
        if (items.positionYBegin > 0 && items.positionYEnd < canvasHeight) {
          if (items.item.zone_code === "01") {
            const zoneCodes = ["03", "04", "07", "08"];
            startConjunction = [
              findConjunction(
                index - 1,
                "positionYEnd",
                itemsArr[index - 1]?.positionYEnd,
                zoneCodes,
                itemsArr
              ),
            ];
            endConjunction = [
              findConjunction(
                index + 1,
                "positionYBegin",
                itemsArr[index + 1]?.positionYBegin,
                zoneCodes,
                itemsArr
              ),
            ];
            drawText(context, items);
            drawDistanceText(context, items);
            drawTWLTL(
              context,
              items.positionYBegin,
              items.positionYEnd,
              startConjunction,
              endConjunction
            );
          }
          if (items.item.zone_code === "02") {
            const zoneCodes = ["03", "04", "07", "08"];

            startConjunction = findConjunction(
              index - 1,
              "positionYEnd",
              itemsArr[index - 1]?.positionYEnd,
              zoneCodes,
              itemsArr
            );
            endConjunction = findConjunction(
              index + 1,
              "positionYBegin",
              itemsArr[index + 1]?.positionYBegin,
              zoneCodes,
              itemsArr
            );
            drawText(context, items);
            drawDistanceText(context, items);
            draw2DBYL(
              context,
              items.positionYBegin,
              items.positionYEnd,
              startConjunction,
              endConjunction
            );
          }
          if (items.item.zone_code === "03") {
            const zoneCodes = ["04", "07", "08"];

            startConjunction = [
              findConjunction(
                index - 1,
                "positionYEnd",
                itemsArr[index - 1]?.positionYEnd,
                zoneCodes,
                itemsArr
              ),
            ];
            endConjunction = [
              findConjunction(
                index + 1,
                "positionYBegin",
                itemsArr[index + 1]?.positionYBegin,
                zoneCodes,
                itemsArr
              ),
            ];
            drawText(context, items);
            drawDistanceText(context, items);
            drawLTLSAME(
              context,
              items.positionYBegin,
              items.positionYEnd,
              startConjunction,
              endConjunction
            );
          }
          if (items.item.zone_code === "04") {
            const zoneCodes = ["03", "07", "08"];

            startConjunction = [
              findConjunction(
                index - 1,
                "positionYEnd",
                itemsArr[index - 1]?.positionYEnd,
                zoneCodes,
                itemsArr
              ),
            ];
            endConjunction = [
              findConjunction(
                index + 1,
                "positionYBegin",
                itemsArr[index + 1]?.positionYBegin,
                zoneCodes,
                itemsArr
              ),
            ];
            drawText(context, items);
            drawDistanceText(context, items);
            drawLTLOPP(
              context,
              items.positionYBegin,
              items.positionYEnd,
              startConjunction,
              endConjunction
            );
          }
          if (items.item.zone_code === "06") {
            drawText(context, items);
            drawDistanceText(context, items);
            drawNONE(context, items.positionYBegin, items.positionYEnd);
          }
          if (items.item.zone_code === "07") {
            drawText(context, items);
            drawDistanceText(context, items);
            drawLNoPass(context, items.positionYBegin, items.positionYEnd);
          }
          if (items.item.zone_code === "08") {
            drawText(context, items);
            drawDistanceText(context, items);
            drawRNoPass(context, items.positionYBegin, items.positionYEnd);
          }
          if (items.item.zone_code === "09") {
            drawText(context, items);
            drawDistanceText(context, items);
            drawLPass(context, items.positionYBegin, items.positionYEnd);
          }
          if (items.item.zone_code === "10") {
            drawText(context, items);
            drawDistanceText(context, items);
            drawRPass(context, items.positionYBegin, items.positionYEnd);
          }
          if (items.item.zone_code === "11") {
            drawText(context, items);
            drawDistanceText(context, items);
            drawExcluded(context, items.positionYBegin, items.positionYEnd);
          }
          if (items.item.zone_code === "12") {
            drawText(context, items);
            drawDistanceText(context, items);
            drawUndetermined(context, items.positionYBegin, items.positionYEnd);
          }
        }
      });

      const printControlPoints = (
        positionY: number,
        sideX: number,
        sideType: string,
        controlPoint: ControlPoint
      ) => {
        context.textAlign = sideType.toLowerCase() as CanvasTextAlign;
        context.fillText(
          controlPoint.log_point + " " + controlPoint.descript,
          sideX,
          positionY
        );
      };

      controlP.forEach((group) => {
        group.items.forEach((controlPoint, i) => {
          const gap = 10;
          context.font = "9px Arial";
          context.fillStyle = "black";

          if (controlPoint.side === "Left") {
            printControlPoints(
              group.positionY + i * gap,
              0,
              "Left",
              controlPoint
            );
          } else if (controlPoint.side === "Right") {
            printControlPoints(
              group.positionY + i * gap,
              600,
              "Right",
              controlPoint
            );
          } else if (controlPoint.side === "Both") {
            printControlPoints(
              group.positionY + i * gap,
              0,
              "Left",
              controlPoint
            );
            printControlPoints(
              group.positionY + i * gap,
              600,
              "Right",
              controlPoint
            );
          }
        });
      });
    };

    drawLines();
  }, [controlP, lines, npZones]);

  const addLine = () => {
    setLines([lines[0] - lineHeight, ...lines]);
  };

  const handleScroll = (event: WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY;

    if (delta > 0) {
      setLines((prevLines) => prevLines.map((line) => line - lineHeight));
      setControlP((prevControlP) =>
        prevControlP.map((controlPoint) => ({
          ...controlPoint,
          positionY: controlPoint.positionY - lineHeight,
        }))
      );
      setNPZones((prevNPZones) =>
        prevNPZones.map((npZone) => ({
          ...npZone,
          positionYBegin: npZone.positionYBegin - lineHeight,
          positionYEnd: npZone.positionYEnd - lineHeight,
        }))
      );
    } else {
      setLines((prevLines) => prevLines.map((line) => line + lineHeight));
      setControlP((prevControlP) =>
        prevControlP.map((controlPoint) => ({
          ...controlPoint,
          positionY: controlPoint.positionY + lineHeight,
        }))
      );
      setNPZones((prevNPZones) =>
        prevNPZones.map((npZone) => ({
          ...npZone,
          positionYBegin: npZone.positionYBegin + lineHeight,
          positionYEnd: npZone.positionYEnd + lineHeight,
        }))
      );
    }
  };

  return (
    <div>
      <div
        id="canvasContainer"
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          border: "1px solid #ccc",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
      </div>
      {/* <button
        id="addLineButton"
        onClick={addLine}
        style={{ marginTop: "20px", padding: "10px", fontSize: "16px" }}
      >
        Add Line
      </button> */}
    </div>
  );
};
