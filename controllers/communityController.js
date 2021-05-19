const Community = require('../models/communityModel');
const catchAsync = require('../utils/catchAsync');

exports.selectPlan = catchAsync(async (req, res, next) => {
  console.log('We are able to reach this middleware function, Over and Out.');
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

  console.log('planRenewDuration:', planRenewDuration);
  console.log('selectedPlan:', selectedPlan);
  console.log('userId:', userId);
  console.log('communityId:', communityId);

  // If selectedPlan = 'starter'
  switch (selectedPlan) {
    case 'starter':
      // Setting values for plan name renew period and currentPlanExpiryDate
      planDetails.planName = 'Starter';
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
      eventManagement.teamManagement = false;

      // Setting values for eventExperience based on plan selected
      eventExperience.reception = true;
      eventExperience.messaging = true;
      eventExperience.connection = true;
      eventExperience.networking = true;
      eventExperience.multiSession = true;
      eventExperience.moderation = true;
      eventExperience.multiTrack = false;
      eventExperience.liveStreaming = true;
      eventExperience.RTMP = true;
      eventExperience.twitterAndInstaWall = true;
      eventExperience.photoBooth = true;
      eventExperience.leaderShipBoard = true;

      // Setting values for customization based on plan selected
      customization.email = true;
      customization.registrationForm = true;
      customization.stageBranding = true;

      // Setting values for analytics based on plan selected
      analytics.basic = true;
      analytics.advanced = true;
      analytics.realTimeAnalytics = true;

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
      services.SSO = false;

      // Setting values for moreDetails based on plan selected
      moreDetails.eventLength = 144;
      moreDetails.registrationsPerMonth = 1200;
      moreDetails.maxTeamMembers = 10;
      moreDetails.ticketingCharge = 3;
      moreDetails.pricePerAdditionalRegistration = 0.5;

      communitySelectingPlan.save({ validateModifiedOnly: true });

      break;
  }

  res.status(200).json({
    status: 'success',
    data: { planDetails: communitySelectingPlan.planDetails },
  });
});

exports.customPlanGeneration = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'This route is being implemented',
    // data: {
    // }
  });
});



// TODO
// Create a POST endpoint for generating a custom plan (include community name, plan details, planRenewDuration & priceToBeCharged)