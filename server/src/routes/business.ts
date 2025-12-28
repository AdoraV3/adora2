/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from "express"
import { Business } from "../models/Business"
import { UserBusiness } from "../models/UserBusiness"
import { Agent } from "../models/Agent"
import { Voice } from "../models/Voice"
import { Profile } from "../models/Profile"
import { User } from "../models/User"
import { authMiddleware, type AuthRequest } from "../middleware/auth"
import { AppError } from "../middleware/errorHandler"
import { vapiService } from "../utils/vapi"
import { createNotification } from "../utils/notification"
import { redisService } from "../utils/redis"

const router = Router()

router.post("/", authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId
    if (!userId) {
      throw new AppError(401, "User not authenticated")
    }

    const {
      name,
      description,
      logo,
      country,
      customerBase,
      voice,
      phoneNumberId,
      categoryId,
      vapiPhoneNumber,
      agentName,
    } = req.body

    // Check if business already exists
    const existingBusiness = await Business.findOne({ userId })
    if (existingBusiness) {
      throw new AppError(400, "Business already exists for this user")
    }

    // Create VAPI assistant
    const assistantData = await vapiService.createAssistant(name, voice || "Rohan")

    const now = new Date()
    const freeTrialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    // Create business
    const business = new Business({
      userId,
      name,
      description,
      logo,
      country: country || "US",
      customerBase,
      agentName: agentName || `${name} Agent`,
      voiceId: voice || "Rohan",
      vapiAssistantId: assistantData.id,
      isProfileCompleted: true,
      isFreeTrial: true,
      freeTrialStartDate: now,
      freeTrialEndDate: freeTrialEnd,
      vapiEnabledUntil: freeTrialEnd,
    })
    await business.save()

    if (categoryId && phoneNumberId && vapiPhoneNumber) {
      const agent = new Agent({
        businessId: business._id.toString(),
        agentName: agentName || `${name} Agent`,
        vapiAssistantId: assistantData.id,
        phoneNumberId: phoneNumberId,
        voiceId: voice || "Rohan",
        vapiPhoneNumber: vapiPhoneNumber, // Use vapiPhoneNumber from request body
        categoryId: categoryId,
      })
      await agent.save()
    }

    const userBusiness = new UserBusiness({
      userId,
      businessId: business._id.toString(),
      role: "owner",
    })
    await userBusiness.save()

    await redisService.set(redisService.businessKey(business._id.toString()), business, 3600)
    await redisService.del(redisService.userBusinessesKey(userId))

    const activityKey = `business:${business._id}:activity`
    await redisService.set(
      activityKey,
      [
        {
          timestamp: new Date(),
          activity: "Business created",
          details: { name, country },
          userId,
        },
      ],
      604800,
    )

    await createNotification(
      userId,
      "success",
      "Business Created",
      `Your business "${name}" has been successfully created with a 7-day free trial.`,
      `/dashboard/business/${business._id}`,
    )

    const profile = await Profile.findOne({ userId })
    if (profile) {
      const isComplete = !!(
        profile.name &&
        profile.phone &&
        profile.country &&
        profile.bio &&
        profile.avatar &&
        business
      )

      if (isComplete) {
        await User.findByIdAndUpdate(userId, {
          profileCompleted: true,
          isFirstTimeUser: false,
        })
        business.isProfileCompleted = true
        await business.save()
        console.log("[v0] Profile marked as complete after business creation for user:", userId)

        await createNotification(
          userId,
          "success",
          "Setup Complete!",
          "Your profile and business setup is complete. You're ready to start receiving calls!",
          "/dashboard",
        )
      }
    }

    res.status(201).json({
      success: true,
      data: business,
    })
  } catch (error) {
    next(error)
  }
})

router.get("/user/all", authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId
    if (!userId) {
      throw new AppError(401, "User not authenticated")
    }

    const cached = await redisService.get(redisService.userBusinessesKey(userId))
    if (cached) {
      return res.json({ success: true, businesses: cached })
    }

    const userBusinesses = await UserBusiness.find({ userId }).lean()
    const businessIds = userBusinesses.map((ub) => ub.businessId)
    const businesses = await Business.find({ _id: { $in: businessIds } }).lean()

    await redisService.set(redisService.userBusinessesKey(userId), businesses, 3600)

    res.json({ success: true, businesses })
  } catch (error) {
    next(error)
  }
})

