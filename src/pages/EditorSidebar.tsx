import { useRef, type ChangeEvent } from "react";
import {
	createJob,
	defaultData,
	type BewerbungData,
	type Job,
} from "../bewerbung/data";

export type TabId = "personal" | "anschreiben" | "lebenslauf";

export const TABS: Array<{ id: TabId; label: string }> = [
	{ id: "personal", label: "Persönlich" },
	{ id: "anschreiben", label: "Anschreiben" },
	{ id: "lebenslauf", label: "Lebenslauf" },
];

type Props = {
	data: BewerbungData;
	open: boolean;
	tab: TabId;
	onChange: (next: BewerbungData) => void;
	onTabChange: (tab: TabId) => void;
	onToggle: () => void;
};

function readFile(file: File) {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(file);
	});
}

function Field({
	id,
	label,
	value,
	onChange,
	multiline = false,
	rows = 4,
}: {
	id: string;
	label: string;
	value: string;
	onChange: (value: string) => void;
	multiline?: boolean;
	rows?: number;
}) {
	return (
		<label className="bew-field" htmlFor={id}>
			<span>{label}</span>
			{multiline ? (
				<textarea
					id={id}
					onChange={(event) => onChange(event.target.value)}
					rows={rows}
					value={value}
				/>
			) : (
				<input
					id={id}
					onChange={(event) => onChange(event.target.value)}
					type="text"
					value={value}
				/>
			)}
		</label>
	);
}

function PhotoField({
	label,
	value,
	fallback,
	onChange,
}: {
	label: string;
	value: string;
	fallback: string;
	onChange: (value: string) => void;
}) {
	const inputRef = useRef<HTMLInputElement>(null);

	const onFile = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		event.target.value = "";
		if (!file) return;
		onChange(await readFile(file));
	};

	return (
		<div className="bew-photo-field">
			<span>{label}</span>
			<div className="bew-photo-field-row">
				<img alt="" src={value} />
				<div className="bew-photo-field-actions">
					<button onClick={() => inputRef.current?.click()} type="button">
						Ersetzen
					</button>
					{value !== fallback ? (
						<button onClick={() => onChange(fallback)} type="button">
							Zurücksetzen
						</button>
					) : null}
				</div>
			</div>
			<input
				accept="image/*"
				hidden
				onChange={(event) => void onFile(event)}
				ref={inputRef}
				type="file"
			/>
		</div>
	);
}

