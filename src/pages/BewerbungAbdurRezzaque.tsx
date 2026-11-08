import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import portraitCover from "../assets/bewerbung/portrait-cover.jpg";
import portraitCv from "../assets/bewerbung/portrait-cv.jpg";
import "./BewerbungAbdurRezzaque.css";

const BODY = "#404040";
const SECTION = "#44546a";
const RED = "#ff0000";
const WHITE = "#ffffff";

type TextProps = {
	left: number;
	top: number;
	size?: number;
	bold?: boolean;
	color?: string;
	z?: number;
	children: string;
};

function T({
	left,
	top,
	size = 8.04,
	bold = false,
	color = BODY,
	z,
	children,
}: TextProps) {
	const style: CSSProperties = {
		left: `${left}pt`,
		top: `${top}pt`,
		fontSize: `${size}pt`,
		fontWeight: bold ? 700 : 400,
		color,
	};
	if (z != null) style.zIndex = z;
	return (
		<p className="bew-text" style={style}>
			{children}
		</p>
	);
}

const letterBody: TextProps[] = [
	{
		left: 70.82,
		top: 212.23,
		children: "Sehr geehrte Damen und Herren, ",
	},
	{
		left: 70.82,
		top: 233.95,
		children:
			"Ihr Unternehmen ist mir als erfolgreicher Produzent sehr gut bekannt. Nachdem ich mittlerweile seit vielen Jahren in ",
	},
	{
		left: 70.82,
		top: 244.9,
		children:
			"einem mittelständischen Betrieb der kunststoffverarbeitenden Industrie tätig bin, möchte ich nun den nächsten Schritt ",
	},
	{
		left: 70.82,
		top: 255.82,
		children:
			"gehen. Ich sehe durch Ihre Marktposition sehr gute Möglichkeiten, in einem großen Unternehmen zu arbeiten, mit dem ",
	},
	{ left: 70.82, top: 266.62, children: "ich wachsen kann. " },
	{
		left: 70.82,
		top: 277.54,
		children:
			"Ihre Internetseite hat mich zudem davon überzeugt, dass ich mit meinem Wissen und meinen Fähigkeiten Teil eines ",
	},
	{
		left: 70.82,
		top: 288.46,
		children:
			"Teams werden kann, das die Unternehmensziele mit großer Leidenschaft vertritt aber auch durch Wertschätzung für den ",
	},
	{ left: 70.82, top: 299.38, children: "Einzelnen geprägt wird. " },
	{
		left: 70.82,
		top: 321.1,
		children:
			"Ich möchte meine Erfahrung in der Produktion einbringen. In meiner bisherigen Tätigkeit als Maschinenbediener und ",
	},
	{
		left: 70.82,
		top: 332.02,
		children:
			"Schichtführer konnte ich umfassende Kenntnisse im Umgang mit Siebdruckmaschinen und Etikettiermaschinen ",
	},
	{
		left: 70.82,
		top: 342.94,
		children:
			"erwerben. Ich bin überzeugt, dass dieses Wissen für die Aufgabe sehr nützlich sein wird.  ",
	},
	{
		left: 70.82,
		top: 364.78,
		children:
			"Aus meinem Lebenslauf können Sie ersehen, dass ich darüber hinaus Erfahrung als Lagerhelfer und Packer habe. Diese ",
	},
	{
		left: 70.82,
		top: 375.58,
		children:
			"Praxiskenntnisse sind sicher ebenfalls wichtig. Mir fällt es leicht, Neues zu lernen und so erhoffe ich mir von der Arbeit für ",
	},
	{
		left: 70.82,
		top: 386.5,
		children: "ein so renommiertes Unternehmen wie  auch die kontinuierliche Hadey Industries Erweiterung meines Wissens. ",
	},
	{
		left: 70.82,
		top: 408.34,
		children:
			"Volles Engagement für meine Aufgaben, Belastbarkeit und Zuverlässigkeit in allen Details meines Aufgabengebietes sind ",
	},
	{
		left: 70.82,
		top: 419.16,
		children: "für mich eine Selbstverständlichkeit. ",
	},
	{
		left: 70.82,
		top: 441.0,
		children:
			"Ich bin überzeugt davon, dass ich viel zum Erfolg Ihres Unternehmens beitragen kann. Ich würde mich über die ",
	},
	{
		left: 70.82,
		top: 451.92,
		children:
			"Gelegenheit freuen, Hadey Industries bei einem persönlichen Gespräch näher kennenzulernen. ",
	},
	{ left: 70.82, top: 473.64, children: "Mit freundlichen Grüßen " },
	{ left: 70.82, top: 501.6, children: "Abdur Rezzaque" },
];

