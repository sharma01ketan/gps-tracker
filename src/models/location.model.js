import mongoose, {Schema} from "mongoose";

const locationSchema = mongoose.Schema({
    latitude:{
        type: Number,
        required: [true,"Latitude is required"]
    },
    longitude: {
        type: Number,
        required: [true,"Longitude is required"]
    }
},{
    timestamps: true
});

export const Location = ("Location", locationSchema)