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
import { imageCache } from "./image-module";
// Define the function
export const drawLines = (
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  npZones: any,
  controlP: ControlPointGroup[],
  // diffZoneArr: any
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
  const drawZones = (
    context: CanvasRenderingContext2D,
    items: any,
    itemsArr: any,
    canvasHeight: number
  ) => {
    if (items.positionYBegin > 0 && items.positionYEnd < canvasHeight) {
      const zoneCodes = ["03", "04", "07", "08"];
      const startConjunction = itemsArr.filter(
        (item: any) =>
          item.positionYEnd === items.positionYBegin &&
          zoneCodes.includes(item.item.zone_code)
      );
      const endConjunction = itemsArr.filter(
        (item: any) =>
          item.positionYBegin === items.positionYEnd &&
          zoneCodes.includes(item.item.zone_code)
      );

      drawText(context, items);
      drawDistanceText(context, items);

      switch (items.item.zone_code) {
        case "01":
          drawTWLTL(
            context,
            items.positionYBegin,
            items.positionYEnd,
            startConjunction,
            endConjunction
          );
          break;
        case "02":
          draw2DBYL(
            context,
            items.positionYBegin,
            items.positionYEnd,
            startConjunction,
            endConjunction
          );
          break;
        case "03":
          drawLTLSAME(
            context,
            items.positionYBegin,
            items.positionYEnd,
            startConjunction,
            endConjunction
          );
          break;
        case "04":
          drawLTLOPP(
            context,
            items.positionYBegin,
            items.positionYEnd,
            startConjunction,
            endConjunction
          );
          break;
        case "06":
          drawNONE(context, items.positionYBegin, items.positionYEnd);
          break;
        case "07":
          drawLNoPass(
            context,
            items.positionYBegin,
            items.positionYEnd,
            items.item.type ? items.item.type : "#FFD700"
          );
          break;
        case "08":
          drawRNoPass(
            context,
            items.positionYBegin,
            items.positionYEnd,
            items.item.type ? items.item.type : "#FFD700"
          );
          break;
        case "09":
          drawLPass(context, items.positionYBegin, items.positionYEnd);
          break;
        case "10":
          drawRPass(context, items.positionYBegin, items.positionYEnd);
          break;
        case "11":
          drawExcluded(context, items.positionYBegin, items.positionYEnd);
          break;
        case "12":
          drawUndetermined(context, items.positionYBegin, items.positionYEnd);
          break;
        default:
          break;
      }
    }
  };

  drawCanvasBackground();
  drawBlackRoad(240, 0, 60, canvasHeight);
  drawBlackRoad(350, 0, 60, canvasHeight);
  drawSolidBlackLine(180, 0, 180, canvasHeight);
  drawSolidBlackLine(240, 0, 240, canvasHeight);
  drawSolidBlackLine(410, 0, 410, canvasHeight);
  drawSolidBlackLine(470, 0, 470, canvasHeight);

  // Usage in drawLines function
  npZones.forEach((items: any, index: number, itemsArr: any) => {
    drawZones(context, items, itemsArr, canvasHeight);
  });
  // diffZoneArr.forEach((items: any, index: number, itemsArr: any) => {
  //   drawZones(context, items, itemsArr, canvasHeight);
  // });

  const printControlPoints = (
    context: CanvasRenderingContext2D,
    positionY: number,
    sideX: number,
    sideType: string,
    controlPoint: ControlPoint,
    maxWidth: number = 170,
    lineHeight: number = 6
  ) => {
    context.textAlign = sideType.toLowerCase() as CanvasTextAlign;
    context.font = "8px Arial";
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
      context.drawImage(img, sideX + 150, positionY - 5, 10, 10);
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
    const sideX = 480;

    controlP.forEach((group) => {
      group.items.forEach((controlPoint, i) => {
        // Compute the positionY for the current controlPoint
        const currentY = group.positionY + i * gap;

        if (controlPoint.side === "Left") {
          printControlPoints(context, currentY, 10, "Left", controlPoint);
        } else if (controlPoint.side === "Right") {
          printControlPoints(context, currentY, sideX, "Left", controlPoint); // this is for the right side
        } else if (controlPoint.side === "Both") {
          printControlPoints(context, currentY, 10, "Left", controlPoint);
          printControlPoints(context, currentY, sideX, "Left", controlPoint); // this is for the right side
        }
      });
    });
  };
  const adjustedControlP = adjustPositionY(controlP, 10);
  drawControlPoints(adjustedControlP, context);
};
