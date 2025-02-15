import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { response } from "express";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All Fields are required");
  }
  const videoLocalPath = req.files?.videoFile[0]?.path;
  const thumbnail = req.files?.thumbnail[0].path;
  if (!videoLocalPath) {
    throw new ApiError(400, "Video is required");
  }
  if (!thumbnail) {
    throw new ApiError(400, "Thumbnail is required");
  }
  const videoResponse  = await uploadOnCloudinary(videoLocalPath);
  const thumbnailResponse = await uploadOnCloudinary(thumbnail);
  if (!videoResponse?.url) {
    throw new ApiError(400, "Error while uploading video");
  }
  if (!thumbnailResponse?.url) {
    throw new ApiError(400, "Error while uploading thumbnail");
  }
  const videoDuration = videoResponse?.duration
  const video = await Video.create({
    title,
    description,
    videoFile: videoResponse.url,
    thumbnail: thumbnailResponse.url,
    duration: videoDuration,
    owner: req.user?._id,

  });
  return res.status(201).json( //201 is for resource creation (like a new video).
    new ApiResponse(201,video,"Video Uploaded Successfully")
  )
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  if(!videoId?.trim()){
    throw new ApiError(400,"Video is missing")
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  return res
  .status(200)  //Since you're fetching data, use 200 instead.
  .json(new ApiResponse(200, video, "Video Fetched Successfully"))
  
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
