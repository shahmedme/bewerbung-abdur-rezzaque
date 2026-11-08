import portraitCover from "../assets/bewerbung/portrait-cover.jpg";
import portraitCv from "../assets/bewerbung/portrait-cv.jpg";

export type Job = {
	id: string;
	period: string;
	title: string;
	company: string;
	duties: string;
};

export type BewerbungData = {
	name: string;
	street: string;
	city: string;
	phone: string;
	email: string;
	birth: string;
	maritalStatus: string;
	photoCover: string;
	photoCv: string;
	companyName: string;
	companyStreet: string;
	companyCity: string;
	date: string;
	letterGreeting: string;
	letterBody: string;
	letterClosing: string;
	jobs: Job[];
	languages: string;
	license: string;
	hobbies: string;
	cvPlace: string;
};

export const defaultData: BewerbungData = {
	name: "Abdur Rezzaque",
	street: "Seilbahnweg 6",
	city: "42781 Haan",
	phone: "0176 40522796",
	email: "abdur.rezzaque60@gmail.com",
	birth: "17.06.1960 Tangail / Bangladesch",
	maritalStatus: "geschieden",
	photoCover: portraitCover,
	photoCv: portraitCv,
	companyName: "Hadey Industries",
	companyStreet: "Schimmelbuschstraße 3",
	companyCity: "40699 Erkrath-Hochdahl, Germany",
	date: "08.11.2026",
	letterGreeting: "Sehr geehrte Damen und Herren,",
	letterBody:
		"Ihr Unternehmen ist mir als erfolgreicher Produzent sehr gut bekannt. Nachdem ich mittlerweile seit vielen Jahren in einem mittelständischen Betrieb der kunststoffverarbeitenden Industrie tätig bin, möchte ich nun den nächsten Schritt gehen. Ich sehe durch Ihre Marktposition sehr gute Möglichkeiten, in einem großen Unternehmen zu arbeiten, mit dem ich wachsen kann. Ihre Internetseite hat mich zudem davon überzeugt, dass ich mit meinem Wissen und meinen Fähigkeiten Teil eines Teams werden kann, das die Unternehmensziele mit großer Leidenschaft vertritt aber auch durch Wertschätzung für den Einzelnen geprägt wird.\n\nIch möchte meine Erfahrung in der Produktion einbringen. In meiner bisherigen Tätigkeit als Maschinenbediener und Schichtführer konnte ich umfassende Kenntnisse im Umgang mit Siebdruckmaschinen und Etikettiermaschinen erwerben. Ich bin überzeugt, dass dieses Wissen für die Aufgabe sehr nützlich sein wird.\n\nAus meinem Lebenslauf können Sie ersehen, dass ich darüber hinaus Erfahrung als Lagerhelfer und Packer habe. Diese Praxiskenntnisse sind sicher ebenfalls wichtig. Mir fällt es leicht, Neues zu lernen und so erhoffe ich mir von der Arbeit für ein so renommiertes Unternehmen wie auch die kontinuierliche Hadey Industries Erweiterung meines Wissens.\n\nVolles Engagement für meine Aufgaben, Belastbarkeit und Zuverlässigkeit in allen Details meines Aufgabengebietes sind für mich eine Selbstverständlichkeit.\n\nIch bin überzeugt davon, dass ich viel zum Erfolg Ihres Unternehmens beitragen kann. Ich würde mich über die Gelegenheit freuen, Hadey Industries bei einem persönlichen Gespräch näher kennenzulernen.",
	letterClosing: "Mit freundlichen Grüßen",
	jobs: [
		{
			id: "job-1",
			period: "November 2020 – Oktober 2026",
			title: "Produktionsmitarbeiter, Maschinenhelfer, Montagehelfer",
			company: "Fola Abfülltechnik GmbH, 40822 Mettmann",
			duties:
				"Bedienen von Produktions- und Etikettiermaschienen, Qualitätskontrolle, Dosenmotage, Verpacken, Etikettieren und Konfektionieren",
		},
		{
			id: "job-2",
			period: "Januar 1992 – Juli 2020",
			title: "Maschinenbediener, Produktionshelfer, Schichtführer",
			company: "Schieferdecker GmbH & Co. KG, 40699 Erkrath",
			duties:
				"bedienen von Siebdruckmaschinen und Etikettiermaschinen, Konfektionierarbeiten, Komplettierarbeiten",
		},
		{
			id: "job-3",
			period: "Oktober 1991 – Dezember 1991",
			title: "Maschinenbediener, Produktionshelfer",
			company: "Deka- Roll GmbH, 42655 Solingen",
			duties:
				"bedienen von vollautomatischen Schweißmaschinen, Hilfstätigkeiten in der Produktion",
		},
		{
			id: "job-4",
			period: "Mai 1991 – September 1991",
			title: "Lagerhelfer",
			company: "Heinrich W. Trott GmbH & Co. KG Spezialdruckerei, 42781 Haan",
			duties:
				"Hilfstätigkeiten in der Lagerlogistik, verpacken, umpacken, kommissionieren",
		},
		{
			id: "job-5",
			period: "Dezember 1989 – April 1991",
			title: "Helfer im Verpackungsbereich, Produktionshelfer",
			company: "Gallus Geflügel- Spezialitäten GmbH & Co., 49393 Lohne",
			duties:
				"Verpacken von Geflügelfleisch, Hilfstätigkeiten in der Produktion",
		},
	],
	languages:
		"Deutsch (fließend), Bengali (Muttersprache), Hindi (fließend), Englisch (Grundkenntnisse)",
	license: "Klasse B",
	hobbies: "Lesen, Wandern, Rad fahren",
	cvPlace: "Haan",
};

export const STORAGE_KEY = "bewerbung-abdur-rezzaque:data";

function isJob(value: unknown): value is Job {
	if (!value || typeof value !== "object") return false;
	const job = value as Record<string, unknown>;
	return (
		typeof job.id === "string" &&
		typeof job.period === "string" &&
		typeof job.title === "string" &&
		typeof job.company === "string" &&
		typeof job.duties === "string"
	);
}

export function normalizeBewerbungData(value: unknown): BewerbungData {
	if (!value || typeof value !== "object") return defaultData;
	const raw = value as Partial<BewerbungData>;
	const jobs = Array.isArray(raw.jobs)
		? raw.jobs.filter(isJob)
		: defaultData.jobs;

	return {
		...defaultData,
		...raw,
		jobs: jobs.length > 0 ? jobs : defaultData.jobs,
		photoCover: raw.photoCover || defaultData.photoCover,
		photoCv: raw.photoCv || defaultData.photoCv,
	};
}

export function loadBewerbungData(): BewerbungData {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return defaultData;
		return normalizeBewerbungData(JSON.parse(stored));
	} catch {
		return defaultData;
	}
}

export function saveBewerbungData(data: BewerbungData) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	} catch {
		// Ignore quota / private-mode failures.
	}
}

export function createJob(): Job {
	return {
		id: `job-${crypto.randomUUID()}`,
		period: "",
		title: "",
		company: "",
		duties: "",
	};
}

export function fileNameFromName(name: string) {
	const slug = name
		.trim()
		.replace(/\s+/g, "_")
		.replace(/[^\w.-]/g, "")
		.replace(/_+/g, "_");
	return `Bewerbung_${slug || "Lebenslauf"}.pdf`;
}
