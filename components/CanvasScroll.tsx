import React, { useRef, useState, useEffect } from "react";
import {
  draw2DBYL,
  drawExcluded,
  drawLNoPass,
  drawLPass,
  drawLTLOPP,
  drawLTLSAME,
  drawNONE,
  drawRNoPass,
  drawRPass,
  drawTWLTL,
  drawUndetermined,
} from "./drawZones";
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
  data: any;
  cpArr: ControlPointGroup[];
  recArr: NPZones[];
}

export const CanvasScrollInteraction: React.FC<
  CanvasScrollInteractionProps
> = ({ data, cpArr, recArr }) => {
  // console.log(cpArr);
  console.log(recArr);
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

    const drawLines = () => {
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      drawCanvasBackground();
      // lines.forEach((positionY) => {
      //   drawTWLTL(context, positionY);
      //   draw2DBYL(context, positionY);
      //   drawLTLSAME(context, positionY);
      //   drawLTLOPP(context, positionY);
      //   drawNONE(context, positionY);
      //   drawLNoPass(context, positionY);
      //   drawRNoPass(context, positionY);
      //   drawLPass(context, positionY);
      //   drawRPass(context, positionY);
      //   drawExcluded(context, positionY);
      //   drawUndetermined(context, positionY);
      // });

      npZones.forEach((items) => {
        // console.log(items.item);
        if (items.item.zone_code === "01") {
          // drawTWLTL(context, items.positionYBegin, items.positionYEnd);
        }
        if (items.item.zone_code === "02") {
          // draw2DBYL(context, items.positionYBegin, items.positionYEnd);
        }
        if (items.item.zone_code === "03") {
          // drawLTLSAME(context, items.positionYBegin, items.positionYEnd);
        }
        if (items.item.zone_code === "04") {
          // drawLTLOPP(context, items.positionYBegin, items.positionYEnd);
        }
        if (items.item.zone_code === "06") {
          // drawNONE(context, items.positionYBegin, items.positionYEnd);
        }
        if (items.item.zone_code === "07") {
          console.log(items.positionYBegin, items.positionYEnd);
          drawLNoPass(context, items.positionYBegin, items.positionYEnd);
        }
        if (items.item.zone_code === "08") {
          drawRNoPass(context, items.positionYBegin, items.positionYEnd);
        }
        if (items.item.zone_code === "09") {
          // drawLPass(context, items.positionYBegin);
        }
        if (items.item.zone_code === "10") {
          // drawRPass(context, items.positionYBegin);
        }
        if (items.item.zone_code === "11") {
          // drawExcluded(context, items.positionYBegin);
        }
        if (items.item.zone_code === "12") {
          // drawUndetermined(context, items.positionYBegin);
        }
        // drawTWLTL(context, positionY); //01
        // draw2DBYL(context, positionY); //02
        // drawLTLSAME(context, positionY); //03
        // drawLTLOPP(context, positionY); //04
        // drawNONE(context, positionY); //06
        // drawLNoPass(context, positionY); //07
        // drawRNoPass(context, positionY); //08
        // drawLPass(context, positionY); //09
        // drawRPass(context, positionY); //10
        // drawExcluded(context, positionY); //11
        // drawUndetermined(context, positionY); //12
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
  }, [controlP, lines]);

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
      <button
        id="addLineButton"
        onClick={addLine}
        style={{ marginTop: "20px", padding: "10px", fontSize: "16px" }}
      >
        Add Line
      </button>
    </div>
  );
};
