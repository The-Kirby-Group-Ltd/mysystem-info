// call status mappings

export const callStatusLabels: Record<string, string> = {
    A: "Assigned to Engineer",
    C: "Completed (invoiced)",
    E: "Engineer Completed (not invoiced)",
    F: "Further Action Required",
    N: "New",
    R: "Response in Progress",
};

export const getCallStatusLabel = (status: string): string => {
    const cleanStatus = status.trim().toUpperCase();
    return callStatusLabels[cleanStatus] || "Unknown";
}

// call type mappings

export const callTypeLabels: Record<string, string> = {
    "!": "Customer Complaints",
    '"': "audit",
    "#": "External Sounder",
    "$": "Police Confirmed Visit",
    "%": "OnCall",
    "&": "Frasers Survey",
    "(": "Frasers - Quoted Works",
    ")": "Frasers - Telephone Support",
    "*": "Fire Alarm Install",
    "+": "Frasers: Follow On",
    "-": "Frasers - FRA Quoted Works",
    ".": "Admirals",
    "0": "Contract",
    "1": "SSP C (5 Days)",
    "2": "Unconfirmed Alarm Visit",
    "3": "Modem Configuration",
    "4": "Questions",
    "5": "Key Holder Amendment",
    "6": "Intruder On Test Request",
    "7": "Electrical Works",
    "8": "Frasers - Reactive Call Out",
    "9": "Frasers - RES Reactive Call Out",
    ":": "Kirby Office Meeting",
    ";": "Kirby Office",
    "<": "Frasers - FRA Works",
    "=": "Frasers - Projects",
    ">": "Frasers - PPM",
    "?": "Do Not Use",
    "@": "Takeover",
    "A": "System Upgrade",
    "B": "ARC Move",
    "C": "Corrective Maintenance",
    "D": "Disconnection",
    "E": "Extra Works",
    "F": "Commissioning",
    "G": "General Maintenance",
    "H": "IT & Communications OOH Call",
    "I": "Security Installation",
    "J": "MJF 4 Hour Response",
    "K": "HVAC",
    "L": "Admiral Project Refurbs",
    "M": "Telephone Support Call",
    "N": "Returns",
    "O": "Communicator Connection",
    "P": "Preventative Maintenance",
    "Q": "Works Resulting From Quotation",
    "R": "Remote Reset",
    "S": "Survey",
    "T": "Remote Technical Assistance",
    "U": "IT & Communications Works",
    "V": "Do Not Use",
    "X": "Cancelled",
    "Y": "SSP A (4 Hours)",
    "Z": "SSP B (24 Hours)",
    "[": "Frasers - FRA Zone Plan",
    '\'': "Plumbing",
    "]": "Engineer Meeting",
    "^": "Training",
    "_": "MSL Electrical",
    "`": "Dormant Account",
    "{": "Frasers - Joint Visit",
    "}": "Frasers - Zone Plan",
    "~": "Frasers - Under Remit",
    "€": "Unrestored Pins",
    "…": "Maglock Install",
    "†": "RCL Fire Works",
    "‡": "RCL Electrical Works",
    "‰": "Capex CCTV Admiral",
    "Š": "FR/FWARE Update",
    "™": "GG P2 (24 Hours)",
    "¢": "GG P1 (1-4 Hours)",
    "£": "CCTV Checklist",
    "¤": "GG P3 (3 Days)",
    "¬": "Van Stock",
    "®": "Capex Multi Admiral",
    "¶": "Site Training",
    "¿": "Travel",
};

export const getCallTypeLabel = (callType: string): string => {
    const cleanCallType = callType.trim();
    return callTypeLabels[cleanCallType] || `Unknown`;
}

// map reference string

export const getCallTypeDisplay = (
	callType: string
): string => {
	const cleanCallType = callType?.trim() ?? "";

	if (!cleanCallType) {
		return "—";
	}

	return (
		callTypeLabels[cleanCallType] ??
		cleanCallType
	);
};

export const getCallStatusDisplay = (
	status: string
): string => {
	const cleanStatus =
		status?.trim().toUpperCase() ?? "";

	if (!cleanStatus) {
		return "—";
	}

	return (
		callStatusLabels[cleanStatus] ??
		status
	);
};