import { UploadedFile } from "express-fileupload";
import { customAlphabet } from "nanoid";
import fs from "fs";
import logger from "../utils/logger";
import { alphabet } from "./../utils/const";

class FileService {
	parseUploadFile(files: UploadedFile | UploadedFile[]): UploadedFile[] {
		if (Array.isArray(files)) {
			// if files are many
			return [...files];
		}
		// if file is single
		return [files];
	}

	isValidType(filesArrUpload: UploadedFile[], avaibleTypes: string[]): boolean {
		let isValid = true;
		for (const file of filesArrUpload) {
			if (!avaibleTypes.includes(file.mimetype)) isValid = false;
			if (isValid === false) break;
		}

		return isValid;
	}

	isValidSize(filesArrUpload: UploadedFile[], size: number): boolean {
		let isValid = true;
		for (const file of filesArrUpload) {
			if (file.size > size) isValid = false;
			if (isValid === false) break;
		}

		return isValid;
	}

	uploadFiles(files: UploadedFile[], path: string): string[] {
		const nameFilesUploaded: string[] = [];
		let isError = false;
		for (const file of files) {
			const uniqueSuffix = customAlphabet(alphabet, 10)();
			const typeImg = file.mimetype.split("/");
			const filename = `${typeImg[0]}-${uniqueSuffix}.${typeImg[1]}`;
			const pathFile = path + filename;

			file.mv(pathFile, err => {
				if (err) {
					logger.error(err);
					isError = true;
				}
			});

			/**
			 * Check for download errors
			 * if all good, we fix filename in array
			 * for record them in DB
			 */
			if (isError) break;
			nameFilesUploaded.push(filename);
		}

		if (isError)
			throw new Error(
				`Something went wrong while trying to upload a files, please try later`
			);

		return nameFilesUploaded;
	}

	typesToString(types: string[]) {
		return types.map(type => type.split("/")[1]).join(", ");
	}

	deleteFile(pathToFile: string) {
		if (fs.existsSync(pathToFile)) {
			fs.unlinkSync(pathToFile);
		} else {
			logger.error(`${pathToFile} file not found when deleting`);
		}
	}
}

export default new FileService();
