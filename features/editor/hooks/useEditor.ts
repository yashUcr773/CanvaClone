import { useCallback, useMemo, useState } from "react";
import { fabric } from "fabric";
import useAutoResize from "./useAutoResize";
import {
	BuildEditorProps,
	CIRCLE_OPTIONS,
	DIAMOND_OPTIONS,
	Editor,
	FILL_COLOR,
	FONT_FAMILY,
	FONT_SIZE,
	FONT_WEIGHT,
	RECTANGLE_OPTIONS,
	STROKE_COLOR,
	STROKE_DASH_ARRAY,
	STROKE_WIDTH,
	TRIANGLE_OPTIONS,
} from "../types";
import useCanvasEvents from "./useCanvasEvents";
import { isTextType } from "../utils";

const buildEditor = ({
	canvas,
	fillColor,
	setFillColor,
	strokeColor,
	setStrokeColor,
	strokeWidth,
	setStrokeWidth,
	selectedObjects,
	fontFamily,
	setFontFamily,
	strokeDashArray,
	setStrokeDashArray,
}: BuildEditorProps): Editor => {
	const getWorkspace = () => {
		return canvas.getObjects().find((object) => object.name === "clip");
	};

	const center = (object: fabric.Object) => {
		const workspace = getWorkspace();
		const center = workspace?.getCenterPoint();

		if (!center) return;

		// @ts-ignore
		canvas._centerObject(object, center);
	};

	const addToCanvas = (object: fabric.Object) => {
		center(object);
		canvas.add(object);
		canvas.setActiveObject(object);
	};

	return {
		changeFillColor: (value: string) => {
			setFillColor(value);
			canvas.getActiveObjects().forEach((object) => {
				object.set({ fill: value });
			});
			canvas.renderAll();
		},
		changeStrokeColor: (value: string) => {
			setStrokeColor(value);
			canvas.getActiveObjects().forEach((object) => {
				// Text types don't have stroke
				if (isTextType(object.type)) {
					object.set({ fill: value });
					return;
				}

				object.set({ stroke: value });
			});
			canvas.freeDrawingBrush.color = value;
			canvas.renderAll();
		},
		changeStrokeWidth: (value: number) => {
			setStrokeWidth(value);
			canvas.getActiveObjects().forEach((object) => {
				object.set({ strokeWidth: value });
			});
			canvas.freeDrawingBrush.width = value;
			canvas.renderAll();
		},

		addCircle: () => {
			const object = new fabric.Circle({
				...CIRCLE_OPTIONS,
			});

			addToCanvas(object);
		},
		addSoftRectangle: () => {
			const object = new fabric.Rect({
				...RECTANGLE_OPTIONS,
				rx: 50,
				ry: 50,
			});

			addToCanvas(object);
		},
		addRectangle: () => {
			const object = new fabric.Rect({
				...RECTANGLE_OPTIONS,
			});

			addToCanvas(object);
		},
		addTriangle: () => {
			const object = new fabric.Triangle({
				...TRIANGLE_OPTIONS,
			});

			addToCanvas(object);
		},
		addInverseTriangle: () => {
			const HEIGHT = TRIANGLE_OPTIONS.height;
			const WIDTH = TRIANGLE_OPTIONS.width;

			const object = new fabric.Polygon(
				[
					{ x: 0, y: 0 },
					{ x: WIDTH, y: 0 },
					{ x: WIDTH / 2, y: HEIGHT },
				],
				{
					...TRIANGLE_OPTIONS,
				}
			);

			addToCanvas(object);
		},
		addDiamond: () => {
			const HEIGHT = DIAMOND_OPTIONS.height;
			const WIDTH = DIAMOND_OPTIONS.width;

			const object = new fabric.Polygon(
				[
					{ x: WIDTH / 2, y: 0 },
					{ x: WIDTH, y: HEIGHT / 2 },
					{ x: WIDTH / 2, y: HEIGHT },
					{ x: 0, y: HEIGHT / 2 },
				],
				{
					...DIAMOND_OPTIONS,
				}
			);
			addToCanvas(object);
		},

		getActiveFontWeight: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return FONT_WEIGHT;
			}

			// @ts-ignore
			// Faulty TS library, fontWeight exists.
			const value = selectedObject.get("fontWeight") || FONT_WEIGHT;

			return value;
		},
		getActiveFontFamily: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return fontFamily;
			}

			// @ts-ignore
			// Faulty TS library, fontFamily exists.
			const value = selectedObject.get("fontFamily") || fontFamily;

			return value;
		},
		getActiveFillColor: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return fillColor;
			}

			const value = selectedObject.get("fill") || fillColor;

			// Currently, gradients & patterns are not supported
			return value as string;
		},
		getActiveStrokeColor: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return strokeColor;
			}

			const value = selectedObject.get("stroke") || strokeColor;

			return value;
		},
		getActiveStrokeWidth: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return strokeWidth;
			}

			const value = selectedObject.get("strokeWidth") || strokeWidth;

			return value;
		},
		getActiveStrokeDashArray: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return strokeDashArray;
			}

			const value = selectedObject.get("strokeDashArray") || strokeDashArray;

			return value;
		},
		getActiveFontStyle: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return "normal";
			}

			// @ts-ignore
			// Faulty TS library, fontStyle exists.
			const value = selectedObject.get("fontStyle") || "normal";

			return value;
		},
		getActiveFontLinethrough: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return false;
			}

			// @ts-ignore
			// Faulty TS library, linethrough exists.
			const value = selectedObject.get("linethrough") || false;

			return value;
		},
		getActiveFontUnderline: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return false;
			}

			// @ts-ignore
			// Faulty TS library, underline exists.
			const value = selectedObject.get("underline") || false;

			return value;
		},
		getActiveTextAlign: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return "left";
			}

			// @ts-ignore
			// Faulty TS library, textAlign exists.
			const value = selectedObject.get("textAlign") || "left";

			return value;
		},
		getActiveFontSize: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return FONT_SIZE;
			}

			// @ts-ignore
			// Faulty TS library, fontSize exists.
			const value = selectedObject.get("fontSize") || FONT_SIZE;

			return value;
		},

		canvas,
		selectedObjects,
	};
};

