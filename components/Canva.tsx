import { useMemo, useState, useRef } from "react";
import { CanvasScrollInteraction, ControlPointGroup } from "./CanvasScroll";
import { data } from "./data.js";
import { data2 } from "./data2.js";
import { data3 } from "./data3.js";
import { data4 } from "./data4.js";
import { compData } from "./compData.js";
import { compDataCur } from "./compDataCur.js";
import { processZones } from "./helperFunction";
import MilePointModal from "./MilePointModal";
import {
  controlImages,
  initializeImageMap,
  preloadImages,
} from "./image-module";
import { processCompData } from "./comparisionReportHelper";
import { ReportHeader } from "./reportHeader";
import { findKeysBelowLogPoint, mapMilesToObject } from "./pageCalcNumHelper";
import ColumnHeader from "./columHeader";
import {
  combineZonesAndPass,
  getControlPoints,
  sepStudyTypeData,
} from "./canvasHelper";
import { ChildrenEntity1 } from "./types";

export function Canva() {
  // const minDistance = 0.003;
  // const compMilePointAll = false;
  const [minDistance, setMinDistance] = useState(0.003);
  const [compMilePointAll, setCompMilePointAll] = useState(false);
  const [stripeLength, setStripeLength] = useState(10);
  const [gapLength, setGapLength] = useState(30);
  const scrollPageNumberRef = useRef<ControlPointGroup>({
    positionY: 0,
    items: [],
  });
  const [canvasScale, setCanvasScale] = useState(1000);
  const [milePointSearch, setMilePointSearch] = useState("");
  const [searchKey, setSearchKey] = useState(0); // Key to force re-render
  // const { agency, reportType, sortOrder, controlsArr, npZonesArr, routesArr } =
  //   data;
  const compDataProcessed = processCompData(
    data,
    minDistance,
    compMilePointAll
  );

  const {
    agency,
    reportType,
    sortOrder,
    controlsArr,
    npZonesArr,
    routesArr,
    studyType,
  } = compDataProcessed;

  const [reportStudyType, setReportStudyType] = useState(
    studyType
      ? studyType === "Recommended"
        ? "RECOMMENDED"
        : "CURRENT"
      : reportType.includes("RECOMMENDED")
      ? "RECOMMENDED"
      : "CURRENT"
  );

  const routeDirection = routesArr.filter(
    (route) => route.Name === controlsArr[0].GroupLabel
  );

  controlsArr[0].children = controlsArr[0]?.children?.sort(
    (a, b) => Number(a.log_point) - Number(b.log_point)
  );

  const { differenceNPZ, currentZones, recommendedZones } = useMemo(() => {
    return sepStudyTypeData(npZonesArr);
  }, [npZonesArr]);

  console.log(
    differenceNPZ,
    currentZones,
    recommendedZones,
    reportType,
    compDataProcessed,
    reportStudyType
  );

  const [bControl, eControl, begControlObj, endControlObj] = useMemo(() => {
    return getControlPoints(controlsArr);
  }, [controlsArr]);

  // npZonesArr[0].children = npZonesArr[0].children?.filter(
  //   (zone) => zone.study_type === "Recommended"
  //   // (zone) => zone.study_type === "Current"
  // );

  const [foundKeysLength, setFoundKeysLength] = useState(1);

  const handleScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCanvasScale(event.target.value === "1.0" ? 1000 : 2000);
    setSearchKey((prevKey) => prevKey + 1);
  };

  // Call preload once with all the control point types
  preloadImages(controlImages);
  initializeImageMap();

  // Generate passzone
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const resultPassZone = processZones(npZonesArr as any, bControl, eControl);

  const currentPassZone = processZones(
    [{ ...npZonesArr[0], children: currentZones }] as any,
    bControl as number,
    eControl as number
  );
  const recommendedPassZone = processZones(
    [{ ...npZonesArr[0], children: recommendedZones }] as any,
    bControl as number,
    eControl as number
  );

  //below code remove double pass zone drawing
  if (reportStudyType === "RECOMMENDED") {
    currentPassZone.forEach((item) => {
      item.isDrawLine = false;
    });
  }
  if (reportStudyType === "CURRENT ") {
    recommendedPassZone.forEach((item) => {
      item.isDrawLine = false;
    });
  }

  const sortedControlsArr = useMemo(() => {
    return controlsArr[0]?.children?.sort(
      (a, b) => Number(a.log_point) - Number(b.log_point)
    );
  }, [controlsArr]);

  const milesMap = mapMilesToObject(
    Number(bControl),
    Number(eControl),
    canvasScale === 1000 ? 1.0 : 0.5
  );

  // Calculate canvasPageShift based on the first control point's log_point or search input
  const canvaspageShift = useMemo(() => {
    if (sortedControlsArr?.length === 0) return 1000; // Default shift if no control points
    const firstLogPoint = milePointSearch
      ? milesMap[milePointSearch]
      : Number(sortedControlsArr[0]?.log_point);
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

  const routeZonesRecommended = useMemo(() => {
    return combineZonesAndPass(recommendedZones, recommendedPassZone);
  }, [recommendedZones, recommendedPassZone]);

  const routeZonesCurrent = useMemo(() => {
    return combineZonesAndPass(currentZones, currentPassZone);
  }, [currentZones, currentPassZone]);

  // Calculate positions for recommended zones

  const calculateZonePositions = (zones, canvasScale, canvaspageShift) => {
    return zones?.map((item) => {
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
  };

  const recommendedArr = useMemo(() => {
    return calculateZonePositions(
      routeZonesRecommended,
      canvasScale,
      canvaspageShift
    );
  }, [routeZonesRecommended, canvasScale, canvaspageShift]);

  const currentArr = useMemo(() => {
    return calculateZonePositions(
      routeZonesCurrent,
      canvasScale,
      canvaspageShift
    );
  }, [routeZonesCurrent, canvasScale, canvaspageShift]);

  // Sort recArr based on b_trulog
  const sortedRecommendedArr = useMemo(() => {
    return recommendedArr?.sort((a, b) => {
      return Number(a.item.b_trulog) - Number(b.item.b_trulog);
    });
  }, [recommendedArr]);

  const sortedCurrentArr = useMemo(() => {
    return currentArr?.sort((a, b) => {
      return Number(a.item.b_trulog) - Number(b.item.b_trulog);
    });
  }, [currentArr]);

  // Handle the search input and force re-render
  const handleSearch = (value: string) => {
    setMilePointSearch(value);
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

  const handleScrollPageNumberRef = (value: ControlPointGroup) => {
    // if (scrollPageNumberRef.current?.items[0]?.log_point) {
    scrollPageNumberRef.current = value;

    const foundKeys = findKeysBelowLogPoint(
      milesMap,
      Number(scrollPageNumberRef.current?.items[0]?.log_point)
    );
    setFoundKeysLength(foundKeys.length);
    // }
  };


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
      <div>
        <div>
          <label htmlFor="stripeGapRatio">Stripe / Gap Ratio:</label>
          <input
            style={{ width: "50px" }}
            type="number"
            min={1}
            max={99}
            id="stripeLength"
            // value={stripeLength}
            placeholder={`${stripeLength}`}
            onChange={(e) => setStripeLength(Number(e.target.value))}
          />
          /
          <input
            style={{ width: "50px" }}
            type="number"
            min={1}
            max={99}
            id="gapLength"
            placeholder={`${gapLength}`}
            onChange={(e) => setGapLength(Number(e.target.value))}
          />
          feet
        </div>
        <div>
          <label htmlFor="compMilePointAll">Comparison Milepoints - All:</label>
          <input
            type="checkbox"
            id="compMilePointAll"
            checked={compMilePointAll}
            onChange={(e) => {
              setCompMilePointAll(e.target.checked);
              setSearchKey((prevKey) => prevKey + 1); // Force re-render
            }}
          />
        </div>
        <div>
          <label htmlFor="minDifference">Comparison Minimum Difference:</label>
          <input
            style={{ width: "60px" }}
            type="number"
            id="minDifference"
            value={minDistance}
            onChange={(e) => {
              setMinDistance(Number(e.target.value));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchKey((prevKey) => prevKey + 1); // Force re-render
              }
            }}
          />
        </div>
        <select
          value={reportStudyType}
          onChange={(e) => {
            const selectedType = e.target.value;
            setReportStudyType(selectedType);
            // if (selectedType === "RECOMMENDED" || selectedType === "CURRENT") {
            //   setSearchKey((prevKey) => prevKey + 1); // Force re-render
            // }
          }}
        >
          <option value="CURRENT">Current</option>
          <option value="RECOMMENDED">Recommended</option>
          {/* <option value="CURRENT COMP">Current Comparison</option>
          <option value="RECOMMENDED COMP">Recommended Comparison</option> */}
        </select>
      </div>
      <ReportHeader
        foundKeysLengthPage={foundKeysLength}
        pageLength={Object.keys(milesMap).length}
        routeName={controlsArr[0]?.GroupLabel}
        routeDirection={routeDirection[0]?.Direction}
        routelength={endControlObj?.log_point - begControlObj?.log_point}
        agency={agency?.agencyName}
        RouteNo={begControlObj?.route}
        bControl={`${begControlObj.log_point} ${begControlObj.descript}`}
        eControl={`${endControlObj.log_point} ${endControlObj.descript}`}
        reportType={studyType?reportStudyType:reportType}
        sortOrder={sortOrder}
        handleScaleChange={handleScaleChange}
        canvasScale={canvasScale}
        handleSearch={handleSearch}
      />
      <ColumnHeader />
      <CanvasScrollInteraction
        cpArr={groupedByPositionYArray}
        // diffZoneArr={[]}
        recArr={[...sortedCurrentArr, ...sortedRecommendedArr, ...diffZoneArr]} //***make sure difference should not get calculated in footer */
        // recArr={[...sortedRecArr]}
        canvasScale={canvasScale}
        handleScrollPageNumberRef={handleScrollPageNumberRef}
        stripeLength={stripeLength}
        gapLength={gapLength}
      />
      <MilePointModal agencyName={agency.agencyName} />
    </div>
  );
}