function EditorSidebar({
	data,
	open,
	tab,
	onChange,
	onTabChange,
	onToggle,
}: Props) {
	const patch = (partial: Partial<BewerbungData>) => {
		onChange({ ...data, ...partial });
	};

	const setCompanyName = (companyName: string) => {
		const previous = data.companyName.trim();
		onChange({
			...data,
			companyName,
			letterBody:
				previous && companyName
					? data.letterBody.split(previous).join(companyName)
					: data.letterBody,
		});
	};

	const setJob = (id: string, partial: Partial<Job>) => {
		onChange({
			...data,
			jobs: data.jobs.map((job) =>
				job.id === id ? { ...job, ...partial } : job
			),
		});
	};

	return (
		<>
			<aside
				aria-hidden={!open}
				aria-label="Bewerbung bearbeiten"
				className={`bew-sidebar${open ? "" : " is-collapsed"}`}
				inert={!open}
			>
				<div className="bew-sidebar-inner">
					<header className="bew-sidebar-head">
						<div>
							<p className="bew-sidebar-kicker">Bearbeiten</p>
							<h1>Bewerbungsdaten</h1>
						</div>
						<button
							aria-label="Seitenleiste schließen"
							className="bew-sidebar-close"
							onClick={onToggle}
							type="button"
						>
							‹
						</button>
					</header>

					<div aria-label="Abschnitte" className="bew-tabs" role="tablist">
						{TABS.map((item) => {
							const selected = tab === item.id;
							return (
								<button
									aria-controls={`panel-${item.id}`}
									aria-selected={selected}
									className={`bew-tab${selected ? " is-active" : ""}`}
									id={`tab-${item.id}`}
									key={item.id}
									onClick={() => onTabChange(item.id)}
									role="tab"
									type="button"
								>
									{item.label}
								</button>
							);
						})}
					</div>

					<form
						className="bew-sidebar-form"
						onSubmit={(event) => event.preventDefault()}
					>
						<div
							aria-labelledby="tab-personal"
							className="bew-tab-panel"
							hidden={tab !== "personal"}
							id="panel-personal"
							role="tabpanel"
						>
							<Field
								id="person-name"
								label="Name"
								onChange={(name) => patch({ name })}
								value={data.name}
							/>
							<Field
								id="person-street"
								label="Straße"
								onChange={(street) => patch({ street })}
								value={data.street}
							/>
							<Field
								id="person-city"
								label="PLZ / Ort"
								onChange={(city) => patch({ city })}
								value={data.city}
							/>
							<Field
								id="person-phone"
								label="Mobil"
								onChange={(phone) => patch({ phone })}
								value={data.phone}
							/>
							<Field
								id="person-email"
								label="E-Mail"
								onChange={(email) => patch({ email })}
								value={data.email}
							/>
							<Field
								id="person-birth"
								label="Geburtsdatum / -ort"
								onChange={(birth) => patch({ birth })}
								value={data.birth}
							/>
							<Field
								id="person-status"
								label="Familienstand"
								onChange={(maritalStatus) => patch({ maritalStatus })}
								value={data.maritalStatus}
							/>
							<Field
								id="person-job-title"
								label="Stellenbezeichnung"
								onChange={(jobTitle) => patch({ jobTitle })}
								value={data.jobTitle}
							/>
							<Field
								id="person-company"
								label="Unternehmen"
								onChange={setCompanyName}
								value={data.companyName}
							/>
							<PhotoField
								fallback={defaultData.photoCover}
								label="Foto Deckblatt"
								onChange={(photoCover) => patch({ photoCover })}
								value={data.photoCover}
							/>
							<PhotoField
								fallback={defaultData.photoCv}
								label="Foto Lebenslauf"
								onChange={(photoCv) => patch({ photoCv })}
								value={data.photoCv}
							/>
						</div>

						<div
							aria-labelledby="tab-anschreiben"
							className="bew-tab-panel"
							hidden={tab !== "anschreiben"}
							id="panel-anschreiben"
							role="tabpanel"
						>
							<Field
								id="letter-job-title"
								label="Stellenbezeichnung"
								onChange={(jobTitle) => patch({ jobTitle })}
								value={data.jobTitle}
							/>
							<Field
								id="letter-company"
								label="Unternehmen"
								onChange={setCompanyName}
								value={data.companyName}
							/>
							<Field
								id="letter-company-street"
								label="Straße (Unternehmen)"
								onChange={(companyStreet) => patch({ companyStreet })}
								value={data.companyStreet}
							/>
							<Field
								id="letter-company-city"
								label="Ort (Unternehmen)"
								onChange={(companyCity) => patch({ companyCity })}
								value={data.companyCity}
							/>
							<Field
								id="letter-date"
								label="Datum"
								onChange={(date) => patch({ date })}
								value={data.date}
							/>
							<Field
								id="letter-greeting"
								label="Anrede"
								onChange={(letterGreeting) => patch({ letterGreeting })}
								value={data.letterGreeting}
							/>
							<Field
								id="letter-body"
								label="Anschreiben-Text"
								multiline
								onChange={(letterBody) => patch({ letterBody })}
								rows={14}
								value={data.letterBody}
							/>
							<Field
								id="letter-closing"
								label="Grußformel"
								onChange={(letterClosing) => patch({ letterClosing })}
								value={data.letterClosing}
							/>
						</div>

						<div
							aria-labelledby="tab-lebenslauf"
							className="bew-tab-panel"
							hidden={tab !== "lebenslauf"}
							id="panel-lebenslauf"
							role="tabpanel"
						>
							{data.jobs.map((job, index) => (
								<fieldset className="bew-job-card" key={job.id}>
									<legend>Position {index + 1}</legend>
									<Field
										id={`${job.id}-period`}
										label="Zeitraum"
										onChange={(period) => setJob(job.id, { period })}
										value={job.period}
									/>
									<Field
										id={`${job.id}-title`}
										label="Berufsbezeichnung"
										onChange={(title) => setJob(job.id, { title })}
										value={job.title}
									/>
									<Field
										id={`${job.id}-company`}
										label="Unternehmen"
										onChange={(company) => setJob(job.id, { company })}
										value={job.company}
									/>
									<Field
										id={`${job.id}-duties`}
										label="Aufgabenbereiche"
										multiline
										onChange={(duties) => setJob(job.id, { duties })}
										rows={3}
										value={job.duties}
									/>
									{data.jobs.length > 1 ? (
										<button
											className="bew-job-remove"
											onClick={() =>
												onChange({
													...data,
													jobs: data.jobs.filter((item) => item.id !== job.id),
												})
											}
											type="button"
										>
											Position entfernen
										</button>
									) : null}
								</fieldset>
							))}
							<button
								className="bew-job-add"
								onClick={() =>
									onChange({ ...data, jobs: [...data.jobs, createJob()] })
								}
								type="button"
							>
								Position hinzufügen
							</button>
							<Field
								id="cv-languages"
								label="Sprachkenntnisse"
								multiline
								onChange={(languages) => patch({ languages })}
								rows={3}
								value={data.languages}
							/>
							<Field
								id="cv-license"
								label="Führerschein"
								onChange={(license) => patch({ license })}
								value={data.license}
							/>
							<Field
								id="cv-hobbies"
								label="Hobbys"
								onChange={(hobbies) => patch({ hobbies })}
								value={data.hobbies}
							/>
							<Field
								id="cv-place"
								label="Ort (Unterschriftszeile)"
								onChange={(cvPlace) => patch({ cvPlace })}
								value={data.cvPlace}
							/>
						</div>
					</form>
				</div>
			</aside>

			{open ? null : (
				<button
					aria-label="Bearbeiten öffnen"
					className="bew-sidebar-open"
					onClick={onToggle}
					type="button"
				>
					Bearbeiten
				</button>
			)}
		</>
	);
}

export default EditorSidebar;
