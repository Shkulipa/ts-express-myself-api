import { connect } from "mongoose";
import logger from "../utils/logger";

class DBService {
	async connectDB() {
		try {
			if (process.env.DB_URL) {
				await connect(process.env.DB_URL);
				logger.info("✅ DB connected");
			} else {
				throw new Error("❌ Url to database isn't correct, check your .env");
			}
		} catch (err) {
			logger.error("❌ Clound't connect to DB.", err);
			process.exit(1);
		}
	}
}

export default new DBService();