const cvLines: TextProps[] = [
	{
		left: 112.22,
		top: 105.67,
		bold: true,
		color: SECTION,
		children: "                     Persönliche Daten",
	},
	{ left: 251.09, top: 132.55, children: "Name " },
	{ left: 284.35, top: 132.55, children: "Abdur Rezzaque " },
	{ left: 243.65, top: 151.51, children: "Adresse " },
	{ left: 284.35, top: 151.51, children: "Seilbahnweg 6 " },
	{ left: 284.35, top: 170.35, children: "42781 Haan " },
	{ left: 252.53, top: 189.31, children: "Mobil " },
	{ left: 284.35, top: 189.19, children: "0176 40522796 " },
	{ left: 250.73, top: 208.15, children: "E-Mail " },
	{ left: 284.35, top: 208.15, children: "abdur.rezzaque60@gmail.com " },
	{ left: 198.41, top: 227.11, children: "Geburtsdatum / -ort " },
	{ left: 284.35, top: 226.99, children: "17.06.1960 Tangail / Bangladesch " },
	{ left: 221.09, top: 245.98, children: "Familienstand " },
	{ left: 284.35, top: 245.98, children: "geschieden " },
	{
		left: 181.73,
		top: 288.58,
		bold: true,
		color: SECTION,
		children: "Beruflicher Werdegang",
	},
	{
		left: 149.42,
		top: 315.46,
		bold: true,
		children: "November 2020 – Oktober 2026 ",
	},
	{
		left: 284.35,
		top: 315.46,
		bold: true,
		children: "Produktionsmitarbeiter, Maschinenhelfer, Montagehelfer ",
	},
	{ left: 217.25, top: 326.38, bold: true, children: "Unternehmen " },
	{ left: 284.35, top: 326.38, children: "Fola Abfülltechnik GmbH, 40822 Mettmann" },
	{ left: 200.57, top: 337.3, bold: true, children: "Aufgabenbereiche " },
	{
		left: 284.35,
		top: 337.3,
		children: "Bedienen von Produktions- und Etikettiermaschienen, ",
	},
	{
		left: 284.35,
		top: 348.22,
		children: "Qualitätskontrolle, Dosenmotage, Verpacken, Etikettieren ",
	},
	{
		left: 284.35,
		top: 359.14,
		children: "und Konfektionieren ",
	},
	{ left: 185.45, top: 369.94, bold: true, children: "Januar 1992 – Juli 2020 " },
	{
		left: 284.35,
		top: 369.94,
		bold: true,
		children: "Maschinenbediener, Produktionshelfer, Schichtführer ",
	},
	{ left: 217.25, top: 380.86, bold: true, children: "Unternehmen " },
	{
		left: 284.35,
		top: 380.86,
		children: "Schieferdecker GmbH & Co. KG, 40699 Erkrath ",
	},
	{ left: 200.57, top: 393.22, bold: true, children: "Aufgabenbereiche " },
	{
		left: 284.35,
		top: 393.22,
		children: "bedienen von Siebdruckmaschinen und Etikettiermaschinen, ",
	},
	{
		left: 284.35,
		top: 404.14,
		children: "Konfektionierarbeiten, Komplettierarbeiten ",
	},
	{
		left: 150.86,
		top: 426.0,
		bold: true,
		children: "Oktober 1991 – Dezember 1991 ",
	},
	{
		left: 284.35,
		top: 426.0,
		bold: true,
		children: "Maschinenbediener, Produktionshelfer ",
	},
	{ left: 217.25, top: 436.8, bold: true, children: "Unternehmen " },
	{ left: 284.35, top: 436.8, children: "Deka- Roll GmbH, 42655 Solingen " },
	{ left: 200.57, top: 447.72, bold: true, children: "Aufgabenbereiche " },
	{
		left: 284.35,
		top: 447.72,
		children: "bedienen von vollautomatischen Schweißmaschinen, ",
	},
	{
		left: 284.35,
		top: 458.64,
		children: "Hilfstätigkeiten in der Produktion ",
	},
	{
		left: 166.1,
		top: 477.48,
		bold: true,
		children: "Mai 1991 – September 1991 ",
	},
	{ left: 284.35, top: 477.48, bold: true, children: "Lagerhelfer " },
	{ left: 217.25, top: 488.4, bold: true, children: "Unternehmen " },
	{
		left: 284.35,
		top: 488.4,
		children: "Heinrich W. Trott GmbH & Co. KG Spezialdruckerei, ",
	},
	{ left: 284.35, top: 499.32, children: "42781 Haan " },
	{ left: 205.25, top: 510.24, bold: true, children: "Aufgabenbereich " },
	{
		left: 284.35,
		top: 510.24,
		children: "Hilfstätigkeiten in der Lagerlogistik, verpacken, ",
	},
	{ left: 284.35, top: 521.16, children: "umpacken, kommissionieren " },
	{
		left: 165.02,
		top: 542.04,
		bold: true,
		children: "Dezember 1989 – April 1991 ",
	},
	{
		left: 284.35,
		top: 542.04,
		bold: true,
		children: "Helfer im Verpackungsbereich, Produktionshelfer ",
	},
	{ left: 217.25, top: 552.84, bold: true, children: "Unternehmen " },
	{
		left: 284.35,
		top: 552.84,
		children: "Gallus Geflügel- Spezialitäten GmbH & Co., ",
	},
	{ left: 284.35, top: 563.76, children: "49393 Lohne " },
	{ left: 205.25, top: 574.68, bold: true, children: "Aufgabenbereich " },
	{
		left: 284.35,
		top: 574.68,
		children: "Verpacken von Geflügelfleisch, Hilfstätigkeiten ",
	},
	{ left: 284.35, top: 585.6, children: "in der Produktion " },
	{
		left: 229.01,
		top: 606.48,
		bold: true,
		color: SECTION,
		children: "Kenntnisse",
	},
	{ left: 207.41, top: 633.51, children: "Sprachkenntnisse " },
	{
		left: 284.35,
		top: 633.51,
		children: "Deutsch (fließend), Bengali (Muttersprache), Hindi (fließend), ",
	},
	{ left: 284.35, top: 652.35, children: "Englisch (Grundkenntnisse) " },
	{ left: 224.57, top: 671.31, children: "Führerschein " },
	{ left: 284.35, top: 671.31, children: "Klasse B " },
	{
		left: 231.17,
		top: 706.11,
		bold: true,
		color: SECTION,
		children: "Interessen ",
	},
	{ left: 245.09, top: 732.99, children: "Hobbys " },
	{ left: 284.35, top: 732.99, children: "Lesen, Wandern, Rad fahren " },
	{ left: 70.82, top: 788.9, children: "Haan, " },
	{ left: 94.46, top: 788.9, color: RED, children: "08.11.2026" },
];

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

