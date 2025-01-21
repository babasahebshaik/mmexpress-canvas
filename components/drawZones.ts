const drawLineWithStyle = (
  context: CanvasRenderingContext2D,
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
interface NPZones {
  positionYBegin: number;
  positionYEnd: number;
  item: {
    b_trulog: string;
    e_trulog: string;
    zone_code: string;
  };
}
export const drawConjuction = (
  context: CanvasRenderingContext2D,
  canvasX: number,
  positionYBegin: number,
  positionYEnd: number,
  startConjunction: NPZones[],
  endConjunction: NPZones[],
  subractValue: number,
  line1PointsX: number[],
  line2PointsX: number[],
  line3PointsX: number[],
  line4PointsX: number[]
) => {
  // Line 1
  drawLineWithStyle(
    context,
    line1PointsX[0],
    positionYBegin,
    line1PointsX[1],
    positionYEnd
  );
  // Line 2
  drawLineWithStyle(
    context,
    line2PointsX[0],
    positionYBegin,
    line2PointsX[1],
    positionYEnd
  );
  // Line 3
  drawLineWithStyle(
    context,
    line3PointsX[0],
    positionYBegin,
    line3PointsX[1],
    positionYEnd
  );
  // Line 4
  drawLineWithStyle(
    context,
    line4PointsX[0],
    positionYBegin,
    line4PointsX[1],
    positionYEnd
  );
};
// Function to draw distance log text
export const drawDistanceText = (
  context: CanvasRenderingContext2D,
  items: any
) => {
  const colorCode = {
    "01": "red",
    "02": "red",
    "03": "red",
    "04": "red",
    "06": "Purple",
    "07": "red",
    "08": "red",
    "09": "green",
    "10": "green",
    "11": "Purple",
    "12": "Purple",
  };
  const color = colorCode[items.item.zone_code] ;
  const textXbegin = 215;
  const textXend = 395;
  const TextYcordinate = (items.positionYEnd + items.positionYBegin) / 2;
  const distanceText = (items.item.e_trulog - items.item.b_trulog).toFixed(3);
  const drawDistancechild = (
    context: CanvasRenderingContext2D,
    textXbegin: number,
    positionYEnd: number,
    label: string
  ) => {
    // Draw ?? at the center of the box
    context.font = "9px Arial"; // Adjust font size
    context.fillStyle = color; // Text color
    context.textAlign = "center";
    context.textBaseline = "middle"; // Align text vertically
    context.fillText(label, textXbegin, positionYEnd); // Center of the box
  };

  switch (items.item.zone_code) {
    // case "01":
    // case "02":
    case "03":
      drawDistancechild(context, textXbegin, TextYcordinate, distanceText);
      break;
    case "04":
      drawDistancechild(context, textXend, TextYcordinate, distanceText);
      break;
    case "07":
      drawDistancechild(context, textXbegin, TextYcordinate, distanceText);
      break;
    case "08":
      drawDistancechild(context, textXend, TextYcordinate, distanceText);
      break;
    case "09":
      drawDistancechild(context, textXbegin, TextYcordinate, distanceText);
      break;
    case "10":
      drawDistancechild(context, textXend, TextYcordinate, distanceText);
      break;
    // case "11":
    // case "12":
    default:
      drawDistancechild(context, textXbegin, TextYcordinate, distanceText);
      drawDistancechild(context, textXend, TextYcordinate, distanceText);
      // Handle other cases or do nothing
      break;
  }
};
// Function to draw text
export function drawText(context: CanvasRenderingContext2D, items: any) {
  const textXbegin = 245;
  const textXend = 365;

  const beginLog = items.item.b_trulog.toFixed(3);
  const endLog = items.item.e_trulog.toFixed(3);
  const drawTextchild = (
    context: CanvasRenderingContext2D,
    positionYBegin: number,
    positionYEnd: number,
    label: string
  ) => {
    // Draw ?? at the center of the box
    context.font = "9px Arial"; // Adjust font size
    context.fillStyle = "black"; // Text color
    context.textAlign = "center";
    context.textBaseline = "middle"; // Align text vertically
    context.fillText(label, positionYBegin, positionYEnd); // Center of the box
  };

  switch (items.item.zone_code) {
    // case "01":
    // case "02":
    // case "03":
    // case "04":
    case "07":
      drawTextchild(context, textXbegin, items.positionYBegin, beginLog);
      drawTextchild(context, textXbegin, items.positionYEnd, endLog);
      break;
    case "08":
      drawTextchild(context, textXend, items.positionYBegin, beginLog);
      drawTextchild(context, textXend, items.positionYEnd, endLog);
      break;
    case "09":
      drawTextchild(context, textXbegin, items.positionYBegin, beginLog);
      drawTextchild(context, textXbegin, items.positionYEnd, endLog);
      break;
    case "10":
      drawTextchild(context, textXend, items.positionYBegin, beginLog);
      drawTextchild(context, textXend, items.positionYEnd, endLog);
      break;
    // case "11":
    // case "12":
    default:
      drawTextchild(context, textXbegin, items.positionYBegin, beginLog);
      drawTextchild(context, textXbegin, items.positionYEnd, endLog);
      drawTextchild(context, textXend, items.positionYBegin, beginLog);
      drawTextchild(context, textXend, items.positionYEnd, endLog);
      // Handle other cases or do nothing
      break;
  }
}
const canvasX = 280;
export const drawTWLTL = (
  context: CanvasRenderingContext2D,
  positionYBegin: number,
  positionYEnd: number,
  startConjunction: NPZones[],
  endConjunction: NPZones[]
) => {
  startConjunction = startConjunction.flat();
  endConjunction = endConjunction.flat();
  const subractValue = 5;
  let line1 = [canvasX + 15, canvasX + 0];
  let line2 = [canvasX + 25, canvasX + 15];
  let line3 = [canvasX + 25, canvasX + 35];
  let line4 = [canvasX + 35, canvasX + 50];
  if (startConjunction?.length > 1) {
    drawConjuction(
      context,
      canvasX,
      positionYBegin,
      positionYBegin - subractValue,
      startConjunction,
      endConjunction,
      subractValue,
      line1,
      line2,
      line3,
      line4
    );
    positionYBegin = positionYBegin - subractValue;
  } else if (startConjunction?.length === 1) {
    if (startConjunction[0]?.item?.zone_code === "03") {
      line1 = [canvasX + 0, canvasX + 0];
      line2 = [canvasX + 15, canvasX + 15];
      line3 = [canvasX + 35, canvasX + 15];
      line4 = [canvasX + 50, canvasX + 15];
      drawConjuction(
        context,
        canvasX,
        positionYBegin,
        positionYBegin - subractValue,
        startConjunction,
        endConjunction,
        subractValue,
        line1,
        line2,
        line3,
        line4
      );
      positionYBegin = positionYBegin - subractValue;
    }
    if (startConjunction[0]?.item?.zone_code === "04") {
      line1 = [canvasX + 35, canvasX + 0];
      line2 = [canvasX + 35, canvasX + 15];
      line3 = [canvasX + 35, canvasX + 35];
      line4 = [canvasX + 50, canvasX + 50];
      drawConjuction(
        context,
        canvasX,
        positionYBegin,
        positionYBegin - subractValue,
        startConjunction,
        endConjunction,
        subractValue,
        line1,
        line2,
        line3,
        line4
      );
      positionYBegin = positionYBegin - subractValue;
    }
    if (startConjunction[0]?.item?.zone_code === "07") {
      line1 = [canvasX + 15, canvasX + 0];
      line2 = [canvasX + 25, canvasX + 15];
      line3 = [canvasX + 35, canvasX + 35];
      line4 = [canvasX + 50, canvasX + 50];
      drawConjuction(
        context,
        canvasX,
        positionYBegin,
        positionYBegin - subractValue,
        startConjunction,
        endConjunction,
        subractValue,
        line1,
        line2,
        line3,
        line4
      );
      positionYBegin = positionYBegin - subractValue;
    }
    if (startConjunction[0]?.item?.zone_code === "08") {
      line1 = [canvasX + 0, canvasX + 0];
      line2 = [canvasX + 15, canvasX + 15];
      line3 = [canvasX + 35, canvasX + 25];
      line4 = [canvasX + 50, canvasX + 35];

      drawConjuction(
        context,
        canvasX,
        positionYBegin,
        positionYBegin - subractValue,
        startConjunction,
        endConjunction,
        subractValue,
        line1,
        line2,
        line3,
        line4
      );
      positionYBegin = positionYBegin - subractValue;
    }
  }

  if (endConjunction?.length > 1) {
    line1 = [canvasX + 0, canvasX + 15];
    line2 = [canvasX + 15, canvasX + 25];
    line3 = [canvasX + 35, canvasX + 25];
    line4 = [canvasX + 50, canvasX + 35];
    drawConjuction(
      context,
      canvasX,
      positionYEnd + subractValue,
      positionYEnd,
      startConjunction,
      endConjunction,
      subractValue,
      line1,
      line2,
      line3,
      line4
    );
    positionYEnd = positionYEnd + subractValue;
  } else if (endConjunction?.length === 1) {
    if (endConjunction[0]?.item?.zone_code === "03") {
      line1 = [canvasX + 0, canvasX + 0];
      line2 = [canvasX + 15, canvasX + 15];
      line3 = [canvasX + 35, canvasX + 15];
      line4 = [canvasX + 50, canvasX + 15];
      drawConjuction(
        context,
        canvasX,
        positionYEnd + subractValue,
        positionYEnd,
        startConjunction,
        endConjunction,
        subractValue,
        line1,
        line2,
        line3,
        line4
      );
      positionYEnd = positionYEnd + subractValue;
    }
    if (endConjunction[0]?.item?.zone_code === "04") {
      line1 = [canvasX + 35, canvasX + 0];
      line2 = [canvasX + 35, canvasX + 15];
      line3 = [canvasX + 35, canvasX + 25];
      line4 = [canvasX + 50, canvasX + 35];
      drawConjuction(
        context,
        canvasX,
        positionYEnd + subractValue,
        positionYEnd,
        startConjunction,
        endConjunction,
        subractValue,
        line1,
        line2,
        line3,
        line4
      );
      positionYEnd = positionYEnd + subractValue;
    }
    if (endConjunction[0]?.item?.zone_code === "07") {
      line1 = [canvasX + 0, canvasX + 15];
      line2 = [canvasX + 15, canvasX + 25];
      line3 = [canvasX + 35, canvasX + 35];
      line4 = [canvasX + 50, canvasX + 50];
      drawConjuction(
        context,
        canvasX,
        positionYEnd + subractValue,
        positionYEnd,
        startConjunction,
        endConjunction,
        subractValue,
        line1,
        line2,
        line3,
        line4
      );
      positionYEnd = positionYEnd + subractValue;
    }
    if (endConjunction[0]?.item?.zone_code === "08") {
      line1 = [canvasX + 0, canvasX + 0];
      line2 = [canvasX + 15, canvasX + 15];
      line3 = [canvasX + 35, canvasX + 25];
      line4 = [canvasX + 50, canvasX + 35];

      drawConjuction(
        context,
        canvasX,
        positionYEnd + subractValue,
        positionYEnd,
        startConjunction,
        endConjunction,
        subractValue,
        line1,
        line2,
        line3,
        line4
      );
      positionYEnd = positionYEnd + subractValue;
    }
  }

  drawLineWithStyle(
    context,
    canvasX + 0,
    positionYBegin,
    canvasX + 0,
    positionYEnd
  );
  drawLineWithStyle(
    context,
    canvasX + 15,
    positionYBegin,
    canvasX + 15,
    positionYEnd,
    [5, 5]
  );
  drawLineWithStyle(
    context,
    canvasX + 35,
    positionYBegin,
    canvasX + 35,
    positionYEnd,
    [5, 5]
  );
  drawLineWithStyle(
    context,
    canvasX + 50,
    positionYBegin,
    canvasX + 50,
    positionYEnd
  );
};

// Function to draw 2DBYL pattern
export function draw2DBYL(
  context: CanvasRenderingContext2D,
  positionYBegin: number,
  positionYEnd: number,
  startConjunction: NPZones[],
  endConjunction: NPZones[]
) {
  const subractValue = 5;
  let line1 = [canvasX + 15, canvasX + 0];
  let line2 = [canvasX + 25, canvasX + 15];
  let line3 = [canvasX + 25, canvasX + 35];
  let line4 = [canvasX + 35, canvasX + 50];

  const drawConjunctionForZone = (
    zoneCode: string,
    positionY: number,
    isStart: boolean
  ) => {
    switch (zoneCode) {
      case "03":
        line1 = [canvasX + 0, canvasX + 0];
        line2 = [canvasX + 15, canvasX + 15];
        line3 = [canvasX + 35, canvasX + 15];
        line4 = [canvasX + 50, canvasX + 15];
        break;
      case "04":
        line1 = [canvasX + 35, canvasX + 0];
        line2 = [canvasX + 35, canvasX + 15];
        line3 = [canvasX + 35, canvasX + 35];
        line4 = [canvasX + 50, canvasX + 50];
        break;
      case "07":
        line1 = [canvasX + 15, canvasX + 0];
        line2 = [canvasX + 25, canvasX + 15];
        line3 = [canvasX + 35, canvasX + 35];
        line4 = [canvasX + 50, canvasX + 50];
        break;
      case "08":
        line1 = [canvasX + 0, canvasX + 0];
        line2 = [canvasX + 15, canvasX + 15];
        line3 = [canvasX + 35, canvasX + 25];
        line4 = [canvasX + 50, canvasX + 35];
        break;
      default:
        break;
    }

    const newPositionY = isStart
      ? positionY - subractValue
      : positionY + subractValue;
    drawConjuction(
      context,
      canvasX,
      isStart ? positionY : newPositionY,
      isStart ? newPositionY : positionY,
      startConjunction,
      endConjunction,
      subractValue,
      line1,
      line2,
      line3,
      line4
    );

    return newPositionY;
  };

  if (startConjunction?.length > 1) {
    drawConjuction(
      context,
      canvasX,
      positionYBegin,
      positionYBegin - subractValue,
      startConjunction,
      endConjunction,
      subractValue,
      line1,
      line2,
      line3,
      line4
    );
    positionYBegin -= subractValue;
  } else if (startConjunction?.length === 1) {
    positionYBegin = drawConjunctionForZone(
      startConjunction[0].item.zone_code,
      positionYBegin,
      true
    );
  }

  if (endConjunction?.length > 1) {
    line1 = [canvasX + 0, canvasX + 15];
    line2 = [canvasX + 15, canvasX + 25];
    line3 = [canvasX + 35, canvasX + 25];
    line4 = [canvasX + 50, canvasX + 35];
    drawConjuction(
      context,
      canvasX,
      positionYEnd + subractValue,
      positionYEnd,
      startConjunction,
      endConjunction,
      subractValue,
      line1,
      line2,
      line3,
      line4
    );
    positionYEnd += subractValue;
  } else if (endConjunction?.length === 1) {
    positionYEnd = drawConjunctionForZone(
      endConjunction[0].item.zone_code,
      positionYEnd,
      false
    );
  }

  // Line 1
  drawLineWithStyle(
    context,
    canvasX + 0,
    positionYBegin,
    canvasX + 0,
    positionYEnd
  );
  // Line 2
  drawLineWithStyle(
    context,
    canvasX + 15,
    positionYBegin,
    canvasX + 15,
    positionYEnd
  );
  // Line 3
  drawLineWithStyle(
    context,
    canvasX + 35,
    positionYBegin,
    canvasX + 35,
    positionYEnd
  );
  // Line 4
  drawLineWithStyle(
    context,
    canvasX + 50,
    positionYBegin,
    canvasX + 50,
    positionYEnd
  );
}

// Function to draw LTLSAME pattern
export function drawLTLSAME(
  context: CanvasRenderingContext2D,
  positionYBegin: number,
  positionYEnd: number,
  startConjunction: NPZones[],
  endConjunction: NPZones[]
) {
  startConjunction = startConjunction.flat();
  endConjunction = endConjunction.flat();
  const subractValue = 5;
  let line1 = [canvasX + 15, canvasX + 0];
  let line2 = [canvasX + 15, canvasX + 0];
  let line3 = [canvasX + 35, canvasX + 15];
  let line4 = [canvasX + 35, canvasX + 15];
  if (startConjunction?.length > 1) {
    drawConjuction(
      context,
      canvasX,
      positionYBegin,
      positionYBegin - subractValue,
      startConjunction,
      endConjunction,
      subractValue,
      line1,
      line2,
      line3,
      line4
    );
    positionYBegin = positionYBegin - subractValue;
  } else if (startConjunction?.length === 1) {
    if (startConjunction[0]?.item?.zone_code === "07") {
      line1 = [canvasX + 15, canvasX + 0];
      line2 = [canvasX + 25, canvasX + 15];
      line3 = [canvasX + 35, canvasX + 35];
      line4 = [canvasX + 50, canvasX + 50];
      drawConjuction(
        context,
        canvasX,
        positionYBegin,
        positionYBegin - subractValue,
        startConjunction,
        endConjunction,
        subractValue,
        line1,
        line2,
        line3,
        line4
      );
      positionYBegin = positionYBegin - subractValue;
    }
    if (startConjunction[0]?.item?.zone_code === "08") {
      line1 = [canvasX + 0, canvasX + 0];
      line2 = [canvasX + 15, canvasX + 15];
      line3 = [canvasX + 35, canvasX + 25];
      line4 = [canvasX + 50, canvasX + 35];

      drawConjuction(
        context,
        canvasX,
        positionYBegin,
        positionYBegin - subractValue,
        startConjunction,
        endConjunction,
        subractValue,
        line1,
        line2,
        line3,
        line4
      );
      positionYBegin = positionYBegin - subractValue;
    }
  }

  if (endConjunction?.length > 1) {
    line1 = [canvasX + 0, canvasX + 15];
    line2 = [canvasX + 15, canvasX + 25];
    line3 = [canvasX + 35, canvasX + 25];
    line4 = [canvasX + 50, canvasX + 35];
    drawConjuction(
      context,
      canvasX,
      positionYEnd + subractValue,
      positionYEnd,
      startConjunction,
      endConjunction,
      subractValue,
      line1,
      line2,
      line3,
      line4
    );
    positionYEnd = positionYEnd + subractValue;
  } else if (endConjunction?.length === 1) {
    if (endConjunction[0]?.item?.zone_code === "04") {
      line1 = [canvasX + 35, canvasX + 0];
      line2 = [canvasX + 35, canvasX + 15];
      line3 = [canvasX + 35, canvasX + 25];
      line4 = [canvasX + 50, canvasX + 35];
      drawConjuction(
        context,
        canvasX,
        positionYEnd + subractValue,
        positionYEnd,
        startConjunction,
        endConjunction,
        subractValue,
        line1,
        line2,
        line3,
        line4
      );
      positionYEnd = positionYEnd + subractValue;
    }
    if (endConjunction[0]?.item?.zone_code === "07") {
      line1 = [canvasX + 0, canvasX + 15];
      line2 = [canvasX + 15, canvasX + 25];
      line3 = [canvasX + 35, canvasX + 35];
      line4 = [canvasX + 50, canvasX + 50];
      drawConjuction(
        context,
        canvasX,
        positionYEnd + subractValue,
        positionYEnd,
        startConjunction,
        endConjunction,
        subractValue,
        line1,
        line2,
        line3,
        line4
      );
      positionYEnd = positionYEnd + subractValue;
    }
    if (endConjunction[0]?.item?.zone_code === "08") {
      line1 = [canvasX + 0, canvasX + 0];
      line2 = [canvasX + 15, canvasX + 15];
      line3 = [canvasX + 35, canvasX + 25];
      line4 = [canvasX + 50, canvasX + 35];

      drawConjuction(
        context,
        canvasX,
        positionYEnd + subractValue,
        positionYEnd,
        startConjunction,
        endConjunction,
        subractValue,
        line1,
        line2,
        line3,
        line4
      );
      positionYEnd = positionYEnd + subractValue;
    }
  }
  // Line 1
  drawLineWithStyle(
    context,
    canvasX + 0,
    positionYBegin,
    canvasX + 0,
    positionYEnd
  );
  // Line 2
  drawLineWithStyle(
    context,
    canvasX + 15,
    positionYBegin,
    canvasX + 15,
    positionYEnd
  );
}

// Function to draw LTLOPP pattern
export function drawLTLOPP(
  context: CanvasRenderingContext2D,
  positionYBegin: number,
  positionYEnd: number,
  startConjunction: NPZones[],
  endConjunction: NPZones[]
) {
  console.log(endConjunction, startConjunction);
  startConjunction = startConjunction.flat();
  endConjunction = endConjunction.flat();
  const subractValue = 5;
  let line1 = [canvasX + 15, canvasX + 35];
  let line2 = [canvasX + 15, canvasX + 35];
  let line3 = [canvasX + 35, canvasX + 50];
  let line4 = [canvasX + 35, canvasX + 50];
  if (startConjunction?.length > 1) {
    drawConjuction(
      context,
      canvasX,
      positionYBegin,
      positionYBegin - subractValue,
      startConjunction,
      endConjunction,
      subractValue,
      line1,
      line2,
      line3,
      line4
    );
    positionYBegin = positionYBegin - subractValue;
  } else if (startConjunction?.length === 1) {
    if (startConjunction[0]?.item?.zone_code === "07") {
      line1 = [canvasX + 15, canvasX + 0];
      line2 = [canvasX + 25, canvasX + 15];
      line3 = [canvasX + 35, canvasX + 35];
      line4 = [canvasX + 50, canvasX + 50];
      drawConjuction(
        context,
        canvasX,
        positionYBegin,
        positionYBegin - subractValue,
        startConjunction,
        endConjunction,
        subractValue,
        line1,
        line2,
        line3,
        line4
      );
      positionYBegin = positionYBegin - subractValue;
    }
    if (startConjunction[0]?.item?.zone_code === "08") {
      line1 = [canvasX + 0, canvasX + 0];
      line2 = [canvasX + 15, canvasX + 15];
      line3 = [canvasX + 35, canvasX + 25];
      line4 = [canvasX + 50, canvasX + 35];

      drawConjuction(
        context,
        canvasX,
        positionYBegin,
        positionYBegin - subractValue,
        startConjunction,
        endConjunction,
        subractValue,
        line1,
        line2,
        line3,
        line4
      );
      positionYBegin = positionYBegin - subractValue;
    }
  }

  if (endConjunction?.length > 1) {
    line1 = [canvasX + 0, canvasX + 15];
    line2 = [canvasX + 15, canvasX + 25];
    line3 = [canvasX + 35, canvasX + 25];
    line4 = [canvasX + 50, canvasX + 35];
    drawConjuction(
      context,
      canvasX,
      positionYEnd + subractValue,
      positionYEnd,
      startConjunction,
      endConjunction,
      subractValue,
      line1,
      line2,
      line3,
      line4
    );
    positionYEnd = positionYEnd + subractValue;
  } else if (endConjunction?.length === 1) {
    if (endConjunction[0]?.item?.zone_code === "03") {
      line1 = [canvasX + 0, canvasX + 0];
      line2 = [canvasX + 15, canvasX + 15];
      line3 = [canvasX + 35, canvasX + 15];
      line4 = [canvasX + 50, canvasX + 15];
      drawConjuction(
        context,
        canvasX,
        positionYEnd + subractValue,
        positionYEnd,
        startConjunction,
        endConjunction,
        subractValue,
        line1,
        line2,
        line3,
        line4
      );
      positionYEnd = positionYEnd + subractValue;
    }

    if (endConjunction[0]?.item?.zone_code === "07") {
      line1 = [canvasX + 0, canvasX + 15];
      line2 = [canvasX + 15, canvasX + 25];
      line3 = [canvasX + 35, canvasX + 35];
      line4 = [canvasX + 50, canvasX + 50];
      drawConjuction(
        context,
        canvasX,
        positionYEnd + subractValue,
        positionYEnd,
        startConjunction,
        endConjunction,
        subractValue,
        line1,
        line2,
        line3,
        line4
      );
      positionYEnd = positionYEnd + subractValue;
    }
    if (endConjunction[0]?.item?.zone_code === "08") {
      line1 = [canvasX + 0, canvasX + 0];
      line2 = [canvasX + 15, canvasX + 15];
      line3 = [canvasX + 35, canvasX + 25];
      line4 = [canvasX + 50, canvasX + 35];

      drawConjuction(
        context,
        canvasX,
        positionYEnd + subractValue,
        positionYEnd,
        startConjunction,
        endConjunction,
        subractValue,
        line1,
        line2,
        line3,
        line4
      );
      positionYEnd = positionYEnd + subractValue;
    }
  }
  // Line 1
  drawLineWithStyle(
    context,
    canvasX + 35,
    positionYBegin,
    canvasX + 35,
    positionYEnd
  );
  // Line 2
  drawLineWithStyle(
    context,
    canvasX + 50,
    positionYBegin,
    canvasX + 50,
    positionYEnd
  );
}

// Function to draw LTLOPP pattern
export function drawNONE(
  context: CanvasRenderingContext2D,
  positionYBegin: number,
  positionYEnd: number
) {
  // console.log("NONE", positionYBegin, positionYEnd);
}

//function to draw L No Passing Zone
export function drawLNoPass(
  context: CanvasRenderingContext2D,
  positionYBegin: number,
  positionYEnd: number
) {
  // Line 1
  drawLineWithStyle(
    context,
    canvasX + 15,
    positionYBegin,
    canvasX + 15,
    positionYEnd
  );
}

export function drawRNoPass(
  context: CanvasRenderingContext2D,
  positionYBegin: number,
  positionYEnd: number
) {
  // Line 1
  drawLineWithStyle(
    context,
    canvasX + 35,
    positionYBegin,
    canvasX + 35,
    positionYEnd
  );
}

export function drawLPass(
  context: CanvasRenderingContext2D,
  positionYBegin: number,
  positionYEnd: number
) {
  // Line 1
  drawLineWithStyle(
    context,
    canvasX + 15,
    positionYBegin,
    canvasX + 15,
    positionYEnd,
    [5, 5]
  );
}

export function drawRPass(
  context: CanvasRenderingContext2D,
  positionYBegin: number,
  positionYEnd: number
) {
  // Line 1
  drawLineWithStyle(
    context,
    canvasX + 35,
    positionYBegin,
    canvasX + 35,
    positionYEnd,
    [5, 5]
  );
}
// Function to draw Excluded pattern
export function drawExcluded(
  context: CanvasRenderingContext2D,
  positionYBegin: number,
  positionYEnd: number
) {
  // console.log("Excluded", positionYBegin, positionYEnd);
}

// Function to draw Undetermined pattern
export function drawUndetermined(
  context: CanvasRenderingContext2D,
  positionYBegin: number,
  positionYEnd: number
) {
  // Draw ?? at the center of the box
  context.font = "36px Arial"; // Adjust font size
  context.fillStyle = "black"; // Text color
  context.textAlign = "center";
  context.textBaseline = "middle"; // Align text vertically
  context.fillText("??", 125, 100); // Center of the box
  // console.log("Undetermined", positionYBegin, positionYEnd);
}
