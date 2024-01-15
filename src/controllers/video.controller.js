import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  const skip = (page - 1) * limit;

  const allVideos = await Video.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      }
    }
  ]).skip(skip).limit(limit)

  
})

const publishAVideo = asyncHandler(async (req, res) => {
  // TODO: get video, upload to cloudinary, create video
  const { title, description, thumbnail, videoFile } = req.body;
  // validate data
  // upload thumbnail and video file to cloudinary
  // create video
  // return video
  // console.log(title, description, thumbnail, videoFile)

  if (title === "" || description === "") {
    throw new ApiError(400, "All fields are required");
  }

  let thumbnailUrl = await uploadOnCloudinary(req.files.thumbnail[0].path);
  let videoFileUrl = await uploadOnCloudinary(req.files.videoFile[0].path);

  // console.log(req.files)
  if (!videoFileUrl || !thumbnailUrl) {
    throw new ApiError(400, "Video file and thumbnail are required");
  }
  // console.log(videoFileUrl.url , videoFileUrl.duration)

  const video = await Video.create({
    title,
    description,
    thumbnail: thumbnailUrl.url,
    videoFile: videoFileUrl.url,
    duration: videoFileUrl.duration,
    owner:req.user._id
  });
  res.status(201).json(new ApiResponse(201, "Video created", video));
});

const getVideoById = asyncHandler(async (req, res) => {
  //TODO: get video by id
  const { videoId } = req.params;
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  res.status(200).json(new ApiResponse(200, "Video found", video));
});

const updateVideo = asyncHandler(async (req, res) => {
  //TODO: update video details like title, description, thumbnail
  const { videoId } = req.params;
  const { title, description, thumbnail } = req.body;
  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: { title, description, thumbnail },
    },
    { new: true }
  );

  res.status(200).json(new ApiResponse(200, "Video updated", video));
});

const deleteVideo = asyncHandler(async (req, res) => {
  //TODO: delete video
  const { videoId } = req.params;
  const video = await Video.findByIdAndDelete(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  res.status(200).json(new ApiResponse(200, "Video deleted"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findOneAndUpdate({ _id: videoId }, [
    { $set: { isPublished: { $eq: [false, "$isPublished"] } } },
  ]);
  if (!video) {
      throw new ApiError(404, "Video not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Video isPublished status updated", video));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
