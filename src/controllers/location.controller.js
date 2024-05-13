import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Location } from '../models/location.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import haversine from 'haversine-distance'
import {User} from '../models/user.model.js'

const createLocation = asyncHandler(async (req, res) => {
    const { latitude, longitude } = req.body;
    console.log(`${latitude} ${longitude}createlocation`)

    if(
        [latitude,longitude].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400,"All Fields are Required")
    }

    const existedLocation = await Location.findOne({
        $or:[{latitude,longitude}]
    })

    if(existedLocation){
        throw new ApiError(409,"Location already exists")
    }

    try {
        const location = await Location.create({
            latitude,
            longitude
        });

        const createdLocation = await Location.findById(location._id)

        if(!createLocation){
            throw new ApiError(500, "Something went wrong while registering the location")
        }

        console.log(`Location Added: ${latitude} ${longitude}`)
        return res.status(201).json(
            new ApiResponse(201, location, 'Location saved successfully')
        );
    } catch (error) {
        throw new ApiError(500, 'Failed to save location data');
    }
});


const closestDistance = asyncHandler(async (req, res) => {
    const { latitude, longitude } = req.body;
    console.log("The request body is:", req.body);

    if (!latitude || !longitude) {
        throw new ApiError(400, "All Fields are Necessary. Value passed as empty.");
    }

    const locations = await Location.find().select('latitude longitude -_id');
    if (locations.length === 0) {
        throw new ApiError(404, "No Locations Found");
    }

    let closestLocation;
    let closestDistance = Infinity;

    locations.forEach(location => {
        console.log(`Latitude and Longitude is ${latitude}, ${longitude}`);
        const distance = haversine({ latitude, longitude }, { latitude: location.latitude, longitude: location.longitude });
        if (distance < closestDistance) {
            closestDistance = distance;
            closestLocation = location;
        }
    });

    console.log("Found The Closest Location", closestLocation);
    
    return res.status(200).json({
        "Message": "Found The Closest Location",
        "Closest Distance in Meters": closestDistance,
        "Location": closestLocation
    });
});

const calculateDistance = asyncHandler(async (req, res) => {
    const { coordinate1, coordinate2 } = req.body;
    console.log("The request body is:", req.body);

    if (!coordinate1.latitude || !coordinate1.longitude || !coordinate2.longitude || !coordinate2.latitude) {
        throw new ApiError(400, "All Fields are Necessary. Value passed as empty.");
    }

    const distance = haversine(coordinate1, coordinate2);

    return res.status(200).json(new ApiResponse(200, {
        "Message": "Calculated Haversine Distance",
        "Distance in Meters": distance
    }));
});


const addLocation = asyncHandler(async (req, res) => {

    const { latitude, longitude, username } = req.body;
    console.log(req.body)
    console.log(`${latitude} ${longitude} ${username} addLocation`);
    
    try {
        const user = await User.findOne({
            $or:[{username}]
        })
        console.log(`User id is ${user._id}`)

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const location = await Location.create({
            latitude,
            longitude
        });

        user.locations.push(location);

        await user.save();

        console.log(`Location added to user: ${latitude} ${longitude}`);

        return res.status(201).json(
            new ApiResponse(201, user.locations, 'Location added to user successfully')
        );
    } catch (error) {
        throw new ApiError(500, 'Failed to add location to user');
    }
});

const allLocations = asyncHandler(async (req, res) => {
    try {
        const { username } = req.body; // Assuming username is sent in the request body

        const user = await User.findOne({ username });

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const locations = user.locations; // Accessing locations after user is retrieved

        console.log(`User id is ${user._id}`);
        console.log(`The locations array is: ${locations}`);

        return res.status(200).json(new ApiResponse(200, locations, 'Returned all locations'));
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw new ApiError(500, 'Failed to fetch locations');
    }
});



export { createLocation, calculateDistance, closestDistance ,addLocation, allLocations}
