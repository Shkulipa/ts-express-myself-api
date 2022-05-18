import nodemailer from "nodemailer";
import { Types } from "mongoose";
import { omit } from "lodash";
import { customAlphabet } from "nanoid";
import ActivationEmailLinksModel from "./../models/activationEmailLinks.model";
import UserModel from "../models/user.model";
import { IActivationEmailKeys } from "../types/activationEmail.type";
import { IUserDecode, IUserKeys } from "../types/user.type";
import { alphabet, baseActivationLink } from "../utils/const";
import { activateEmail } from "../emails/activate.email";
import { recoverEmail } from "../emails/recover.email";

class EmailService {
	private createTransport() {
		return nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: Number(process.env.SMTP_PORT),
			secure: false,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS
			}
		});
	}

	async sendActivatationMail(
		username: string,
		to: string,
		activationLink: string
	) {
		const transporter = this.createTransport();

		/**
		 * check spam if you haven't found the email
		 */
		await transporter.sendMail({
			from: process.env.SMTP_USER,
			to,
			subject: `Activation the account on the ${process.env.API_URL}`,
			html: activateEmail(username, to, activationLink)
		});
	}

	async sendRecoverMail(username: string, to: string, recoverLink: string) {
		const transporter = this.createTransport();

		/**
		 * check spam if you haven't found the email
		 */
		await transporter.sendMail({
			from: process.env.SMTP_USER,
			to,
			subject: `Recover the password for ${username} on the ${process.env.API_URL}`,
			html: recoverEmail(username, recoverLink)
		});
	}

	async resendActivateEmail(reqUser: IUserDecode) {
		try {
			const { _id, activateEmail } = reqUser;
			if (activateEmail) throw new Error("Email has activated already");

			const uniqueId = customAlphabet(alphabet, 16)();
			const activationLink =
				process.env.API_URL + baseActivationLink + uniqueId;

			await ActivationEmailLinksModel.findOneAndUpdate(
				{ userId: _id },
				{ $set: { activationLink } }
			);

			await this.sendActivatationMail(
				reqUser.username,
				reqUser.email,
				activationLink
			);
		} catch (err: any) {
			throw new Error(err);
		}
	}

	async confirmActivateEmail(linkId: string) {
		try {
			const activationLink = process.env.API_URL + baseActivationLink + linkId;
			const user = await ActivationEmailLinksModel.findOne({
				activationLink
			}).populate({
				path: IActivationEmailKeys.userId,
				select: [IUserKeys._id]
			});
			if (!user) throw new Error("Activation link is uncorrect");

			const userUpdated = await UserModel.findOneAndUpdate(
				{
					_id: new Types.ObjectId(user.userId._id)
				},
				{ $set: { activateEmail: true } },
				{ new: true }
			);

			await ActivationEmailLinksModel.findOneAndDelete({ activationLink });

			return omit(userUpdated!.toJSON(), ["password"]);
		} catch (err: any) {
			throw new Error(err);
		}
	}
}

export default new EmailService();
