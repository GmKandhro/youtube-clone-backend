import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist

    const playlist = await Playlist.create({name,description, owner: req.user._id})
    if(!playlist){
        throw new ApiError(500, "Something went wrong while creating playlist")
    }

    res.json(new ApiResponse(200, "Playlist created", playlist))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    const playlists = await Playlist.find({owner : userId})
    if (!playlists) {
        throw new ApiError(400 , "playlist not found")
    }

    res.status(200).json(new ApiResponse(200, "userPlayLists Fetched" , playlists))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(400 , "Playlist not found")
    }
res.status(200).json(new ApiResponse(200,"playlist Fetched successfully", playlist))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    const videoToplaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $push: { videos: videoId }
        },
        {
            new:true
        }
    ).populate('videos');


    if(!videoToplaylist){
        throw new ApiError(400 , "Something went wrong while adding video to playlist")
    }

    res.status(200).json(new ApiResponse(200, "Video added to playlist", videoToplaylist))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    const removeVideoFromPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
             $pull: { videos: { $in: [videoId] } }
        },
        {
            new:true
        }
    ).populate('videos');

  

    if(!removeVideoFromPlaylist){
        throw new ApiError(400 , "Something went wrong while deleting video to playlist")
    }
    res.status(200).json(new ApiResponse(200, "Video deleted from playlist", removeVideoFromPlaylist))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);
    if(!deletedPlaylist){
        throw new ApiError(400 , "Something went wrong while deleting a playlist")
    }
    res.status(200).json(new ApiResponse(200, "Playlist deleted"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {name, description}
        },
        {
            new: true
        }
    )
    if (!updatePlaylist) {
        throw new ApiError(400 , "Something went wrong while updating playlist")
    }
    res.status(200).json(new ApiResponse(200, "Playlist updated", updatedPlaylist))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
