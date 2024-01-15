import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    const skip = (page - 1) * limit;
    const comments = await Comment.find({video: videoId}).skip(skip).limit(limit)
    if(!comments){
        throw new ApiError(404, "Comments not found")
    }
    res.json(new ApiResponse(200, "Comments retrieved", comments))
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {content} = req.body;
    const {videoId} = req.params 

    const comment = await Comment.create({content, owner: req.user._id, video: videoId})
    if(!comment){
        throw new ApiError(500, "Something went wrong while creating comment")
    }
    res.json(new ApiResponse(200, "Comment created", comment))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {content} = req.body
    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set:{content}
        },
        {
            new:true
        }
    )
    if(!comment){
    throw new ApiError(404, "Comment not found")
    }
    res.status(200).json(new ApiResponse(200, "Comment updated", comment))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params
    const comment = await Comment.findByIdAndDelete(commentId)
    if(!comment){
        throw new ApiError(404, "Comment not found")
    }
res.status(200).json(new ApiResponse(200, "Comment deleted"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
