import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body
    const userId = req.user._id
    if(!userId){
        throw new ApiError(400, "User not found")
    }

    const tweet = await Tweet.create({content: content,  owner: userId})
     if(!tweet){
         throw new ApiError(500, "Something went wrong while creating tweet")
        }
    res.json(new ApiResponse(200, "Tweet created", tweet))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params
    const tweets = await Tweet.find({owner: userId})
    console.log(tweets)
    res.status(200).json(new ApiResponse(200, "User tweets", tweets))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params;
    const { content } = req.body;
    const tweet = await Tweet.findByIdAndUpdate(
      tweetId,
      {
        $set: { content },
      },
      { new: true }
    );
  
    res.status(200).json(new ApiResponse(200, "tweet updated", tweet));
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params;
    const tweet = await Tweet.findByIdAndDelete(tweetId);
    if (!tweet) {
        throw new ApiError(400, "No tweet found");
    }
    res.status(200).json(new ApiResponse(200, "Tweet deleted"));
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
