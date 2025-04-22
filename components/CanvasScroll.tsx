import React, { useRef, useState, useEffect } from "react";
import { drawLines } from "./drawLines";

export interface ControlPoint {
  log_point: string;
  descript: string;
  side: string;
  Type: string;
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
  // diffZoneArr: NPZones[];
  recArr: NPZones[];
  canvasScale: number;
  handleScrollPageNumberRef: (value: ControlPointGroup) => void;
  stripeLength?: number;
  gapLength?: number;
}
// const STRIPE_LENGTH = 10;
// const GAP_LENGTH = 30;
// const stripeGapRatio = STRIPE_LENGTH / (STRIPE_LENGTH + GAP_LENGTH);

export const CanvasScrollInteraction: React.FC<
  CanvasScrollInteractionProps
> = ({ cpArr, recArr, canvasScale, handleScrollPageNumberRef,stripeLength=10,gapLength=30 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stripeGapRatio = stripeLength / (stripeLength + gapLength);
  const [controlPoints, setControlPoints] = useState(cpArr);
  const [npZones, setNPZones] = useState(recArr);
  // const [diffZone, setDiffZone] = useState(diffZoneArr);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const findSmallestPositivePositionY = (
    controlPoints: ControlPointGroup[]
  ) => {
    return controlPoints.reduce(
      (minPoint, point) => {
        if (point.positionY > 0 && point.positionY < minPoint.positionY) {
          return point;
        }
        return minPoint;
      },
      { positionY: Infinity, items: [] } as ControlPointGroup
    );
  };
  const lineHeight = 50;
  const canvasWidth = 650;
  const canvasHeight = 1000;

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      handleScrollPageNumberRef(
        structuredClone(findSmallestPositivePositionY(controlPoints))
      );
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
  }, [controlPoints]);

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

    drawLines(
      context,
      canvasWidth,
      canvasHeight,
      npZones,
      controlPoints
      // diffZone
    );

    context.restore();
  }, [
    controlPoints,
    npZones,
    zoomLevel,
    offset,
    // diffZone
  ]);

  const handleVerticalScroll = (delta: number) => {
    const scrollAmount = delta > 0 ? -lineHeight : lineHeight;

    if (scrollAmount < 0) {
      if (
        controlPoints[controlPoints.length - 1].positionY - scrollAmount <
        740
      )
        return;
    } else {
      if (controlPoints[0].positionY - scrollAmount > 10) return;
    }
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

    // setDiffZone((prev) =>
    //   prev.map((zone) => ({
    //     ...zone,
    //     positionYBegin: zone.positionYBegin + scrollAmount,
    //     positionYEnd: zone.positionYEnd + scrollAmount,
    //   }))
    // );
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
  //,
  let onPageNp = 0;
  let onPagePass = 0;
  let accumTotalNP = 0;
  let accumTotalPass = 0;

  const getZoneLength = (zone: NPZones, lengthType: string) => {
    switch (zone.item.zone_code) {
      case "01":
        if (lengthType === "FULL LENGTH") {
          const length = zone.item.e_trulog - zone.item.b_trulog;

          onPageNp += 2 * length + 2 * length * stripeGapRatio;
        }
        if (lengthType === "PARTIAL LENGTH BEGIN") {
          const length = zone.positionYBegin / canvasScale;
          onPageNp += 2 * length + 2 * length * stripeGapRatio;
        }
        if (lengthType === "PARTIAL LENGTH END") {
          const length = (canvasHeight - zone.positionYEnd) / canvasScale;
          onPageNp += 2 * length + 2 * length * stripeGapRatio;
        }
        if (lengthType === "NO BEGIN AND END VISIBLE") {
          const length = canvasHeight / canvasScale;
          onPageNp += 2 * length + 2 * length * stripeGapRatio;
        }
        if (lengthType === "ALL VIEWED LENGTH") {
          if (zone.positionYEnd < 0) {
            const length = zone.positionYBegin / canvasScale;
            accumTotalNP += 2 * length + 2 * length * stripeGapRatio;
          } else {
            const length = zone.item.e_trulog - zone.item.b_trulog;
            accumTotalNP += 2 * length + 2 * length * stripeGapRatio;
          }
        }
        break;
      case "02":
        if (lengthType === "FULL LENGTH") {
          onPageNp += (zone.item.e_trulog - zone.item.b_trulog) * 4;
        }
        if (lengthType === "PARTIAL LENGTH BEGIN") {
          onPageNp += (zone.positionYBegin / canvasScale) * 4;
        }
        if (lengthType === "PARTIAL LENGTH END") {
          onPageNp += ((canvasHeight - zone.positionYEnd) / canvasScale) * 4;
        }
        if (lengthType === "NO BEGIN AND END VISIBLE") {
          onPageNp += (canvasHeight / canvasScale) * 4;
        }
        if (lengthType === "ALL VIEWED LENGTH") {
          if (zone.positionYEnd < 0) {
            accumTotalNP += (zone.positionYBegin / canvasScale) * 4;
          } else {
            accumTotalNP += (zone.item.e_trulog - zone.item.b_trulog) * 4;
          }
        }
        // Handle Pass case
        break;
      case "03":
        if (lengthType === "FULL LENGTH") {
          onPageNp += (zone.item.e_trulog - zone.item.b_trulog) * 2;
        }
        if (lengthType === "PARTIAL LENGTH BEGIN") {
          onPageNp += (zone.positionYBegin / canvasScale) * 2;
        }
        if (lengthType === "PARTIAL LENGTH END") {
          onPageNp += ((canvasHeight - zone.positionYEnd) / canvasScale) * 2;
        }
        if (lengthType === "NO BEGIN AND END VISIBLE") {
          onPageNp += (canvasHeight / canvasScale) * 2;
        }
        if (lengthType === "ALL VIEWED LENGTH") {
          if (zone.positionYEnd < 0) {
            accumTotalNP += (zone.positionYBegin / canvasScale) * 2;
          } else {
            accumTotalNP += (zone.item.e_trulog - zone.item.b_trulog) * 2;
          }
        }
        // Handle other cases
        break;
      case "04":
        if (lengthType === "FULL LENGTH") {
          onPageNp += (zone.item.e_trulog - zone.item.b_trulog) * 2;
        }
        if (lengthType === "PARTIAL LENGTH BEGIN") {
          onPageNp += (zone.positionYBegin / canvasScale) * 2;
        }
        if (lengthType === "PARTIAL LENGTH END") {
          onPageNp += ((canvasHeight - zone.positionYEnd) / canvasScale) * 2;
        }
        if (lengthType === "NO BEGIN AND END VISIBLE") {
          onPageNp += (canvasHeight / canvasScale) * 2;
        }
        if (lengthType === "ALL VIEWED LENGTH") {
          if (zone.positionYEnd < 0) {
            accumTotalNP += (zone.positionYBegin / canvasScale) * 2;
          } else {
            accumTotalNP += (zone.item.e_trulog - zone.item.b_trulog) * 2;
          }
        }
        // Handle other cases
        break;
      case "07":
        if (lengthType === "FULL LENGTH") {
          onPageNp += zone.item.e_trulog - zone.item.b_trulog;
        }
        if (lengthType === "PARTIAL LENGTH BEGIN") {
          onPageNp += zone.positionYBegin / canvasScale;
        }
        if (lengthType === "PARTIAL LENGTH END") {
          onPageNp += (canvasHeight - zone.positionYEnd) / canvasScale;
        }
        if (lengthType === "NO BEGIN AND END VISIBLE") {
          onPageNp += canvasHeight / canvasScale;
        }
        if (lengthType === "ALL VIEWED LENGTH") {
          if (zone.positionYEnd < 0) {
            accumTotalNP += zone.positionYBegin / canvasScale;
          } else {
            accumTotalNP += zone.item.e_trulog - zone.item.b_trulog;
          }
        }
        // Handle other cases
        break;
      case "08":
        if (lengthType === "FULL LENGTH") {
          onPageNp += zone.item.e_trulog - zone.item.b_trulog;
        }
        if (lengthType === "PARTIAL LENGTH BEGIN") {
          onPageNp += zone.positionYBegin / canvasScale;
        }
        if (lengthType === "PARTIAL LENGTH END") {
          onPageNp += (canvasHeight - zone.positionYEnd) / canvasScale;
        }
        if (lengthType === "NO BEGIN AND END VISIBLE") {
          onPageNp += canvasHeight / canvasScale;
        }
        if (lengthType === "ALL VIEWED LENGTH") {
          if (zone.positionYEnd < 0) {
            accumTotalNP += zone.positionYBegin / canvasScale;
          } else {
            accumTotalNP += zone.item.e_trulog - zone.item.b_trulog;
          }
        }
        // Handle other cases
        break;
      case "09":
        if (lengthType === "FULL LENGTH") {
          onPagePass += zone.item.e_trulog - zone.item.b_trulog;
        }
        if (lengthType === "PARTIAL LENGTH BEGIN") {
          onPagePass += zone.positionYBegin / canvasScale;
        }
        if (lengthType === "PARTIAL LENGTH END") {
          onPagePass += (canvasHeight - zone.positionYEnd) / canvasScale;
        }
        if (lengthType === "NO BEGIN AND END VISIBLE") {
          onPagePass += canvasHeight / canvasScale;
        }
        if (lengthType === "ALL VIEWED LENGTH") {
          if (zone.positionYEnd < 0) {
            accumTotalPass += zone.positionYBegin / canvasScale;
          } else {
            accumTotalPass += zone.item.e_trulog - zone.item.b_trulog;
          }
        }
        // Handle other cases
        break;
      case "10":
        if (lengthType === "FULL LENGTH") {
          onPagePass += zone.item.e_trulog - zone.item.b_trulog;
        }
        if (lengthType === "PARTIAL LENGTH BEGIN") {
          onPagePass += zone.positionYBegin / canvasScale;
        }
        if (lengthType === "PARTIAL LENGTH END") {
          onPagePass += (canvasHeight - zone.positionYEnd) / canvasScale;
        }
        if (lengthType === "NO BEGIN AND END VISIBLE") {
          onPagePass += canvasHeight / canvasScale;
        }
        if (lengthType === "ALL VIEWED LENGTH") {
          if (zone.positionYEnd < 0) {
            accumTotalPass += zone.positionYBegin / canvasScale;
          } else {
            accumTotalPass += zone.item.e_trulog - zone.item.b_trulog;
          }
        }
        // Handle other cases
        break;
      default:
        // Handle other cases
        break;
    }
  };

  npZones
    ?.filter((zone) => zone.positionYBegin > 0)
    ?.forEach((item) => {
      // if (item.item?.study_type !== "Difference") {
      // this is for the NP zones and pass zones which are visible on the screen window with  start and end points
      if (item.positionYBegin < canvasHeight && item.positionYEnd > 0) {
        getZoneLength(item, "FULL LENGTH");
      }
      // this is for the NP zones and pass zones which are visible on the screen window with  partially start and end points
      if (
        item.positionYBegin > 0 &&
        item.positionYBegin < canvasHeight &&
        !(item.positionYEnd > 0 && item.positionYEnd < canvasHeight)
      ) {
        getZoneLength(item, "PARTIAL LENGTH BEGIN");
      }
      if (
        !(item.positionYBegin > 0 && item.positionYBegin < canvasHeight) &&
        item.positionYEnd > 0 &&
        item.positionYEnd < canvasHeight
      ) {
        getZoneLength(item, "PARTIAL LENGTH END");
      }
      if (item.positionYBegin > canvasHeight && item.positionYEnd < 0) {
        getZoneLength(item, "NO BEGIN AND END VISIBLE");
      }
      if (item.positionYBegin > 0) {
        getZoneLength(item, "ALL VIEWED LENGTH");
      }
      // }
    });

  return (
    <>
      <div
        id="canvasContainer"
        ref={containerRef}
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          border: "1px solid #ccc",
          // overflow: "hidden",
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
      <div style={{ fontSize: "small", display: "grid" }}>
        <div>
          <span>
            <b>Page Total: NP:</b> {onPageNp.toFixed(3)}
          </span>
          <span>
            <b>| Pass:</b> {onPagePass.toFixed(3)}
          </span>
          <span>
            <b>||| Accum Total: NP:</b> {accumTotalNP.toFixed(3)}
          </span>
          <span>
            <b>| Pass:</b> {(accumTotalPass * stripeGapRatio).toFixed(3)}
          </span>
          <span>
            <b>| Combined:</b>
            {(accumTotalNP + accumTotalPass * stripeGapRatio).toFixed(3)}
          </span>
        </div>
        <p style={{ display: "flex", justifyContent: "center" }}>
          ©2025 MasterMind, LLC - MapsterStudio
        </p>
      </div>
    </>
  );
};
