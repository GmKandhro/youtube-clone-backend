import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleLikes = async (modelName, id, userId) => {
    try {
        const existingLike = await Like.findOne({ [modelName]: id, likedBy: userId });

        if (existingLike) {
            await Like.findByIdAndDelete(existingLike._id);
            return new ApiResponse(200, "Like removed");
        } else {
            await Like.create({
                [modelName]: id,
                likedBy: userId
            });
            return new ApiResponse(200, "Like added");
        }
    } catch (error) {
        throw new ApiError(500, error.message);
    }
};

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const videoLikeResult = await toggleLikes('video', videoId, req.user._id);
  
    res.json(videoLikeResult)
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const commentLikeResult = await toggleLikes('comment', commentId, req.user._id);
    res.json(commentLikeResult)
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const tweetLikesResult = await toggleLikes('tweet', tweetId, req.user._id);
    res.json(tweetLikesResult)
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const likedVideos = await Like.find({likedBy: req.user._id}).populate('video')
    if(!likedVideos){
        throw new ApiError(404, "No liked videos found")
    }
     res.status(200).json(new ApiResponse(200, "Liked videos", likedVideos))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}