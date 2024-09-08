"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEditor from "../hooks/useEditor";
import { fabric } from "fabric";
import Navbar from "./navbar";
import { Sidebar } from "./sidebar";
import { ActiveTool } from "../types";
import Toolbar from "./toolbar";
import Footer from "./footer";
import { ShapeSidebar } from "./shape-sidebar";
import { FillColorSidebar } from "./fill-color-sidebar";

export default function Editor() {
	const { init, editor } = useEditor();
	const canvasRef = useRef(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [activeTool, setActiveTool] = useState<ActiveTool>("select");

	const onChangeActiveTool = useCallback(
		(tool: ActiveTool) => {
			if (tool === "draw") {
				//   editor?.enableDrawingMode();
			}

			if (activeTool === "draw") {
				//   editor?.disableDrawingMode();
			}

			if (tool === activeTool) {
				return setActiveTool("select");
			}

			setActiveTool(tool);
		},
		[activeTool]
	);

	useEffect(() => {
		const canvas = new fabric.Canvas(canvasRef.current, {
			controlsAboveOverlay: true,
			preserveObjectStacking: true,
		});
		init({
			initialCanvas: canvas,
			initialContainer: containerRef.current!,
		});

		return () => {
			canvas.dispose();
		};
	}, [init]);

	return (
		<div className="h-full flex flex-col">
			<Navbar activeTool={activeTool} onChangeActiveTool={onChangeActiveTool}></Navbar>
			<div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
				<Sidebar activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
				<ShapeSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
				<FillColorSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
				<main className="bg-muted flex-1 overflow-auto relative flex flex-col">
					<Toolbar
						editor={editor}
						activeTool={activeTool}
						onChangeActiveTool={onChangeActiveTool}
						key={JSON.stringify(editor?.canvas.getActiveObject())}></Toolbar>
					<div className="flex-1 h-[calc(100%-124px)] bg-muted" ref={containerRef}>
						<canvas ref={canvasRef} />
					</div>
					<Footer></Footer>
				</main>
			</div>
		</div>
	);
}
