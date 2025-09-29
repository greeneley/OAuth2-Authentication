import express from "express";
import mongoDbInit from "~/database/connectDb.js";
import mongoose, { Connection, Schema } from "mongoose";
import connection from "~/database/connectDb.js";
import * as process from "process";
import axios from "axios";
import "dotenv/config";
import jwt from "jsonwebtoken";
const app = express();
const port = 4000;

// const connection: Connection = await mongoDbInit;
//
// const userSchema = new Schema({
//   name: String,
//   age: Number
// }, {
//   timestamps: true,
//   collection: 'users'
// })

app.get("/", (req, res) => {
	res.send("hello world");
});

const getOauthGoogleToken = async (code) => {
	// const body = {
	// 	code,
	// 	client_id: process.env.GOOGLE_CLIENT_ID,
	// 	client_secret: process.env.GOOGLE_CLIENT_SECRET,
	// 	redirect_uri: process.env.GOOGLE_AUTHORIZED_REDIRECT_URI,
	// 	grant_type: "authorization_code"
	// };

	// const qs = new URLSearchParams(body);

	const params = new URLSearchParams();
	params.append("code", code);
	params.append("client_id", process.env.GOOGLE_CLIENT_ID);
	params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET);
	params.append("redirect_uri", process.env.GOOGLE_AUTHORIZED_REDIRECT_URI);
	params.append("grant_type", "authorization_code");

	try {
		const { data } = await axios.post("https://oauth2.googleapis.com/token", params.toString(), {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		});
		return data;
	} catch (err) {
		if (axios.isAxiosError(err)) {
			console.error("Google error status:", err.response?.status);
			console.error("Google error data:", err.response?.data); // <--- đây quan trọng
		}
		throw err;
	}
};

const getGoogleUser = async ({ id_token, access_token }) => {
	const { data } = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo", {
		params: {
			access_token,
			alt: "json"
		},
		headers: {
			Authorization: `Bearer ${id_token}`
		}
	});

	return data;
};

app.get("/api/oauth/google", async (req, res, next) => {
	try {
		const { code } = req.query;

		const data = await getOauthGoogleToken(code);
		const { id_token, access_token } = data;

		const googleUser: any = await getGoogleUser({ id_token, access_token });

		console.log({ googleUser });
		if (!googleUser.verified_email) {
			return res.status(403).json({
				message: "Google email not verified"
			});
		}
		const manualAccessToken = jwt.sign({ email: googleUser.email, type: "access_token" }, process.env.AC_PRIVATE_KEY, {
			expiresIn: "15m"
		});

		const manualRefreshToken = jwt.sign(
			{ email: googleUser.email, type: "refresh_token" },
			process.env.RF_PRIVATE_KEY,
			{ expiresIn: "100d" }
		);

		return res.redirect(
			`http://localhost:5173/login/oauth?access_token=${manualAccessToken}&refresh_token=${manualRefreshToken}`
		);
	} catch (error) {
		next(error);
	}
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
