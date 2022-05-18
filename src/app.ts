import "./config/config";
import express, { Application } from "express";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import DBService from "./services/db.service";
import logger from "./utils/logger";
import fileUpload from "express-fileupload";
import { API_VERSION } from "./utils/const";
import router from "./routes/index";
import { version } from "../package.json";
import "./passport/strategies/google.strategy";
import "./passport/strategies/github.strategy";
import "./passport/passport.serialize";

const host = process.env.HOST;
const port = process.env.PORT;

const app: Application = express();
app.use(
	session({
		resave: false,
		saveUninitialized: true,
		secret: String(process.env.SECRET_SESSION)
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(
	fileUpload({
		createParentPath: true,
		useTempFiles: true,
		tempFileDir: `${__dirname}/statics/temp-file/`,
		parseNested: true
	})
);
app.use(express.json());
app.use(cookieParser());
app.use(API_VERSION, router);
app.use("/posts", express.static(`${__dirname}/statics/images/posts`));
app.use("/avatars", express.static(`${__dirname}/statics/images/avatars`));

app.listen(port, async (): Promise<void> => {
	logger.info(
		`🚀 Server(v${version}) started on the: http://${host}:${port} (mode: ${process.env.NODE_ENV})`
	);

	await DBService.connectDB();
});
