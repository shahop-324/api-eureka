import React from "react";

import Eventbrite from "../Integrations/Eventbrite";
import Mailchimp from "../Integrations/Mailchimp";
import Intercom from "../Integrations/Intercomm";
import Hubspot from "../Integrations/Hubspot";
import Salesforce from "../Integrations/Salesforce";
import Slack from "../Integrations/Slack";
import Twitter from "../Integrations/Twitter";
import Marketo from "../Integrations/Marketo";
import Miro from "../Integrations/Miro";
import Figma from "../Integrations/Figma";
import Typeform from "../Integrations/Typeform";
import GoogleSheets from "../Integrations/GoogleSheets";
import GooglCalender from "../Integrations/GoogleCalender";
import GoogleSlides from "../Integrations/GooglSlides";
import Linkedin from "../Integrations/LinkedIn";
import Drip from "../Integrations/Drip";
import ActiveCampaign from "../Integrations/ActiveCampaign";
import Salesmate from "../Integrations/Salesmate";
import Mailjet from "../Integrations/Mailjet";
import SendinBlue from "../Integrations/SendinBlue";

const IntegrationsSub = () => {
  return (
    <>
      <div className="px-4 py-4">
        <Eventbrite />
        <Mailchimp />
        <Intercom />
        <Hubspot />
        <Slack />
        <Twitter />
        <Marketo />
        <Miro />
        <Figma />
        <Typeform />
        <GoogleSheets />
        <GooglCalender />
        <GoogleSlides />
        <Linkedin />
        <Drip />
        <ActiveCampaign />
        <Salesmate />
        <Mailjet />
        <SendinBlue />
        <Salesforce />
      </div>
    </>
  );
};

export default IntegrationsSub;
