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
  const containerRef = useRef<HTMLDivElement>(null);

  const [controlPoints, setControlPoints] = useState(cpArr);
  const [npZones, setNPZones] = useState(recArr);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const lineHeight = 50;
  const canvasWidth = 600;
  const canvasHeight = 800;

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      const handleScroll = (event: WheelEvent) => {
        if (event.ctrlKey) {
          handleZoom(event as WheelEvent);
        } else {
          handleVerticalScroll(event.deltaY);
        }
      };

      container.addEventListener("wheel", handleScroll);

      return () => {
        container.removeEventListener("wheel", handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.save();
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    // Apply transformations
    context.translate(offset.x, offset.y);
    context.scale(zoomLevel, zoomLevel);
    context.translate(-offset.x, -offset.y);

    drawLines(context, canvasWidth, canvasHeight, npZones, controlPoints);

    context.restore();
  }, [controlPoints, npZones, zoomLevel, offset]);

  const handleVerticalScroll = (delta: number) => {
    const scrollAmount = delta > 0 ? -lineHeight : lineHeight;

    setControlPoints((prev) =>
      prev.map((group) => ({
        ...group,
        positionY: group.positionY + scrollAmount,
      }))
    );

    setNPZones((prev) =>
      prev.map((zone) => ({
        ...zone,
        positionYBegin: zone.positionYBegin + scrollAmount,
        positionYEnd: zone.positionYEnd + scrollAmount,
      }))
    );
  };

  const handleZoom = (event: WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const cursorX = event.clientX - rect.left;
    const cursorY = event.clientY - rect.top;

    const zoomChange = delta > 0 ? -0.1 : 0.1;

    setZoomLevel((prevZoom) => {
      const newZoom = Math.min(Math.max(prevZoom + zoomChange, 1), 5);
      setOffset((prevOffset) => ({
        x: (cursorX - prevOffset.x) / prevZoom + prevOffset.x,
        y: (cursorY - prevOffset.y) / prevZoom + prevOffset.y,
      }));
      return newZoom;
    });
  };

  return (
    <div
      id="canvasContainer"
      ref={containerRef}
      style={{
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`,
        border: "1px solid #ccc",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
        }}
      />
    </div>
  );
};
