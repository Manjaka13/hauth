import mongoose from "mongoose";

/**
 * Model for the account collection
 */

export default mongoose.model(
	"accounts",
	new mongoose.Schema(
		{
			firstname: {
				type: String,
				required: false,
			},
			lastname: {
				type: String,
				trim: true,
				required: false,
			},
			email: {
				type: String,
				required: true,
			},
			password: {
				type: String,
				required: true,
			},
			level: {
				type: Number,
				min: 0,
				max: 2,
				default: 2,
				required: true,
			},
			avatar: {
				type: String,
				required: false,
			},
			banned: {
				type: Boolean,
				default: false,
				required: true,
			},
			app: {
				type: String,
				required: true,
				trim: true,
			},
			confirmationId: {
				type: String,
			},
		},
		{ timestamps: true }
	)
);
