import { TDeadlineTime } from "../types/deadlineTime.type";

export const parseDeadlineTimeHandler = (time: TDeadlineTime): number => {
	const numberTime = Number(time.match(/\d+/g)![0]);

	if (time.includes("m")) return numberTime * 6e4;
	if (time.includes("h")) return numberTime * 3.6e6;
	return numberTime * 8.64e7;
};
