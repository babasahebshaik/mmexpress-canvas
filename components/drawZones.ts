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

// Function to draw text
export function drawText(context: CanvasRenderingContext2D, items: any) {
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
  const textXbegin = 245;
  const textXend = 365;
  switch (items.item.zone_code) {
    // case "01":
    // case "02":
    // case "03":
    // case "04":
    case "07":
      drawTextchild(
        context,
        textXbegin,
        items.positionYBegin,
        items.item.b_trulog
      );
      drawTextchild(
        context,
        textXbegin,
        items.positionYEnd,
        items.item.e_trulog
      );
      break;
    case "08":
      drawTextchild(
        context,
        textXend,
        items.positionYBegin,
        items.item.b_trulog
      );
      drawTextchild(context, textXend, items.positionYEnd, items.item.e_trulog);
      break;
    case "09":
      drawTextchild(
        context,
        textXbegin,
        items.positionYBegin,
        items.item.b_trulog
      );
      drawTextchild(
        context,
        textXbegin,
        items.positionYEnd,
        items.item.e_trulog
      );
      break;
    case "10":
      drawTextchild(
        context,
        textXend,
        items.positionYBegin,
        items.item.b_trulog
      );
      drawTextchild(context, textXend, items.positionYEnd, items.item.e_trulog);
      break;
    // case "11":
    // case "12":
    default:
      drawTextchild(
        context,
        textXbegin,
        items.positionYBegin,
        items.item.b_trulog
      );
      drawTextchild(
        context,
        textXbegin,
        items.positionYEnd,
        items.item.e_trulog
      );
      drawTextchild(
        context,
        textXend,
        items.positionYBegin,
        items.item.b_trulog
      );
      drawTextchild(context, textXend, items.positionYEnd, items.item.e_trulog);
      // Handle other cases or do nothing
      break;
  }
}
const canvasX = 280;
export const drawTWLTL = (
  context: CanvasRenderingContext2D,
  positionYBegin: number,
  positionYEnd: number
) => {
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
  positionYEnd: number
) {
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
  positionYEnd: number
) {
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
) {}

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
) {}

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
}
