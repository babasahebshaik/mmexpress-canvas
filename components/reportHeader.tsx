import { useEffect, useState } from "react";

interface ReportHeaderProps {
  foundKeysLengthPage: number;
  pageLength: number;
  routeName: string;
  routeDirection: string;
  routelength: number;
  agency: string;
  RouteNo: string;
  bControl: string;
  eControl: string;
  reportType: string;
  sortOrder: string;
  handleScaleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  canvasScale: number;
  handleSearch: (value: string) => void;
}

export const ReportHeader = ({
  foundKeysLengthPage,
  pageLength,
  routeName,
  routeDirection,
  routelength,
  agency,
  RouteNo,
  bControl,
  eControl,
  reportType,
  sortOrder,
  canvasScale,
  handleScaleChange,
  handleSearch,
}: ReportHeaderProps) => {
  const reportStudyType = reportType.includes("RECOMMENDED")
    ? "RECOMMENDED"
    : "CURRENT";
  const reportTypeBase = reportType.includes("COMPARISON") ? "COMPARISON" : "";
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const capitalizeWords = (string: string) => {
    return string
      .split(" ")
      .map((word) => capitalizeFirstLetter(word))
      .join(" ");
  };

  const formattedReportType = capitalizeWords(
    `${reportStudyType} ${reportTypeBase} `.toLowerCase()
  );

  const [pageInput, setPageInput] = useState(foundKeysLengthPage.toString());

  useEffect(() => {
    setPageInput(foundKeysLengthPage.toString());
  }, [foundKeysLengthPage]);

  return (
    <div
      style={{
        borderBottom: "1px solid #000",
        marginBottom: "2px",
      }}
    >
      <div style={{ display: "grid", justifyContent: "center" }}>
        <h3>{agency}</h3>
        <h5 style={{ display: "flex", justifyContent: "center" }}>
          No Passing Zone Log - {formattedReportType}
        </h5>
        <h5 style={{ display: "flex", justifyContent: "center" }}>
          Ordered by: {sortOrder}
        </h5>
      </div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p style={{ fontSize: "small" }}>
            Route: <b>{RouteNo}</b>
          </p>
          <p style={{ fontSize: "small" }}>
            Length: <b>{routelength.toFixed(3)}</b>{" "}
          </p>
        </div>
        <div>
          <p style={{ fontSize: "small" }}>
            <b>{routeName}</b>
          </p>
          <p style={{ fontSize: "small" }}>
            Direction: <b>{routeDirection}</b>
          </p>
        </div>
        <div>
          <p style={{ fontSize: "small" }}>
            From: <b>{bControl}</b>{" "}
          </p>
          <p style={{ fontSize: "small" }}>
            To: <b>{eControl}</b>{" "}
          </p>
        </div>
        <div>
          <p style={{ fontSize: "small" }}>
            Page:
            <input
              type="number"
              value={pageInput}
              onChange={(e) => {
                const value = e.target.value;
                if (Number(value) > pageLength || Number(value) < 1) {
                  setPageInput("");
                } else setPageInput(value);
              }}
              placeholder="1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(pageInput);
                }
              }}
              style={{
                width: "42px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                textAlign: "center",
                marginLeft: "6px",
              }}
            />
            <b> /{pageLength}</b>
          </p>
          <p style={{ fontSize: "small" }}>
            Scale:{" "}
            <b>
              {" "}
              <select
                id="scaleSelect"
                value={canvasScale === 1000 ? "1.0" : "0.5"}
                onChange={handleScaleChange}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                <option value="1.0">1.0</option>
                <option value="0.5">0.5</option>
              </select>
              mi/pg
            </b>
          </p>
        </div>
      </div>
    </div>
  );
};
