interface ReportHeaderProps {
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
  handleScaleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  canvasScale: number;
  milePointSearch: string;
  setMilePointSearch: (value: string) => void;
  handleSearch: () => void;
}

export const ReportHeader = ({
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
  milePointSearch,
  setMilePointSearch,
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
    `${reportTypeBase} ${reportStudyType}`.toLowerCase()
  );

  // function mapMilesToObject(start: number, end: number, scale: number) {
  //   const obj = {};
  //   let index = 1;

  //   for (let i = start; i <= end; i += scale) {
  //     obj[index] = parseFloat(i.toFixed(2)); // Ensures proper decimal formatting
  //     index++;
  //   }

  //   return obj;
  // }

  // const milesMap = mapMilesToObject(Number(startControl), Number(endControl), canvasScale === 1000 ? 1.0 : 0.5);
  // console.log(milesMap, canvasScale === 1000 ? 1.0 : 0.5,startControl, endControl);

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
              value={milePointSearch}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value > pageLength || value < 1) {
                  setMilePointSearch("1");
                } else setMilePointSearch(e.target.value);
              }}
              placeholder="1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              style={{
                width: "42px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                textAlign: "center",
                marginLeft: "4px",
              }}
            />
            <b>/{pageLength}</b>
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
