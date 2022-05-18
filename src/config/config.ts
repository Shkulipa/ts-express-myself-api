import dotenv from "dotenv";
import path from "path";

// mode
dotenv.config({
	path: path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`)
});