function BewerbungAbdurRezzaque() {
	const pageRefs = useRef<Array<HTMLElement | null>>([]);
	const [isDownloading, setIsDownloading] = useState(false);

	useEffect(() => {
		const previousTitle = document.title;
		document.title = "Bewerbung — Abdur Rezzaque";
		return () => {
			document.title = previousTitle;
		};
	}, []);

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
					scale: 2,
					useCORS: true,
				});

				if (index > 0) pdf.addPage("a4", "portrait");
				pdf.addImage(
					canvas.toDataURL("image/jpeg", 0.98),
					"JPEG",
					0,
					0,
					width,
					height,
					undefined,
					"MEDIUM"
				);
			}

			pdf.save("Bewerbung_Abdur_Rezzaque.pdf");
		} finally {
			setIsDownloading(false);
		}
	};

	return (
		<main className="bew-workspace">
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

			<section className="bew-pages" aria-label="Bewerbung Abdur Rezzaque">
				<article
					className="bew-page"
					ref={(node) => {
						pageRefs.current[0] = node;
					}}
				>
					<div className="bew-banner bew-banner--cover" />
					<T left={431.62} top={50.63} size={14.04} color={WHITE}>
						Bewerbung
					</T>
					<img
						alt="Portrait of Abdur Rezzaque"
						className="bew-photo bew-photo--cover"
						src={portraitCover}
					/>
					<T left={267.17} top={381.22}>
						Abdur Rezzaque
					</T>
					<T left={270.65} top={419.04}>
						Seilbahnweg 6
					</T>
					<T left={275.33} top={437.88}>
						42781 Haan
					</T>
					<T left={256.49} top={456.84}>
						Mobil: 0176 40522796
					</T>
					<T left={227.09} top={475.68}>
						E-Mail: Abdur.rezzaque60@gmail.com
					</T>
				</article>

				<article
					className="bew-page"
					ref={(node) => {
						pageRefs.current[1] = node;
					}}
				>
					<div className="bew-banner bew-banner--letter" />
					<T left={431.62} top={50.63} size={14.04} color={WHITE}>
						Anschreiben
					</T>
					<T left={70.82} top={35.43} size={9.96}>
						Abdur Rezzaque
					</T>
					<T left={70.82} top={48.99} size={9.96}>
						Seilbahnweg 6, 42781 Haan
					</T>
					<T left={70.82} top={62.67} size={9.96}>
						Mobil: 0176 40522796
					</T>
					<T left={70.82} top={76.25} size={9.96}>
						E-Mail: abdur.rezzaque60@gmail.com
					</T>
					<T left={70.82} top={135.91} color={RED}>
						Hadey Industries
					</T>
					<T left={70.82} top={146.83} color={RED}>
						Schimmelbuschstraße 3
					</T>
					<T left={70.82} top={157.75} color={RED}>
						40699 Erkrath-Hochdahl, Germany
					</T>
					<T left={467.74} top={179.47} color={RED}>
						08.11.2026
					</T>
					{letterBody.map((line) => (
						<T key={`${line.top}-${line.children.slice(0, 18)}`} {...line} />
					))}
				</article>

				<article
					className="bew-page"
					ref={(node) => {
						pageRefs.current[2] = node;
					}}
				>
					<div className="bew-banner bew-banner--cv" />
					<T left={407.2} top={50.03} size={14.04} color={WHITE}>
						 Lebenslauf
					</T>
					<img
						alt="Portrait of Abdur Rezzaque"
						className="bew-photo bew-photo--cv"
						src={portraitCv}
					/>
					<hr className="bew-rule" style={{ top: "113.115pt" }} />
					<hr className="bew-rule" style={{ top: "295.715pt" }} />
					<hr className="bew-rule" style={{ top: "613.575pt" }} />
					<hr className="bew-rule" style={{ top: "713.445pt" }} />
					{cvLines.map((line) => (
						<T
							key={`${line.left}-${line.top}-${line.children.slice(0, 20)}`}
							{...line}
						/>
					))}
				</article>
			</section>
		</main>
	);
}

export default BewerbungAbdurRezzaque;