export default function useEditor() {
	const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);

	const [fillColor, setFillColor] = useState(FILL_COLOR);
	const [fontFamily, setFontFamily] = useState(FONT_FAMILY);
	const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
	const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
	const [strokeDashArray, setStrokeDashArray] = useState<number[]>(STROKE_DASH_ARRAY);

	useAutoResize({ canvas, container });

	useCanvasEvents({
		canvas,
		setSelectedObjects,
	});

	const editor = useMemo(() => {
		if (canvas) {
			return buildEditor({
				canvas,
				fillColor,
				setFillColor,
				strokeColor,
				setStrokeColor,
				strokeWidth,
				setStrokeWidth,
				selectedObjects,
				fontFamily,
				setFontFamily,
				strokeDashArray,
				setStrokeDashArray,
			});
		}
		return undefined;
	}, [canvas, fillColor, strokeColor, strokeWidth, selectedObjects, fontFamily, strokeDashArray]);

	const init = useCallback(
		({ initialCanvas, initialContainer }: { initialCanvas: fabric.Canvas; initialContainer: HTMLDivElement }) => {
			fabric.Object.prototype.set({
				cornerColor: "#FFF",
				cornerStyle: "circle",
				borderColor: "#3b82f6",
				borderScaleFactor: 1.5,
				transparentCorners: false,
				borderOpacityWhenMoving: 1,
				cornerStrokeColor: "#3b82f6",
			});

			const initialWorkspace = new fabric.Rect({
				width: initialContainer.offsetWidth,
				height: initialContainer.offsetHeight,
				name: "clip",
				fill: "white",
				selectable: false,
				hasControls: false,
				shadow: new fabric.Shadow({
					color: "rgba(0,0,0,0.8)",
					blur: 5,
				}),
			});

			initialCanvas.setWidth(initialContainer.offsetWidth);
			initialCanvas.setHeight(initialContainer.offsetHeight);

			initialCanvas.add(initialWorkspace);
			initialCanvas.centerObject(initialWorkspace);
			initialCanvas.clipPath = initialWorkspace;

			setCanvas(initialCanvas);
			setContainer(initialContainer);
		},
		[]
	);

	return { init, editor };
}
