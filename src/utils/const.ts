import { version } from "./../../package.json";

/**
 * Need for create unique id(from help nanoid
 */
export const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";

export const API_VERSION = `/api/v${version}`;

export const baseActivationLink = `${API_VERSION}/user/confirm-activate-email/`;

export const imgTypes = ["image/png", "image/jpg", "image/jpeg"];
