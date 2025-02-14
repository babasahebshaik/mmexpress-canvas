import { useEffect, useMemo, useState } from "react";
import { CanvasScrollInteraction } from "./CanvasScroll";
import { data } from "./data.js";
import { data2 } from "./data2.js";
import { data3 } from "./data3.js";
import { data4 } from "./data4.js";
import { compData } from "./compData.js";
import { processZones } from "./helperFunction";
import MilePointModal from "./MilePointModal";
import {
  controlImages,
  initializeImageMap,
  preloadImages,
} from "./image-module";
import { processCompData } from "./comparisionReportHelper";
import { ReportHeader } from "./reportHeader";

// Per pixel * per mile point in canvas window (1 mile = 1000 pixels)
// const canvasScale = 1 * 1000;

export function Canva() {
  const [canvasScale, setCanvasScale] = useState(1000);

  const handleScaleChange = (event) => {
    setCanvasScale(event.target.value === "1.0" ? 1000 : 2000);
    setSearchKey((prevKey) => prevKey + 1);
  };
  const [milePointSearch, setMilePointSearch] = useState("");
  const [searchKey, setSearchKey] = useState(0); // Key to force re-render
  const compDataProcessed = processCompData(compData, 0.003, false);
  const { agency, reportType, sortOrder, controlsArr, npZonesArr, routesArr } =
    compDataProcessed;

  const routeDirection = routesArr.filter(
    (route) => route.Name === controlsArr[0].GroupLabel
  );

  controlsArr[0].children = controlsArr[0]?.children?.sort(
    (a, b) => Number(a.log_point) - Number(b.log_point)
  );

  const differenceNPZ = structuredClone(
    npZonesArr[0].children?.filter((zone) =>
      ["Difference"].includes(zone.study_type)
    )
  );

  const currentZones = structuredClone(
    npZonesArr[0].children?.filter((zone) =>
      ["Current"].includes(zone.study_type)
    )
  );
  const recommendedZones = structuredClone(
    npZonesArr[0].children?.filter((zone) =>
      ["Recommended"].includes(zone.study_type)
    )
  );

  // const { agency, controlsArr, npZonesArr } = data;

  const begControlObj = controlsArr[0]?.children[0];
  const endControlObj =
    controlsArr[0]?.children[controlsArr[0]?.children.length - 1];

  const [bControl, eControl] = useMemo(() => {
    const children = controlsArr[0].children;
    return [
      Number(children[0].log_point),
      Number(children[children.length - 1].log_point),
    ];
  }, [controlsArr]);

  console.log(bControl, eControl);

  npZonesArr[0].children = npZonesArr[0].children?.filter(
    (zone) => zone.study_type === "Recommended"
    // (zone) => zone.study_type === "Current"
  );

  // Call preload once with all the control point types
  preloadImages(controlImages);
  initializeImageMap();

  // Generate passzone
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resultPassZone = processZones(npZonesArr as any, bControl, eControl);

  const currentPassZone = processZones(
    [{ ...npZonesArr[0], children: currentZones }] as any,
    bControl,
    eControl
  );
  // const recommendedPassZone = processZones(
  //   [{ ...npZonesArr[0], children: recommendedZones }] as any,
  //   bControl,
  //   eControl
  // );

  const sortedControlsArr = useMemo(() => {
    return controlsArr[0]?.children?.sort(
      (a, b) => Number(a.log_point) - Number(b.log_point)
    );
  }, [controlsArr]);

  function mapMilesToObject(
    start: number,
    end: number,
    scale: number
  ): { [key: string]: number } {
    let obj: { [key: string]: number } = {};
    let index = 1;

    for (let i = start; i <= end; i += scale) {
      obj[String(index)] = parseFloat(i.toFixed(2)); // Convert index to string
      index++;
    }

    return obj;
  }

  const milesMap = mapMilesToObject(
    Number(bControl),
    Number(eControl),
    canvasScale === 1000 ? 1.0 : 0.5
  );
  console.log(milesMap);

  // Calculate canvasPageShift based on the first control point's log_point or search input
  const canvaspageShift = useMemo(() => {
    if (sortedControlsArr?.length === 0) return 1000; // Default shift if no control points
    const firstLogPoint = milePointSearch
      ? milesMap[milePointSearch]
      : Number(sortedControlsArr[0].log_point);
    return Math.round(firstLogPoint * canvasScale) + 1000;
  }, [sortedControlsArr, milePointSearch]);

  // Calculate positions for control points
  const cpArr = useMemo(() => {
    return sortedControlsArr?.map((item) => {
      const positionY =
        Math.round(Number(item.log_point) * canvasScale) - canvaspageShift;
      return {
        positionY: -positionY,
        item: item,
      };
    });
  }, [sortedControlsArr, canvaspageShift]);

  // Group control points by positionY
  const groupedByPositionYArray = useMemo(() => {
    const map = new Map();
    cpArr.forEach(({ positionY, item }) => {
      if (!map.has(positionY)) {
        map.set(positionY, { positionY, items: [] });
      }
      map.get(positionY).items.push(item);
    });
    return Array.from(map.values());
  }, [cpArr]);

  // Filter and process recommended zones
  const routeZones = useMemo(() => {
    // let zones = npZonesArr[0].children.filter(
    // // (zone) => zone.study_type === "Recommended"
    // (zone) => zone.study_type === "Current"
    // );
    let zones = npZonesArr[0].children;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    zones = [...zones, ...resultPassZone] as any;
    zones.sort((a, b) => {
      if (a.study_type === b.study_type) {
        return a.b_trulog - b.b_trulog;
      }
      return a.study_type?.localeCompare(b.study_type);
    });
    return zones;
  }, [npZonesArr, resultPassZone]);

  // Calculate positions for recommended zones
  const recArr = useMemo(() => {
    return routeZones?.map((item) => {
      const positionYBegin =
        Math.round(Number(item.b_trulog) * canvasScale) - canvaspageShift;
      const positionYEnd =
        Math.round(Number(item.e_trulog) * canvasScale) - canvaspageShift;
      return {
        positionYBegin: -positionYBegin,
        positionYEnd: -positionYEnd,
        item: item,
      };
    });
  }, [routeZones, canvaspageShift]);

  // Sort recArr based on b_trulog
  const sortedRecArr = useMemo(() => {
    return recArr?.sort((a, b) => {
      return Number(a.item.b_trulog) - Number(b.item.b_trulog);
    });
  }, [recArr]);

  // Handle the search input and force re-render
  const handleSearch = () => {
    if (!milePointSearch || isNaN(Number(milePointSearch))) {
      alert("Please enter a valid mile point.");
      return;
    }
    setSearchKey((prevKey) => prevKey + 1); // Increment key to trigger re-render
  };

  // Calculate positions for difference zones
  // Sort and calculate positions for difference zones
  const sortedDifferenceNPZ = useMemo(() => {
    return differenceNPZ?.sort((a, b) => {
      return Number(a.b_trulog) - Number(b.b_trulog);
    });
  }, [differenceNPZ]);

  const diffZoneArr = useMemo(() => {
    return sortedDifferenceNPZ?.map((item) => {
      const positionYBegin =
        Math.round(Number(item.b_trulog) * canvasScale) - canvaspageShift;
      const positionYEnd =
        Math.round(Number(item.e_trulog) * canvasScale) - canvaspageShift;
      return {
        positionYBegin: -positionYBegin,
        positionYEnd: -positionYEnd,
        item: item,
      };
    });
  }, [sortedDifferenceNPZ, canvaspageShift]);

  // console.log(canvasScale);

  return (
    <div
      key={searchKey} // Force re-render of the entire component
      style={{
        display: "flex",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <ReportHeader
        pageLength={Object.keys(milesMap).length}
        routeName={controlsArr[0]?.GroupLabel}
        routeDirection={routeDirection[0]?.Direction}
        routelength={endControlObj?.log_point - begControlObj?.log_point}
        agency={agency?.agencyName}
        RouteNo={begControlObj?.route}
        bControl={`${begControlObj.log_point} ${begControlObj.descript}`}
        eControl={`${endControlObj.log_point} ${endControlObj.descript}`}
        reportType={reportType}
        sortOrder={sortOrder}
        handleScaleChange={handleScaleChange}
        canvasScale={canvasScale}
        milePointSearch={milePointSearch}
        setMilePointSearch={setMilePointSearch}
        handleSearch={handleSearch}
      />
      {/* <div>
        <input
          type="text"
          value={milePointSearch}
          onChange={(e) => setMilePointSearch(e.target.value)}
          placeholder="1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          style={{
            width: "50px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </div> */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "600px",
          padding: "0px 30px 0px 30px",
          fontSize: "small",
        }}
      >
        <h5>Control Points</h5>
        <h5 style={{ position: "relative", right: "-25px" }}>C-Length-R</h5>
        <h5 style={{ position: "relative", right: "-5px" }}>C-Left-R</h5>
        <h5 style={{ position: "relative", right: "-5px" }}>C/L</h5>
        <h5 style={{ position: "relative", right: "0px" }}>C-Right-R</h5>
        <h5 style={{ position: "relative", right: "20px" }}>C-Length-R</h5>
        <h5>Control Points</h5>
      </div>
      <CanvasScrollInteraction
        cpArr={groupedByPositionYArray}
        // diffZoneArr={[]}
        recArr={[...sortedRecArr, ...diffZoneArr]} //***make sure difference should not get calculated in footer */
        // recArr={[...sortedRecArr]}
        canvasScale={canvasScale}
      />
      <MilePointModal agencyName={agency.agencyName} />
    </div>
  );
}
