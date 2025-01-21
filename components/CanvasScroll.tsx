import React, { useRef, useState, useEffect } from "react";
import { drawLines } from "./drawLines";

export interface ControlPoint {
  log_point: string;
  descript: string;
  side: string;
}

export interface ControlPointGroup {
  positionY: number;
  items: ControlPoint[];
}

export interface NPZones {
  positionYBegin: number;
  positionYEnd: number;
  item: {
    b_trulog: number;
    e_trulog: number;
    zone_code: string;
  };
}

interface CanvasScrollInteractionProps {
  cpArr: ControlPointGroup[];
  recArr: NPZones[];
}

export const CanvasScrollInteraction: React.FC<
  CanvasScrollInteractionProps
> = ({ cpArr, recArr }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

    drawLines(context, canvasWidth, canvasHeight, npZones, controlP);
  }, [controlP, npZones]);

  const handleScroll = (event: WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY;

    if (delta > 0) {
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
    </div>
  );
};
