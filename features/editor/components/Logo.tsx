import Link from "next/link";
import Image from "next/image";

export default function Logo() {
	return (
		<Link href="/">
			<div className="size-16 relative shrink-0">
				<Image src="/logo.svg" fill alt="Canva Clone" className="shrink-0 hover:opacity-75 transition" />
			</div>
		</Link>
	);
}
