import { useMemo, useState } from "react";
import { CanvasScrollInteraction } from "./CanvasScroll";
import { data } from "./data.js";
import { processZones } from "./helperFunction";
import MilePointModal from "./MilePointModal";
import { initializeImageMap, preloadImages } from "./image-module";

// Per pixel * per mile point in canvas window
const canvasScale = 1 * 1000;

export function Canva() {
  const [milePointSearch, setMilePointSearch] = useState("");
  const [searchKey, setSearchKey] = useState(0); // Key to force re-render
  const { agency, controlsArr, npZonesArr } = data;
  const controlImages = [
    "County Boundary",
    "MAINTENANCE BOUNDARY",
    "Township Boundary",
    "Corporation Limit",
    "State Boundary",
    "Bridge (Hwy Over Railroad)",
    "Bridge",
    "1-lane Bridge",
    "Bridge (Hwy Over Hwy)",
    "Cul De Sac",
    "Road End",
    "Hwy Under Railroad",
    "Hwy Under Hwy",
    "Intersection",
    "Miscellaneous",
    "Railroad",
    "School Zone",
    "Speed Zone",
    "1-lane Tunnel",
    "Tunnel",
  ];

  // Call preload once with all the control point types
  preloadImages(controlImages);
  initializeImageMap();
  // Generate passzone
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resultPassZone = processZones(npZonesArr as any);

  const sortedControlsArr = useMemo(() => {
    return controlsArr[0].children.sort(
      (a, b) => Number(a.log_point) - Number(b.log_point)
    );
  }, [controlsArr]);

  // Calculate canvasPageShift based on the first control point's log_point or search input
  const canvaspageShift = useMemo(() => {
    if (sortedControlsArr.length === 0) return 790; // Default shift if no control points
    const firstLogPoint = milePointSearch
      ? Number(milePointSearch)
      : Number(sortedControlsArr[0].log_point);
    return Math.round(firstLogPoint * canvasScale) + 790;
  }, [sortedControlsArr, milePointSearch]);

  // Calculate positions for control points
  const cpArr = useMemo(() => {
    return sortedControlsArr.map((item) => {
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
  const recommendedZones = useMemo(() => {
    let zones = npZonesArr[0].children.filter(
      (zone) => zone.study_type === "Recommended"
    );
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
    return recommendedZones.map((item) => {
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
  }, [recommendedZones, canvaspageShift]);

  // Handle the search input and force re-render
  const handleSearch = () => {
    if (!milePointSearch || isNaN(Number(milePointSearch))) {
      alert("Please enter a valid mile point.");
      return;
    }
    setSearchKey((prevKey) => prevKey + 1); // Increment key to trigger re-render
  };

  return (
    <div
      key={searchKey} // Force re-render of the entire component
      className="App"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "98vh",
        flexDirection: "column",
      }}
    >
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          value={milePointSearch}
          onChange={(e) => setMilePointSearch(e.target.value)}
          placeholder="Enter mile point"
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginRight: "10px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "8px 12px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "600px",
          padding: "0px 60px 0px 60px",
        }}
      >
        <h5>Control Points</h5>
        <h5 style={{ marginLeft: "20px" }}>Length</h5>
        <h5 style={{ marginRight: "20px" }}>Left</h5>
        <h5 style={{ position: "relative", right: "7px" }}>C/L</h5>
        <h5>Right</h5>
        <h5>Length</h5>
        <h5>Control Points</h5>
      </div>
      <CanvasScrollInteraction
        cpArr={groupedByPositionYArray}
        recArr={recArr}
      />
      <MilePointModal  agencyName={agency.agencyName}/>
    </div>
  );
}
