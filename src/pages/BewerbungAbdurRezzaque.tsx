import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import {
	fileNameFromName,
	loadBewerbungData,
	loadSidebarOpen,
	saveBewerbungData,
	saveSidebarOpen,
	type BewerbungData,
} from "../bewerbung/data";
import "./BewerbungAbdurRezzaque.css";
import EditorSidebar, { type TabId } from "./EditorSidebar";

const PAGE_TABS: TabId[] = ["personal", "anschreiben", "lebenslauf"];

const BODY = "#404040";
const WHITE = "#ffffff";

type TextProps = {
	left: number;
	top: number;
	size?: number;
	bold?: boolean;
	color?: string;
	z?: number;
	align?: "left" | "center" | "right";
	width?: number;
	children: string;
};

function T({
	left,
	top,
	size = 10.5,
	bold = false,
	color = BODY,
	z,
	align = "left",
	width,
	children,
}: TextProps) {
	const style: CSSProperties = {
		left: `${left}pt`,
		top: `${top}pt`,
		fontSize: `${size}pt`,
		fontWeight: bold ? 700 : 400,
		color,
		textAlign: align,
	};
	if (z != null) style.zIndex = z;
	if (width != null) style.width = `${width}pt`;
	if (align === "center") {
		style.left = "0";
		style.width = "100%";
	}
	if (align === "right" && width == null) {
		style.right = `${left}pt`;
		style.left = "auto";
	}
	return (
		<p className="bew-text" style={style}>
			{children}
		</p>
	);
}

function DownloadIcon() {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.8"
			viewBox="0 0 24 24"
		>
			<path d="M12 3v12" />
			<path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
			<path d="M5 20h14" />
		</svg>
	);
}

function CvRow({
	label,
	value,
	boldValue = false,
}: {
	label: string;
	value: string;
	boldValue?: boolean;
}) {
	if (!label && !value) return null;
	return (
		<div className="bew-cv-row">
			<p className="bew-cv-label">{label}</p>
			<p className={`bew-cv-value${boldValue ? " is-bold" : ""}`}>{value}</p>
		</div>
	);
}

function CoverPage({
	data,
	pageRef,
}: {
	data: BewerbungData;
	pageRef: (node: HTMLElement | null) => void;
}) {
	return (
		<article className="bew-page" ref={pageRef}>
			<div className="bew-banner bew-banner--cover" />
			<T left={431.62} top={50.63} size={18} color={WHITE}>
				Bewerbung
			</T>
			<img
				alt={`Portrait of ${data.name}`}
				className="bew-photo bew-photo--cover"
				src={data.photoCover}
			/>
			<div className="bew-cover-meta">
				<p>{data.name}</p>
				<p className="bew-cover-meta-spaced">{data.street}</p>
				<p>{data.city}</p>
				<p>{data.phone ? `Mobil: ${data.phone}` : ""}</p>
				<p>{data.email ? `E-Mail: ${data.email}` : ""}</p>
			</div>
		</article>
	);
}

function LetterPage({
	data,
	pageRef,
}: {
	data: BewerbungData;
	pageRef: (node: HTMLElement | null) => void;
}) {
	const paragraphs = data.letterBody
		.replace(/\r\n/g, "\n")
		.split(/\n{2,}/)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean);

	return (
		<article className="bew-page" ref={pageRef}>
			<div className="bew-banner bew-banner--letter" />
			<T left={431.62} top={50.63} size={18} color={WHITE}>
				Anschreiben
			</T>
			<T left={70.82} top={35.43} size={13}>
				{data.name}
			</T>
			<T left={70.82} top={48.99} size={13}>
				{[data.street, data.city].filter(Boolean).join(", ")}
			</T>
			<T left={70.82} top={62.67} size={13}>
				{data.phone ? `Mobil: ${data.phone}` : ""}
			</T>
			<T left={70.82} top={76.25} size={13}>
				{data.email ? `E-Mail: ${data.email}` : ""}
			</T>
			<T left={70.82} top={135.91}>
				{data.companyName}
			</T>
			<T left={70.82} top={146.83}>
				{data.companyStreet}
			</T>
			<T left={70.82} top={157.75}>
				{data.companyCity}
			</T>
			<p className="bew-letter-date">{data.date}</p>
			<div className="bew-letter-text">
				{data.letterGreeting ? <p>{data.letterGreeting}</p> : null}
				{paragraphs.map((paragraph, index) => (
					<p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
				))}
				{data.letterClosing ? (
					<p className="bew-letter-closing">{data.letterClosing}</p>
				) : null}
				{data.name ? <p>{data.name}</p> : null}
			</div>
		</article>
	);
}