router.put("/:id", authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId
    if (!userId) {
      throw new AppError(401, "User not authenticated")
    }

    const { name, description, logo, country, customerBase, voice } = req.body

    const userBusiness = await UserBusiness.findOne({
      userId,
      businessId: req.params.id,
    })

    if (!userBusiness) {
      throw new AppError(403, "You don't have access to this business")
    }

    const business = await Business.findById(req.params.id)

    if (!business) {
      throw new AppError(404, "Business not found")
    }

    // Update business
    business.name = name || business.name
    business.description = description || business.description
    business.logo = logo || business.logo
    business.country = country || business.country
    business.customerBase = customerBase || business.customerBase
    await business.save()

    // Update agent if voice changed
    if (voice && business.vapiAssistantId) {
      const agent = await Agent.findOne({ businessId: business._id.toString() })
      if (agent && agent.vapiAssistantId) {
        await vapiService.updateAssistant(agent.vapiAssistantId, name, voice)
        agent.voiceId = voice
        await agent.save()
      }
    }

    await redisService.set(redisService.businessKey(business._id.toString()), business, 3600)
    await redisService.del(redisService.userBusinessesKey(userId))

    res.json({
      success: true,
      data: business,
    })
  } catch (error) {
    next(error)
  }
})

router.post("/:id/assign-phone-number", authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId
    if (!userId) {
      throw new AppError(401, "User not authenticated")
    }

    console.log("[v0] Assign phone number request received")
    console.log("[v0] Request body:", req.body)
    console.log("[v0] Request headers:", req.headers)

    const { vapiPhoneNumber, voiceId, agentName, categoryId } = req.body

    console.log("[v0] Destructured values:", { vapiPhoneNumber, voiceId, agentName, categoryId })

    if (!vapiPhoneNumber) {
      throw new AppError(400, "Phone number is required")
    }

    if (!categoryId) {
      throw new AppError(
        400,
        "categoryId is required. Available categories: ecommerce, fashion, electronics, grocery, furniture, hospitals, pharmacy, telemedicine, restaurants, hotels, airlines, banks, insurance, and more",
      )
    }

    const userBusiness = await UserBusiness.findOne({
      userId,
      businessId: req.params.id,
    })

    if (!userBusiness) {
      throw new AppError(403, "You don't have access to this business")
    }

    const business = await Business.findById(req.params.id)

    if (!business) {
      throw new AppError(404, "Business not found")
    }

    if (business.vapiPhoneNumberId) {
      try {
        await vapiService.releasePhoneNumber(business.vapiPhoneNumberId)
        console.log("[v0] Released old phone number:", business.vapiPhoneNumber)
      } catch (error) {
        console.error("[v0] Error releasing phone number:", error)
      }
    }

    console.log("[v0] Starting VAPI workflow - purchasing phone number:", vapiPhoneNumber)
    const phoneNumberId = await vapiService.purchasePhoneNumber(vapiPhoneNumber)
    console.log("[v0] Phone number purchased successfully from VAPI:", phoneNumberId)

    business.vapiPhoneNumberId = phoneNumberId
    business.vapiPhoneNumber = vapiPhoneNumber

    let selectedVoiceId: string = business.voiceId || "Rohan"
    let agentGender: "male" | "female" = "male"

    if (voiceId) {
      const validVoices = [
        "Elliot",
        "Kylie",
        "Rohan",
        "Lily",
        "Savannah",
        "Hana",
        "Neha",
        "Cole",
        "Harry",
        "Paige",
        "Spencer",
        "Leah",
        "Tara",
      ]

      if (validVoices.includes(voiceId)) {
        selectedVoiceId = voiceId
        agentGender =
          voiceId === "Kylie" ||
          voiceId === "Lily" ||
          voiceId === "Hana" ||
          voiceId === "Savannah" ||
          voiceId === "Neha"
            ? "female"
            : "male"
      } else {
        try {
          const voice = await Voice.findOne({ _id: voiceId })
          if (voice) {
            selectedVoiceId = voice.voiceId || "Rohan"
            agentGender = voice.gender as "male" | "female"
            selectedVoiceId = selectedVoiceId.charAt(0).toUpperCase() + selectedVoiceId.slice(1)
          } else {
            selectedVoiceId = business.voiceId || "Rohan"
          }
        } catch (error) {
          selectedVoiceId = business.voiceId || "Rohan"
        }
      }
    } else if (!selectedVoiceId) {
      const maleVoice = await Voice.findOne({ gender: "male" })
      if (maleVoice?.voiceId) {
        selectedVoiceId = maleVoice.voiceId
        agentGender = "male"
        console.log("[v0] Defaulting to male voice:", selectedVoiceId)
      } else {
        selectedVoiceId = "Rohan"
      }
    }

    let vapiAssistant: any

    if (business.vapiAssistantId) {
      vapiAssistant = await vapiService.updateAssistant(
        business.vapiAssistantId,
        agentName,
        selectedVoiceId,
        `You are a helpful AI assistant for ${business.name}. You will handle customer calls professionally and courteously.`,
      )

      await vapiService.attachAssistantToPhoneNumber(phoneNumberId, business.vapiAssistantId)
    } else {
      vapiAssistant = await vapiService.createAssistant(
        agentName,
        selectedVoiceId,
        `You are a helpful AI assistant for ${business.name}. You will handle customer calls professionally and courteously.`,
      )

      await vapiService.attachAssistantToPhoneNumber(phoneNumberId, vapiAssistant.id)

      const agent = new Agent({
        businessId: business._id.toString(),
        agentName,
        voiceId: selectedVoiceId,
        phoneNumberId,
        vapiAssistantId: vapiAssistant.id,
        vapiPhoneNumber: vapiPhoneNumber,
        systemPrompt: `You are a helpful AI assistant for ${business.name}. You will handle customer calls professionally and courteously.`,
        categoryId,
      })

      await agent.save()
    }

    business.vapiAssistantId = vapiAssistant.id
    await business.save()

    await redisService.set(redisService.businessKey(business._id.toString()), business, 3600)
    await redisService.del(redisService.userBusinessesKey(userId))

    const notification = await createNotification(
      userId,
      "success",
      "Phone Number Assigned!",
      `Your business is now live on ${vapiPhoneNumber}. Your AI agent is ready to handle calls.`,
      "/dashboard/business",
    )

    console.log("[v0] VAPI workflow completed successfully:", {
      businessId: business._id,
      vapiAssistantId: vapiAssistant.id,
      vapiPhoneNumber,
      phoneNumberId,
      agentName,
    })

    res.json({
      success: true,
      business,
      phoneNumberId,
      message: `Phone number ${vapiPhoneNumber} assigned and AI agent activated successfully. Ready to receive calls!`,
    })
  } catch (error) {
    next(error)
  }
})

