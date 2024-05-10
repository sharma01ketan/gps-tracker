import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from "../utils/ApiError.js"
import {User} from '../models/user.model.js'
import { ApiResponse } from '../utils/ApiResponse.js'

const registerUser = asyncHandler( async(req,res)=>{
    // res.status(200).json({
    //     message:"sharma01ketan",
    // })

    const {username,password} = req.body
    console.log(`${username} ${password}`)

    if(
        [username,password].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400,"All Fields are Required")
    }

    const existedUser = User.findOne({
        $or:[{username}]
    })
    if(existedUser){
        throw new ApiError(409,"User with username already exists")
    }

    const user = await User.create({
        username: username,
        password: password
    })

    const createdUser = await User.findById(user._id).select(
        "-password"
    )

    if(!createdUser){
        throw new ApiError(500, "Something Went Wrong While Registering The User")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User Registered Successfully")
    )
})

export {registerUser}