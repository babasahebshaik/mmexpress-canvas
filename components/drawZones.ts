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
const canvasX = 280;
export const drawTWLTL = (
  context: CanvasRenderingContext2D,
  positionY: number
) => {
  drawLineWithStyle(
    context,
    canvasX + 0,
    positionY,
    canvasX + 0,
    positionY + 50
  );
  drawLineWithStyle(
    context,
    canvasX + 15,
    positionY,
    canvasX + 15,
    positionY + 50,
    [5, 5]
  );
  drawLineWithStyle(
    context,
    canvasX + 35,
    positionY,
    canvasX + 35,
    positionY + 50,
    [5, 5]
  );
  drawLineWithStyle(
    context,
    canvasX + 50,
    positionY,
    canvasX + 50,
    positionY + 50
  );
};

// Function to draw 2DBYL pattern
export function draw2DBYL(
  context: CanvasRenderingContext2D,
  positionY: number
) {
  // Line 1
  drawLineWithStyle(context, 100, positionY, 100, positionY + 50);
  // Line 2
  drawLineWithStyle(context, 115, positionY, 115, positionY + 50);
  // Line 3
  drawLineWithStyle(context, 135, positionY, 135, positionY + 50);
  // Line 4
  drawLineWithStyle(context, 150, positionY, 150, positionY + 50);
}

// Function to draw LTLSAME pattern
export function drawLTLSAME(
  context: CanvasRenderingContext2D,
  positionY: number
) {
  // Line 1
  drawLineWithStyle(context, 100, positionY, 100, positionY + 50);
  // Line 2
  drawLineWithStyle(context, 115, positionY, 115, positionY + 50);
}

// Function to draw LTLOPP pattern
export function drawLTLOPP(
  context: CanvasRenderingContext2D,
  positionY: number
) {
  // Line 1
  drawLineWithStyle(context, 135, positionY, 135, positionY + 50);
  // Line 2
  drawLineWithStyle(context, 150, positionY, 150, positionY + 50);
}

// Function to draw LTLOPP pattern
export function drawNONE(
  context: CanvasRenderingContext2D,
  positionY: number
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
    positionYEnd + 50
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
    positionYEnd + 50
  );
}

export function drawLPass(
  context: CanvasRenderingContext2D,
  positionY: number
) {
  // Line 1
  drawLineWithStyle(context, 115, positionY, 115, positionY + 50, [5, 5]);
}

export function drawRPass(
  context: CanvasRenderingContext2D,
  positionY: number
) {
  // Line 1
  drawLineWithStyle(context, 135, positionY, 135, positionY + 50, [5, 5]);
}
// Function to draw Excluded pattern
export function drawExcluded(
  context: CanvasRenderingContext2D,
  positionY: number
) {}

// Function to draw Undetermined pattern
export function drawUndetermined(
  context: CanvasRenderingContext2D,
  positionY: number
) {
  // Draw ?? at the center of the box
  context.font = "36px Arial"; // Adjust font size
  context.fillStyle = "black"; // Text color
  context.textAlign = "center";
  context.textBaseline = "middle"; // Align text vertically
  context.fillText("??", 125, 100); // Center of the box
}
