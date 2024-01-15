import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    const subscription = await Subscription.findOne({channel: channelId, subscriber: req.user._id})

    if (!subscription) {
        // create subscription for current user
        const newSubscription = await Subscription.create({channel: channelId, subscriber: req.user._id})
        res.status(201).json(new ApiResponse("Channel subscription created successfully!", { newSubscription }))
    }
    else {
        // delete subscription for current user
        await Subscription.findByIdAndDelete(subscription._id)
        res.status(200).json(new ApiResponse("Channel subscription deleted successfully!", {}))
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    //kon kon subscribe kia
    const { subscriberId } = req.params;
    // const userId = req.user._id;
    try {
      //Aggregation use karengey aur details fetch karengey
      const subscribers = await Subscription.aggregate([
        {
          $match: {
            channel: new mongoose.Types.ObjectId(subscriberId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "subscriber",
            foreignField: "_id",
            as: "subscriberDetails",
          },
        },
        {
          $project: {
            _id: 0,
            subscriberDetails: {
              _id: 1,
              username: 1,
            },
          },
        },
      ]);
      // const subscribers = await Subscription.countDocuments({ channel: subscriberId });
      //Array null nahi honi chahie islie check laga rahe hai
      const subscriberDetails =
        subscribers && subscribers.length > 0
          ? subscribers.map((subscriber) => subscriber.subscriberDetails)
          : [];
      res.status(200)
        .json(
          new ApiResponse(
            200,
            subscriberDetails[0],
            "Subscribers retrieved successfully"
          )
        );
    } catch (error) {
      throw new ApiError(500, error.message);
    }
  }); 

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (subscriberId) {
        throw new ApiError(400, "Invalid subscriber id")
    }

    const channels = await Subscription.aggregate([
        {
            $match:{
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup:{
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channelDetails",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullname: 1,
                            avatar: 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                channelDetails: {
                    $arrayElemAt: ["$channelDetails", 0]
                }
            }
        },
        {
            $project: {
                _id: 0,
                channelDetails: 1
            }
        }

    ])

    res.json(new ApiResponse(200, "Channels retrieved successfully", channels))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}