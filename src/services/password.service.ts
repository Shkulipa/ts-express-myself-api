import bcrypt from "bcrypt";

class PasswordService {
	async encrypt(password: string): Promise<string> {
		if (process.env.SALT_ROUNDS) {
			return await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
		} else {
			throw new Error(
				"Creat in the .env file, variable SALT_ROUNDS = 10, need for bcrypt password"
			);
		}
	}

	async compare(password: string, encryptedPassword: string): Promise<boolean> {
		return await bcrypt.compare(password, encryptedPassword);
	}
}

export default new PasswordService();
