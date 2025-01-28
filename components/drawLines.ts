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
import { imageCache } from "./image-module";
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
    context: CanvasRenderingContext2D,
    positionY: number,
    sideX: number,
    sideType: string,
    controlPoint: ControlPoint,
    maxWidth: number = 180,
    lineHeight: number = 10
  ) => {
    context.textAlign = sideType.toLowerCase() as CanvasTextAlign;
    context.font = "9px Arial";
    context.fillStyle = "black";

    const text = `${controlPoint.log_point} ${controlPoint.descript}`;
    const words = text.split(" ");
    let currentLine = "";
    const lines: string[] = [];

    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = context.measureText(testLine).width;
      if (textWidth > maxWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) lines.push(currentLine);

    lines.forEach((line, index) => {
      context.fillText(line, sideX, positionY + index * lineHeight);
    });

    // Use preloaded images
    const img = imageCache[controlPoint.Type];
    if (img) {
      context.drawImage(img, sideX + 165, positionY - 5, 10, 10);
    } else {
      // console.error(`Image not found in cache for type: ${controlPoint.Type}`);
    }
  };

  const adjustPositionY = (
    controlP: ControlPointGroup[],
    minDifference = 10
  ) => {
    // Sort groups by positionY
    controlP.sort((a, b) => a.positionY - b.positionY);

    for (let i = 1; i < controlP.length; i++) {
      // Ensure the difference between consecutive positionY values
      if (controlP[i].positionY - controlP[i - 1].positionY < minDifference) {
        controlP[i].positionY = controlP[i - 1].positionY + minDifference;
      }
    }

    return controlP;
  };

  const drawControlPoints = (
    controlP: ControlPointGroup[],
    context: CanvasRenderingContext2D
  ) => {
    const gap = 12;
    const sideX = 420;

    controlP.forEach((group) => {
      group.items.forEach((controlPoint, i) => {
        // Compute the positionY for the current controlPoint
        const currentY = group.positionY + i * gap;

        if (controlPoint.side === "Left") {
          printControlPoints(context, currentY, 10, "Left", controlPoint);
        } else if (controlPoint.side === "Right") {
          printControlPoints(context, currentY, sideX, "Left", controlPoint);
        } else if (controlPoint.side === "Both") {
          printControlPoints(context, currentY, 10, "Left", controlPoint);
          printControlPoints(context, currentY, sideX, "Left", controlPoint);
        }
      });
    });
  };
  const adjustedControlP = adjustPositionY(controlP, 10);
  drawControlPoints(adjustedControlP, context);
};
