import { IoTriangle } from "react-icons/io5";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { FaDiamond } from "react-icons/fa6";
import { ActiveTool, Editor } from "@/features/editor/types";
import { cn } from "@/lib/utils";
import { FaCircle, FaSquare, FaSquareFull } from "react-icons/fa";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShapeTool } from "./shape-tool";
import { ToolSidebarHeader } from "./tool-sidebar-header";

interface ShapeSidebarProps {
	editor: Editor | undefined;
	activeTool: ActiveTool;
	onChangeActiveTool: (tool: ActiveTool) => void;
}

export const ShapeSidebar = ({ editor, activeTool, onChangeActiveTool }: ShapeSidebarProps) => {
	const onClose = () => {
		onChangeActiveTool("select");
	};

	return (
		<aside
			className={cn(
				"bg-white relative border-r z-[40] h-full flex flex-col transition-all duration-300",
				activeTool === "shapes" ? "opacity-100 w-[360px]" : "opacity-0 w-[0px]"
			)}>
			<ToolSidebarHeader title="Shapes" description="Add shapes to your canvas" />
			<ScrollArea>
				<div className="grid grid-cols-3 gap-4 p-4">
					<ShapeTool onClick={() => editor?.addCircle()} icon={FaCircle} />
					<ShapeTool onClick={() => editor?.addSoftRectangle()} icon={FaSquare} />
					<ShapeTool onClick={() => editor?.addRectangle()} icon={FaSquareFull} />
					<ShapeTool onClick={() => editor?.addTriangle()} icon={IoTriangle} />
					<ShapeTool
						onClick={() => editor?.addInverseTriangle()}
						icon={IoTriangle}
						iconClassName="rotate-180"
					/>
					<ShapeTool onClick={() => editor?.addDiamond()} icon={FaDiamond} />
				</div>
			</ScrollArea>
			<ToolSidebarClose onClick={onClose} />
		</aside>
	);
};
