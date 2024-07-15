"use client";

import { useEffect, useRef, useState } from "react";
import useEditor from "../hooks/useEditor";
import { fabric } from "fabric";
import Navbar from "./navbar";
import { Sidebar } from "./sidebar";
import { ActiveTool } from "../types";
import Toolbar from "./toolbar";
import Footer from "./footer";

export default function Editor() {
	const { init } = useEditor();
	const canvasRef = useRef(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [activeTool, setActiveTool] = useState<ActiveTool>("select");

	const onChangeActiveTool = () => {};

	useEffect(() => {
		const canvas = new fabric.Canvas(canvasRef.current, {
			controlsAboveOverlay: true,
			preserveObjectStacking: true,
		});
		init({
			initialCanvas: canvas,
			initialContainer: containerRef.current!,
		});
	}, [init]);

	return (
		<div className="h-full flex flex-col">
			<Navbar></Navbar>
			<div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
				<Sidebar activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
				<main className="bg-muted flex-1 overflow-auto relative flex flex-col">
					<Toolbar></Toolbar>
					<div className="flex-1 h-[calc(100%-124px)] bg-muted" ref={containerRef}>
						<canvas ref={canvasRef} />
					</div>
					<Footer></Footer>
				</main>
			</div>
		</div>
	);
}
