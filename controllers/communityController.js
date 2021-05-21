const Community = require("../models/communityModel");
const catchAsync = require("../utils/catchAsync");

exports.selectPlan = catchAsync(async (req, res, next) => {
  console.log("We are able to reach this middleware function, Over and Out.");
  const selectedPlan = req.body.plan;
  const planRenewDuration = req.body.planRenewDuration;
  const userId = req.user.id;
  const communityId = req.community.id;
  const communitySelectingPlan = await Community.findById(communityId);
  const planDetails = communitySelectingPlan.planDetails;
  const eventManagement = planDetails.features.eventManagement;
  const eventExperience = planDetails.features.eventExperience;
  const customization = planDetails.features.customization;
  const analytics = planDetails.features.analytics;
  const integrations = planDetails.features.integrations;
  const services = planDetails.features.services;
  const moreDetails = planDetails.features.moreDetails;

  console.log("planRenewDuration:", planRenewDuration);
  console.log("selectedPlan:", selectedPlan);
  console.log("userId:", userId);
  console.log("communityId:", communityId);


  switch (selectedPlan) {
    // If selectedPlan = 'free'
    case "free":
      // Setting values for plan name renew period and currentPlanExpiryDate
      planDetails.planName = "free";
      planDetails.planRenewDuration = planRenewDuration;
      planDetails.currentPlanExpiresOn =
        Date.now() + planRenewDuration * 31 * 24 * 60 * 60 * 1000;

      // Setting values for eventManagement based on plan selected
      eventManagement.ticketing = true; //TODO we have to exclude types
      eventManagement.registrationPage = false; //it means that it is not visible to public
      eventManagement.queries = true; //10 per event
      eventManagement.reviews = true; //no limit
      eventManagement.email = true;
      eventManagement.coupon = false;

      // Setting values for eventExperience based on plan selected
      eventExperience.reception = false;
      eventExperience.messaging = true;
      eventExperience.connection = false;
      eventExperience.networking = false;
      eventExperience.multiSession = true; //limited to 1
      eventExperience.moderation = false;
      eventExperience.customNetworking = false;
      eventExperience.multiTrack = false;
      eventExperience.liveStreaming = false;
      eventExperience.RTMP = false;
      eventExperience.twitterAndInstaWall = false;
      eventExperience.photoBooth = true;
      eventExperience.leaderShipBoard = false;
      eventExperience.sponsorShoutout = false;

      // Setting values for customization based on plan selected
      customization.email = false;
      customization.registrationForm = false;
      customization.stageBranding = false;

      // Setting values for analytics based on plan selected
      analytics.basic = true;
      analytics.advanced = false;
      analytics.realTimeAnalytics = false;

      // Setting values for integrations based on plan selected
      integrations.zapier = false;
      integrations.miro = false;
      integrations.limnu = false;
      integrations.mailChimp = false;
      integrations.socialMedia = false;
      integrations.CRM = false;

      // Setting values for services based on plan selected
      services.emailAndChatSupport = false;
      services.uptimeSLA = false;
      services.onboardingAndTraining = false;

      // Setting values for moreDetails based on plan selected
      moreDetails.eventLength = 3;
      moreDetails.registrationsPerMonth = 15;
      moreDetails.maxTeamMembers = 3;

      moreDetails.speakersPerEvent = 2;
      communitySelectingPlan.save({ validateModifiedOnly: true });

      break;

    // If selectedPlan = 'starter'
    case "starter":
      // Setting values for plan name renew period and currentPlanExpiryDate
      planDetails.planName = "Starter";
      planDetails.planRenewDuration = planRenewDuration;
      planDetails.currentPlanExpiresOn =
        Date.now() + planRenewDuration * 31 * 24 * 60 * 60 * 1000;

      // Setting values for eventManagement based on plan selected
      eventManagement.ticketing = true;
      eventManagement.registrationPage = true;
      eventManagement.queries = true;
      eventManagement.reviews = true;
      eventManagement.email = true;
      eventManagement.coupon = false;

      // Setting values for eventExperience based on plan selected
      eventExperience.reception = true;
      eventExperience.messaging = true;
      eventExperience.connection = true;
      eventExperience.networking = true;
      eventExperience.multiSession = true;
      eventExperience.moderation = true;
      eventExperience.customNetworking = false;
      eventExperience.multiTrack = false;
      eventExperience.liveStreaming = true;
      eventExperience.RTMP = true;
      eventExperience.twitterAndInstaWall = true;
      eventExperience.photoBooth = true;
      eventExperience.leaderShipBoard = true;
      eventExperience.sponsorShoutout = false;

      // Setting values for customization based on plan selected
      customization.email = true;
      customization.registrationForm = true;
      customization.stageBranding = true;

      // Setting values for analytics based on plan selected
      analytics.basic = true;
      analytics.advanced = true;
      analytics.realTimeAnalytics = false;

      // Setting values for integrations based on plan selected
      integrations.zapier = true;
      integrations.miro = true;
      integrations.limnu = true;
      integrations.mailChimp = true;
      integrations.socialMedia = true;
      integrations.CRM = true;

      // Setting values for services based on plan selected
      services.emailAndChatSupport = false;
      services.uptimeSLA = true;
      services.onboardingAndTraining = true;

      // Setting values for moreDetails based on plan selected
      moreDetails.eventLength = 100;
      moreDetails.registrationsPerMonth = 6000;
      moreDetails.maxTeamMembers = 10;
      moreDetails.ticketingCommission = 3;
      moreDetails.pricePerAdditionalRegistration = 0.25;
      moreDetails.speakersPerEvent = 1000;
      communitySelectingPlan.save({ validateModifiedOnly: true });

      break;

    // If selectedPlan = 'growth'
    case "growth":
      // Setting values for plan name renew period and currentPlanExpiryDate
      planDetails.planName = "growth";
      planDetails.planRenewDuration = planRenewDuration;
      planDetails.currentPlanExpiresOn =
        Date.now() + planRenewDuration * 31 * 24 * 60 * 60 * 1000;

      // Setting values for eventManagement based on plan selected
      eventManagement.ticketing = true;
      eventManagement.registrationPage = true;
      eventManagement.queries = true;
      eventManagement.reviews = true;
      eventManagement.email = true;
      eventManagement.coupon = false;

      // Setting values for eventExperience based on plan selected
      eventExperience.reception = true;
      eventExperience.messaging = true;
      eventExperience.connection = true;
      eventExperience.networking = true;
      eventExperience.multiSession = true;
      eventExperience.moderation = true; //but in limited amount
      eventExperience.customNetworking = true;
      eventExperience.multiTrack = true;
      eventExperience.liveStreaming = true; // limited to youtube,facebook,zoom
      eventExperience.RTMP = false;
      eventExperience.twitterAndInstaWall = true;
      eventExperience.photoBooth = true;
      eventExperience.leaderShipBoard = true;
      eventExperience.sponsorShoutout = true;

      // Setting values for customization based on plan selected
      customization.email = true;
      customization.registrationForm = true;
      customization.stageBranding = true;

      // Setting values for analytics based on plan selected
      analytics.basic = true;
      analytics.advanced = true;
      analytics.realTimeAnalytics = false;

      // Setting values for integrations based on plan selected
      integrations.zapier = true;
      integrations.miro = true;
      integrations.limnu = true;
      integrations.mailChimp = true;
      integrations.socialMedia = false;
      integrations.CRM = false;

      // Setting values for services based on plan selected
      services.emailAndChatSupport = true;
      services.uptimeSLA = true;
      services.onboardingAndTraining = false;

      // Setting values for moreDetails based on plan selected
      moreDetails.eventLength = 144;
      moreDetails.registrationsPerMonth = 12000;
      moreDetails.maxTeamMembers = 15;
      moreDetails.ticketingCommission = 3;
      moreDetails.pricePerAdditionalRegistration = 0.5;
      moreDetails.speakersPerEvent = 1000;
      communitySelectingPlan.save({ validateModifiedOnly: true });

      break;
  }

  res.status(200).json({
    status: "success",
    data: { planDetails: communitySelectingPlan.planDetails },
  });
});

exports.customPlanGeneration = catchAsync(async (req, res, next) => {
  const salesPerson = req.salesPerson;
  console.log('This is sales Person from last middleware:', salesPerson);
  res.status(200).json({
    status: 'success',
    message: 'This route is being implemented',
    // data: {
    // }
  });
});



// TODO
// Create a POST endpoint for generating a custom plan (include community name, plan details, planRenewDuration & priceToBeCharged)