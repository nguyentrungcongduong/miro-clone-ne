import { IReplayDrawing, yDocStore } from "../../../../../store/yDoc";

function useDrawOnCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    function adjustCanvasSize() {
        const ratio = window.devicePixelRatio || 1;
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        ctx.scale(ratio, ratio);
    }

    function loadCachedGrid() {
        adjustCanvasSize();
    }

    function trackMousePosition(event: any) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }

    function replayDrawing() {

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        loadCachedGrid();
        yDocStore.arrayDrawing.forEach((path) => {
            ctx.strokeStyle = path[0]?.strokeStyle; // Set the stroke style from the first point
            ctx.beginPath();
            path.forEach((point) => {
                if (point.type === "start") {
                    ctx.moveTo(point.x, point.y); // Move to the start point
                } else if (point.type === "drawing") {
                    ctx.lineTo(point.x, point.y); // Draw lines to subsequent points
                }
            });
            ctx.lineWidth = 3;
            ctx.stroke(); // Stroke the path
            ctx.closePath(); // Close the path
        });
    }

    function drawOnCanvas() {
        let drawing = false;
        let drawingPath = [] as Array<IReplayDrawing>;

        canvas.addEventListener("mousedown", function (event: any) {
            drawing = true;
            const mousePos = trackMousePosition(event);
            ctx.strokeStyle = "blue";
            ctx.lineWidth = 3;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';

            ctx.beginPath();
            ctx.moveTo(mousePos.x, mousePos.y);
            drawingPath.push({
                x: mousePos.x,
                y: mousePos.y,
                type: "start",
                strokeStyle: "blue",
            });
        });

        canvas.addEventListener("mousemove", function (event: any) {
            if (drawing) {
                const mousePos = trackMousePosition(event);
                ctx.lineTo(mousePos.x, mousePos.y);
                ctx.stroke();

                drawingPath.push({
                    x: mousePos.x,
                    y: mousePos.y,
                    type: "drawing",
                    strokeStyle: "blue",
                });
            }
        });

        canvas.addEventListener("mouseup", function (event: any) {
            if (drawing) {
                drawing = false;
                yDocStore.arrayDrawing.push([...drawingPath]);
                yDocStore.yArrayDrawing.insert(0, [[...drawingPath]]);
                drawingPath = [];
                ctx.closePath();
            }
        });

        canvas.addEventListener("mouseleave", function (event: any) {
            if (drawing) {
                drawing = false;
                yDocStore.arrayDrawing.push([...drawingPath]);
                yDocStore.yArrayDrawing.insert(0, [[...drawingPath]]);
                drawingPath = [];
                ctx.closePath();
            }
        });

        loadCachedGrid();
    }

    function initCanvas() {
        const arrayLength = yDocStore.arrayDrawing.length
        yDocStore.yArrayDrawing.delete(0, arrayLength);
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    }

    function undo() {

        let index = 0;
        if (index >= 0) {
            const drawingPath = yDocStore.yArrayDrawing.get(index);
            yDocStore.redoDrawingArray.push(drawingPath);

            yDocStore.yArrayDrawing.delete(index, 1);
            replayDrawing();
            loadCachedGrid();
        }
    }

    function redo() {

        if (yDocStore.redoDrawingArray.length > 0) {
            const redo = yDocStore.redoDrawingArray.pop();

            yDocStore.yArrayDrawing.insert(0, [redo]);
            replayDrawing();
            loadCachedGrid();
        }
    }



    return { drawOnCanvas, replayDrawing, undo, redo, initCanvas };
}



export function useCanvas() {

    function selectCanvas() {
        return new Promise<{ canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D }>((resolve, reject) => {
            const canvas = document.querySelector("canvas") as HTMLCanvasElement;
            const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
            resolve({ canvas, ctx })
        })
    }
    async function initCanvas() {
        const { canvas, ctx } = await selectCanvas()


        const { drawOnCanvas, undo, redo, replayDrawing, initCanvas } = useDrawOnCanvas(canvas, ctx);

        return { drawOnCanvas, undo, redo, replayDrawing, initCanvas }
    }


    return { initCanvas }


}