function CvPage({
	data,
	pageRef,
}: {
	data: BewerbungData;
	pageRef: (node: HTMLElement | null) => void;
}) {
	return (
		<article className="bew-page" ref={pageRef}>
			<div className="bew-banner bew-banner--cv" />
			<T left={407.2} top={50.03} size={18} color={WHITE}>
				 Lebenslauf
			</T>
			<img
				alt={`Portrait of ${data.name}`}
				className="bew-photo bew-photo--cv"
				src={data.photoCv}
			/>
			<div className="bew-cv-body">
				<section className="bew-cv-section bew-cv-personal">
					<div className="bew-cv-section-head">
						<h3>Persönliche Daten</h3>
						<hr />
					</div>
					<CvRow label="Name" value={data.name} />
					<CvRow label="Adresse" value={data.street} />
					<CvRow label="" value={data.city} />
					<CvRow label="Mobil" value={data.phone} />
					<CvRow label="E-Mail" value={data.email} />
					<CvRow label="Geburtsdatum / -ort" value={data.birth} />
					<CvRow label="Familienstand" value={data.maritalStatus} />
				</section>

				<section className="bew-cv-section">
					<div className="bew-cv-section-head">
						<h3>Beruflicher Werdegang</h3>
						<hr />
					</div>
					{data.jobs.map((job) => (
						<div className="bew-cv-job" key={job.id}>
							<CvRow boldValue label={job.period} value={job.title} />
							<CvRow label="Unternehmen" value={job.company} />
							<CvRow label="Aufgabenbereiche" value={job.duties} />
						</div>
					))}
				</section>

				<section className="bew-cv-section">
					<div className="bew-cv-section-head">
						<h3>Kenntnisse</h3>
						<hr />
					</div>
					<CvRow label="Sprachkenntnisse" value={data.languages} />
					<CvRow label="Führerschein" value={data.license} />
				</section>

				<section className="bew-cv-section">
					<div className="bew-cv-section-head">
						<h3>Interessen</h3>
						<hr />
					</div>
					<CvRow label="Hobbys" value={data.hobbies} />
				</section>

				<p className="bew-cv-signoff">
					{data.cvPlace ? `${data.cvPlace}, ` : ""}
					<span>{data.date}</span>
				</p>
			</div>
		</article>
	);
}

const PAGE_WIDTH_PX = (595.32 * 96) / 72;

