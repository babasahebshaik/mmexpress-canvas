import React, { useRef, useState, useEffect } from "react";
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

interface CanvasScrollInteractionProps {
  data: any;
  cpArr: ControlPointGroup[];
}

export const CanvasScrollInteraction: React.FC<
  CanvasScrollInteractionProps
> = ({ data, cpArr }) => {
  //   console.log(cpArr);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lines, setLines] = useState([400]);
  const [controlP, setControlP] = useState(cpArr);
  const lineHeight = 100;
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

    const drawTWLTL = (positionY: number) => {
      const drawLineWithStyle = (
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        dash: number[] = [],
        color: string = "#FFD700",
        width: number = 4
      ) => {
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.setLineDash(dash);
        context.strokeStyle = color;
        context.lineWidth = width;
        context.stroke();
      };

      drawLineWithStyle(100, positionY, 100, positionY + 50);
      drawLineWithStyle(115, positionY, 115, positionY + 50, [5, 5]);
      drawLineWithStyle(135, positionY, 135, positionY + 50, [5, 5]);
      drawLineWithStyle(150, positionY, 150, positionY + 50);
    };

    const drawLines = () => {
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      drawCanvasBackground();
      lines.forEach((positionY) => {
        drawTWLTL(positionY);
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
    } else {
      setLines((prevLines) => prevLines.map((line) => line + lineHeight));
      setControlP((prevControlP) =>
        prevControlP.map((controlPoint) => ({
          ...controlPoint,
          positionY: controlPoint.positionY + lineHeight,
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