router.get("/:id", authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId
    if (!userId) {
      throw new AppError(401, "User not authenticated")
    }

    const cached = await redisService.get(redisService.businessKey(req.params.id))
    if (cached) {
      const userBusiness = await UserBusiness.findOne({
        userId,
        businessId: req.params.id,
      })
      if (!userBusiness) {
        throw new AppError(403, "You don't have access to this business")
      }
      const agent = await Agent.findOne({ businessId: req.params.id })
      return res.json({
        success: true,
        business: cached,
        agent: agent || null,
      })
    }

    const userBusiness = await UserBusiness.findOne({
      userId,
      businessId: req.params.id,
    })

    if (!userBusiness) {
      throw new AppError(403, "You don't have access to this business")
    }

    const business = await Business.findById(req.params.id)

    if (!business) {
      throw new AppError(404, "Business not found")
    }

    const agent = await Agent.findOne({ businessId: business._id.toString() })

    await redisService.set(redisService.businessKey(business._id.toString()), business, 3600)

    res.json({
      success: true,
      business,
      agent: agent || null,
    })
  } catch (error) {
    next(error)
  }
})

router.get("/", authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId
    if (!userId) {
      throw new AppError(401, "User not authenticated")
    }

    const userBusiness = await UserBusiness.findOne({ userId, role: "owner" }).sort({ joinedAt: 1 })

    if (!userBusiness) {
      throw new AppError(404, "No business found for this user")
    }

    const cached = await redisService.get(redisService.businessKey(userBusiness.businessId))
    if (cached) {
      const agent = await Agent.findOne({ businessId: userBusiness.businessId })
      return res.json({
        success: true,
        business: cached,
        agent: agent || null,
      })
    }

    const business = await Business.findById(userBusiness.businessId)

    if (!business) {
      throw new AppError(404, "Business not found")
    }

    const agent = await Agent.findOne({ businessId: business._id.toString() })

    await redisService.set(redisService.businessKey(business._id.toString()), business, 3600)

    res.json({
      success: true,
      business,
      agent: agent || null,
    })
  } catch (error) {
    next(error)
  }
})

export default router
