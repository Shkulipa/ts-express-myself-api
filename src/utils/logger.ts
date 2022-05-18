import pino from "pino";
import pretty from "pino-pretty";
import dayjs from "dayjs";

const stream = pretty({
	colorize: true,
	ignore: "pid,hostname",
	customPrettifiers: {
		time: () => `🕰 ${dayjs().format("DD.MM.YY | HH:mm:ss")}`
	}
});
const logger = pino(stream);

export default logger;
