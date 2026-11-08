import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	type CSSProperties,
	type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import {
	applyLetterPlaceholders,
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
	size = 9.75,
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

function PrintIcon() {
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
			<path d="M6 9V3h12v6" />
			<path d="M6 18H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1" />
			<path d="M6 14h12v7H6z" />
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
			<p className="bew-banner-label bew-banner-label--cover">Bewerbung</p>
			<div className="bew-cover-body">
				<div className="bew-cover-heading">
					{data.jobTitle ? (
						<p className="bew-cover-job-title">{data.jobTitle}</p>
					) : null}
					{data.companyName ? (
						<p className="bew-cover-company">bei der {data.companyName}</p>
					) : null}
				</div>
				<img
					alt={`Porträt von ${data.name}`}
					className="bew-photo bew-photo--cover"
					src={data.photoCover}
				/>
				<div className="bew-cover-meta">
					<p className="bew-cover-name">{data.name}</p>
					<p className="bew-cover-meta-spaced">{data.street}</p>
					<p>{data.city}</p>
					<p>{data.phone ? `Mobil: ${data.phone}` : ""}</p>
					<p>{data.email ? `E-Mail: ${data.email}` : ""}</p>
				</div>
			</div>
		</article>
	);
}

function highlightCompanyName(text: string, companyName: string): ReactNode {
	const name = companyName.trim();
	if (!name) return text;

	const parts = text.split(name);
	if (parts.length === 1) return text;

	const nodes: ReactNode[] = [];
	parts.forEach((part, index) => {
		if (index > 0) {
			nodes.push(
				<span className="bew-company-mark" key={`company-${index}`}>
					{name}
				</span>
			);
		}
		if (part) nodes.push(part);
	});
	return nodes;
}

function LetterPage({
	data,
	pageRef,
}: {
	data: BewerbungData;
	pageRef: (node: HTMLElement | null) => void;
}) {
	const paragraphs = applyLetterPlaceholders(
		data.letterBody,
		data.companyName
	)
		.replace(/\r\n/g, "\n")
		.split(/\n{2,}/)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean);

	return (
		<article className="bew-page" ref={pageRef}>
			<div className="bew-banner bew-banner--letter" />
			<p className="bew-banner-label bew-banner-label--letter">Anschreiben</p>
			<T left={70.82} top={35.43}>
				{data.name}
			</T>
			<T left={70.82} top={48.99}>
				{[data.street, data.city].filter(Boolean).join(", ")}
			</T>
			<T left={70.82} top={62.67}>
				{data.phone ? `Mobil: ${data.phone}` : ""}
			</T>
			<T left={70.82} top={76.25}>
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
				{data.jobTitle ? (
					<p className="bew-letter-subject">{data.jobTitle}</p>
				) : null}
				{data.letterGreeting ? <p>{data.letterGreeting}</p> : null}
				{paragraphs.map((paragraph, index) => (
					<p key={`${index}-${paragraph.slice(0, 24)}`}>
						{highlightCompanyName(paragraph, data.companyName)}
					</p>
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
			<p className="bew-banner-label bew-banner-label--cv">Lebenslauf</p>
			<img
				alt={`Porträt von ${data.name}`}
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

	const handlePrint = async () => {
		await document.fonts.ready;
		window.print();
	};

	const handleDownload = async () => {
		if (isDownloading) return;

		flushSync(() => {
			setIsDownloading(true);
		});
		try {
			await document.fonts.ready;
			const pdf = new jsPDF({
				compress: true,
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
					scale: 2,
					useCORS: true,
					width: page.scrollWidth,
					windowHeight: page.scrollHeight,
					windowWidth: page.scrollWidth,
				});

				if (index > 0) pdf.addPage("a4", "portrait");
				pdf.addImage(
					canvas.toDataURL("image/jpeg", 0.86),
					"JPEG",
					0,
					0,
					width,
					height,
					`page-${index}`,
					"MEDIUM"
				);
			}

			pdf.save(fileNameFromName(data.name));
		} finally {
			setIsDownloading(false);
		}
	};

	return (
		<div
			className={`bew-app${sidebarOpen ? "" : " is-sidebar-collapsed"}${
				isDownloading ? " is-exporting" : ""
			}`}
		>
			<EditorSidebar
				data={data}
				onChange={setData}
				onTabChange={handleTabChange}
				onToggle={() => setSidebarOpen((open) => !open)}
				open={sidebarOpen}
				tab={activeTab}
			/>

			<main className="bew-workspace" ref={workspaceRef}>
				<div className="bew-actions">
					<button
						aria-label={
							isDownloading ? "PDF wird erstellt" : "PDF herunterladen"
						}
						className="bew-action bew-download"
						disabled={isDownloading}
						onClick={() => void handleDownload()}
						title={
							isDownloading ? "PDF wird erstellt…" : "PDF herunterladen"
						}
						type="button"
					>
						<DownloadIcon />
					</button>
					<button
						aria-label="Drucken"
						className="bew-action bew-print"
						onClick={() => void handlePrint()}
						title="Drucken"
						type="button"
					>
						<PrintIcon />
					</button>
				</div>

				<div
					className="bew-pages-frame"
					style={{
						height: pagesHeight ? pagesHeight * previewScale : undefined,
					}}
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
