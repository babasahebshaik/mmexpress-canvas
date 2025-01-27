/* eslint-disable @typescript-eslint/no-explicit-any */
import { ControlPoint, ControlPointGroup } from "./CanvasScroll";
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
// Define the function
export const drawLines = (
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  npZones: any,
  controlP: ControlPointGroup[]
) => {
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  const drawCanvasBackground = () => {
    context.fillStyle = "#f0f0f0";
    context.fillRect(0, 0, canvasWidth, canvasHeight);
  };

  const drawBlackRoad = (
    x: number,
    y: number,
    w: number,
    canvasHeight: number
  ) => {
    context.fillStyle = "#D3D3D3";
    context.fillRect(x, y, w, canvasHeight);
  };

  const drawSolidBlackLine = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.setLineDash([]);
    context.strokeStyle = "black";
    context.lineWidth = 1;
    context.stroke();
    context.closePath();
  };
  drawCanvasBackground();
  drawBlackRoad(230, 0, 40, canvasHeight);
  drawBlackRoad(340, 0, 40, canvasHeight);
  drawSolidBlackLine(200, 0, 200, canvasHeight);
  drawSolidBlackLine(230, 0, 230, canvasHeight);
  drawSolidBlackLine(380, 0, 380, canvasHeight);
  drawSolidBlackLine(410, 0, 410, canvasHeight);

  npZones.forEach((items: any, index: number, itemsArr: any) => {
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
    controlPoint: ControlPoint,
    maxWidth: number = 200, // Maximum width before wrapping text
    lineHeight: number = 12 // Line height for wrapped text
  ) => {
    // Set text alignment and font
    context.textAlign = sideType.toLowerCase() as CanvasTextAlign;
    context.font = "9px Arial";

    // Combine the log_point and descript into a single string
    const text = `${controlPoint.log_point} ${controlPoint.descript}`;

    // Split text into multiple lines if it exceeds maxWidth
    const words = text.split(" ");
    let currentLine = "";
    const lines: string[] = [];

    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = context.measureText(testLine).width;

      if (textWidth > maxWidth) {
        // Push the current line and start a new one
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    // Push the last line
    if (currentLine) lines.push(currentLine);

    // Draw each line of text
    lines.forEach((line, index) => {
      context.fillText(line, sideX, positionY + index * lineHeight);
    });
  };

  controlP.forEach((group) => {
    group.items.forEach((controlPoint: any, i: number) => {
      const gap = 10;
      context.font = "9px Arial";
      context.fillStyle = "black";

      if (controlPoint.side === "Left") {
        printControlPoints(group.positionY + i * gap, 0, "Left", controlPoint);
      } else if (controlPoint.side === "Right") {
        printControlPoints(
          group.positionY + i * gap,
          595,
          "Right",
          controlPoint
        );
      } else if (controlPoint.side === "Both") {
        printControlPoints(group.positionY + i * gap, 0, "Left", controlPoint);
        printControlPoints(
          group.positionY + i * gap,
          595,
          "Right",
          controlPoint
        );
      }
    });
  });
};