function BewerbungAbdurRezzaque() {
	const pageRefs = useRef<Array<HTMLElement | null>>([]);
	const workspaceRef = useRef<HTMLElement | null>(null);
	const [data, setData] = useState<BewerbungData>(() => loadBewerbungData());
	const [sidebarOpen, setSidebarOpen] = useState(() => loadSidebarOpen());
	const [activeTab, setActiveTab] = useState<TabId>("personal");
	const [isDownloading, setIsDownloading] = useState(false);
	const [previewScale, setPreviewScale] = useState(1);
	const [pagesHeight, setPagesHeight] = useState(0);
	const pagesRef = useRef<HTMLElement | null>(null);
	const ignoreScrollSync = useRef(false);

	useEffect(() => {
		saveBewerbungData(data);
	}, [data]);

	useEffect(() => {
		saveSidebarOpen(sidebarOpen);
	}, [sidebarOpen]);

	useEffect(() => {
		const previousTitle = document.title;
		document.title = `Bewerbung — ${data.name}`;
		return () => {
			document.title = previousTitle;
		};
	}, [data.name]);

	useEffect(() => {
		const workspace = workspaceRef.current;
		if (!workspace) return;

		const updateScale = (width: number) => {
			setPreviewScale(Math.min(1, Math.max(0.35, (width - 8) / PAGE_WIDTH_PX)));
		};

		updateScale(workspace.clientWidth - 64);
		const observer = new ResizeObserver((entries) => {
			const width = entries[0]?.contentRect.width ?? workspace.clientWidth - 64;
			updateScale(width);
		});
		observer.observe(workspace);
		return () => observer.disconnect();
	}, [sidebarOpen]);

	useLayoutEffect(() => {
		const pages = pagesRef.current;
		if (!pages) return;
		setPagesHeight(pages.offsetHeight);
	}, [data, previewScale]);

	useEffect(() => {
		const syncTabFromScroll = () => {
			if (ignoreScrollSync.current) return;

			const viewportCenter = window.innerHeight * 0.35;
			let bestIndex = 0;
			let bestScore = Number.NEGATIVE_INFINITY;

			pageRefs.current.forEach((page, index) => {
				if (!page) return;
				const rect = page.getBoundingClientRect();
				const visibleTop = Math.max(rect.top, 0);
				const visibleBottom = Math.min(rect.bottom, window.innerHeight);
				const visible = Math.max(0, visibleBottom - visibleTop);
				const mid = rect.top + rect.height / 2;
				const proximity = 1 / (1 + Math.abs(mid - viewportCenter));
				const score = visible * 2 + proximity;
				if (score > bestScore) {
					bestScore = score;
					bestIndex = index;
				}
			});

			const nextTab = PAGE_TABS[bestIndex] ?? "personal";
			setActiveTab((current) => (current === nextTab ? current : nextTab));
		};

		syncTabFromScroll();
		window.addEventListener("scroll", syncTabFromScroll, { passive: true });
		window.addEventListener("resize", syncTabFromScroll);
		return () => {
			window.removeEventListener("scroll", syncTabFromScroll);
			window.removeEventListener("resize", syncTabFromScroll);
		};
	}, [previewScale, sidebarOpen]);

	const handleTabChange = (tab: TabId) => {
		setActiveTab(tab);
		const pageIndex = PAGE_TABS.indexOf(tab);
		const page = pageRefs.current[pageIndex];
		if (!page) return;

		ignoreScrollSync.current = true;
		page.scrollIntoView({ behavior: "smooth", block: "start" });
		window.setTimeout(() => {
			ignoreScrollSync.current = false;
		}, 700);
	};

	const handleDownload = async () => {
		if (isDownloading) return;

		setIsDownloading(true);
		try {
			await document.fonts.ready;
			const pdf = new jsPDF({
				format: "a4",
				orientation: "portrait",
				unit: "pt",
			});
			const width = pdf.internal.pageSize.getWidth();
			const height = pdf.internal.pageSize.getHeight();

			for (let index = 0; index < pageRefs.current.length; index += 1) {
				const page = pageRefs.current[index];
				if (!page) continue;

				const canvas = await html2canvas(page, {
					backgroundColor: "#ffffff",
					height: page.scrollHeight,
					logging: false,
					scale: 3,
					useCORS: true,
					width: page.scrollWidth,
					windowHeight: page.scrollHeight,
					windowWidth: page.scrollWidth,
				});

				if (index > 0) pdf.addPage("a4", "portrait");
				pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, width, height);
			}

			pdf.save(fileNameFromName(data.name));
		} finally {
			setIsDownloading(false);
		}
	};

	return (
		<div className={`bew-app${sidebarOpen ? "" : " is-sidebar-collapsed"}`}>
			<EditorSidebar
				data={data}
				onChange={setData}
				onTabChange={handleTabChange}
				onToggle={() => setSidebarOpen((open) => !open)}
				open={sidebarOpen}
				tab={activeTab}
			/>

			<main className="bew-workspace" ref={workspaceRef}>
				<button
					aria-label={isDownloading ? "Preparing PDF" : "Download PDF"}
					className="bew-download"
					disabled={isDownloading}
					onClick={() => void handleDownload()}
					title={isDownloading ? "Preparing PDF…" : "Download PDF"}
					type="button"
				>
					<DownloadIcon />
				</button>

				<div
					className="bew-pages-frame"
					style={{ height: pagesHeight ? pagesHeight * previewScale : undefined }}
				>
				<section
					aria-label={`Bewerbung ${data.name}`}
					className="bew-pages"
					ref={pagesRef}
					style={{ transform: `scale(${previewScale})` }}
				>
					<CoverPage
						data={data}
						pageRef={(node) => {
							pageRefs.current[0] = node;
						}}
					/>
					<LetterPage
						data={data}
						pageRef={(node) => {
							pageRefs.current[1] = node;
						}}
					/>
					<CvPage
						data={data}
						pageRef={(node) => {
							pageRefs.current[2] = node;
						}}
					/>
				</section>
				</div>
			</main>
		</div>
	);
}

export default BewerbungAbdurRezzaque;
