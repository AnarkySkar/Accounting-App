"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";

export default function FAQPage() {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Find answers to common questions about Transfer Manager Consulting
          services
        </p>
      </div>

      <Tabs defaultValue="assistance" className="max-w-3xl mx-auto">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
          <TabsTrigger value="assistance">Assistance</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
        </TabsList>

        <TabsContent value="assistance">
          <Card>
            <CardHeader>
              <CardTitle>Assistance and Support</CardTitle>
              <CardDescription>
                Learn about the support options available to Transfer Manager
                Consulting clients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <p>
                  As a client of Transfer Manager Consulting, you have daily
                  chat support with Simone in your dedicated Telegram group. You
                  can ask him any questions or concerns regarding your personal
                  and business situation.
                </p>
                <p>
                  For dedicated video calls with Simone (to be arranged with him
                  in advance), you can book them at this link:{" "}
                  <a
                    href="https://funnel.transfermanagerconsulting.com/tm-affitto"
                    className="text-primary hover:underline"
                  >
                    https://funnel.transfermanagerconsulting.com/tm-affitto
                  </a>
                </p>
                <p>
                  You also have access to all updates and periodic initiatives
                  from Transfer Manager Consulting directly on the Telegram
                  channel. Access it here:{" "}
                  <a
                    href="https://t.me/+INexjvzJ_Yw3ZGI0"
                    className="text-primary hover:underline"
                  >
                    https://t.me/+INexjvzJ_Yw3ZGI0
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle>Training Materials</CardTitle>
              <CardDescription>
                Explore the comprehensive training resources available to
                clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  As a client of Transfer Manager Consulting, you can access all
                  training materials at the following link:{" "}
                  <a
                    href="https://funnel.transfermanagerconsulting.com/clientitma"
                    className="text-primary hover:underline"
                  >
                    https://funnel.transfermanagerconsulting.com/clientitma
                  </a>
                </p>
                <p>This includes hours of training, such as:</p>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="training-1">
                    <AccordionTrigger className="font-medium">
                      THE BIBLE OF MOVING ABROAD
                    </AccordionTrigger>
                    <AccordionContent>
                      An exclusive video course of over 11 hours, recorded in
                      recent months, where I have gathered and organized all the
                      essential information for your residency and business
                      abroad in a clear and sequential manner.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="training-2">
                    <AccordionTrigger className="font-medium">
                      ASSET PROTECTION SHIELD
                    </AccordionTrigger>
                    <AccordionContent>
                      An exclusive webinar from past months, where we thoroughly
                      discussed the best strategies to protect and secure your
                      wealth, regardless of your financial situation or income.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="training-3">
                    <AccordionTrigger className="font-medium">
                      EASY LLC MANAGEMENT
                    </AccordionTrigger>
                    <AccordionContent>
                      The most comprehensive workshop on managing your LLC.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <CardTitle>Transfer Experience</CardTitle>
              <CardDescription>
                Discover exclusive networking and learning opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  As a client of Transfer Manager Consulting, you have exclusive
                  access to live MasterMind events, organized in various
                  European locations and reserved only for Transfer Manager
                  Consulting clients.
                </p>
                <p>
                  These events are limited in number, designed to create
                  strategic networking opportunities among entrepreneurs, with
                  the participation of special guests.
                </p>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="experience-1">
                    <AccordionTrigger>
                      What happens at MasterMind events?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">
                        During the MasterMind events, you will not only have the
                        opportunity to exchange ideas and build strategic
                        collaborations but also interact with top professionals
                        in the industry. It's a unique chance to expand your
                        network and learn from experts and fellow entrepreneurs.
                      </p>
                      <p>
                        Additionally, you can apply for a speaking slot during
                        the event, where you can present your project and
                        business. This will give you visibility and allow you to
                        showcase your idea or business to a targeted audience of
                        entrepreneurs. (The experience includes all training
                        sessions, lunches, and dinners. Hotel and travel
                        expenses are excluded.)
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="font-medium">
                    For more information about Transfer Experience events:
                  </p>
                  <p className="mt-2">
                    Contact us via WhatsApp at:{" "}
                    <a
                      href="tel:+393497013557"
                      className="text-primary hover:underline"
                    >
                      +393497013557
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical">
          <Card>
            <CardHeader>
              <CardTitle>Technical Support and Issue Resolution</CardTitle>
              <CardDescription>
                Get help with technical issues and account management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="tech-1">
                  <AccordionTrigger>
                    How can I contact customer support if I have technical
                    issues?
                  </AccordionTrigger>
                  <AccordionContent>
                    You can reach our customer support team via WhatsApp at{" "}
                    <a
                      href="tel:+393497013557"
                      className="text-primary hover:underline"
                    >
                      +393497013557
                    </a>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="tech-2">
                  <AccordionTrigger>
                    I forgot my password. How can I reset it?
                  </AccordionTrigger>
                  <AccordionContent>
                    Click on the "Forgot Password" link on the login page. Enter
                    the email address associated with your account, and we will
                    send you a link to reset your password. Follow the
                    instructions in the email to create a new password.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="tech-3">
                  <AccordionTrigger>
                    The system is slow. What can I do?
                  </AccordionTrigger>
                  <AccordionContent>
                    If you experience slow performance, try clearing your
                    browser cache and cookies. Ensure you are using a supported
                    browser (latest versions of Chrome, Firefox, Safari, or
                    Edge). If the issue persists, contact our support team.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-12 text-center">
        <h2 className="text-xl font-semibold mb-4">Need Additional Help?</h2>
        <p className="text-muted-foreground mb-6">
          If you can't find the answer to your question, please contact our
          support team
        </p>
        <a
          href="https://t.me/+INexjvzJ_Yw3ZGI0"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 mr-2"
        >
          Join Telegram Channel
        </a>
        <a
          href="tel:+393497013557"
          className="inline-flex items-center justify-center rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20"
        >
          WhatsApp Support
        </a>
      </div>
    </div>
  );
}
