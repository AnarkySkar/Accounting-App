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
          {t("faq.title")}
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          {t("faq.description")}
        </p>
      </div>

      <Tabs defaultValue="assistance" className="max-w-3xl mx-auto">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
          <TabsTrigger value="assistance">
            {t("faq.tabs.assistance")}
          </TabsTrigger>
          <TabsTrigger value="training">{t("faq.tabs.training")}</TabsTrigger>
          <TabsTrigger value="experience">
            {t("faq.tabs.experience")}
          </TabsTrigger>
          <TabsTrigger value="technical">{t("faq.tabs.technical")}</TabsTrigger>
        </TabsList>

        <TabsContent value="assistance">
          <Card>
            <CardHeader>
              <CardTitle>{t("faq.assistance.title")}</CardTitle>
              <CardDescription>
                {t("faq.assistance.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <p>{t("faq.assistance.content.paragraph1")}</p>
                <p>
                  {t("faq.assistance.content.paragraph2")}{" "}
                  <a
                    href={t("faq.assistance.content.link1")}
                    className="text-primary hover:underline"
                  >
                    {t("faq.assistance.content.link1")}
                  </a>
                </p>
                <p>
                  {t("faq.assistance.content.paragraph3")}{" "}
                  <a
                    href={t("faq.assistance.content.link2")}
                    className="text-primary hover:underline"
                  >
                    {t("faq.assistance.content.link2")}
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle>{t("faq.training.title")}</CardTitle>
              <CardDescription>{t("faq.training.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  {t("faq.training.content.paragraph1")}{" "}
                  <a
                    href={t("faq.training.content.link1")}
                    className="text-primary hover:underline"
                  >
                    {t("faq.training.content.link1")}
                  </a>
                </p>
                <p>{t("faq.training.content.paragraph2")}</p>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="training-1">
                    <AccordionTrigger className="font-medium">
                      {t("faq.training.content.accordion.item1.title")}
                    </AccordionTrigger>
                    <AccordionContent>
                      {t("faq.training.content.accordion.item1.content")}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="training-2">
                    <AccordionTrigger className="font-medium">
                      {t("faq.training.content.accordion.item2.title")}
                    </AccordionTrigger>
                    <AccordionContent>
                      {t("faq.training.content.accordion.item2.content")}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="training-3">
                    <AccordionTrigger className="font-medium">
                      {t("faq.training.content.accordion.item3.title")}
                    </AccordionTrigger>
                    <AccordionContent>
                      {t("faq.training.content.accordion.item3.content")}
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
              <CardTitle>{t("faq.experience.title")}</CardTitle>
              <CardDescription>
                {t("faq.experience.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>{t("faq.experience.content.paragraph1")}</p>
                <p>{t("faq.experience.content.paragraph2")}</p>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="experience-1">
                    <AccordionTrigger>
                      {t("faq.experience.content.accordion.item1.title")}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">
                        {t("faq.experience.content.accordion.item1.content1")}
                      </p>
                      <p>
                        {t("faq.experience.content.accordion.item1.content2")}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="font-medium">
                    {t("faq.experience.content.contact_info.title")}
                  </p>
                  <p className="mt-2">
                    {t("faq.experience.content.contact_info.text")}{" "}
                    <a
                      href={`tel:${t("faq.experience.content.contact_info.phone")}`}
                      className="text-primary hover:underline"
                    >
                      {t("faq.experience.content.contact_info.phone")}
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
              <CardTitle>{t("faq.technical.title")}</CardTitle>
              <CardDescription>
                {t("faq.technical.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="tech-1">
                  <AccordionTrigger>
                    {t("faq.technical.accordion.item1.title")}
                  </AccordionTrigger>
                  <AccordionContent>
                    {t("faq.technical.accordion.item1.content")}{" "}
                    <a
                      href={`tel:${t("faq.experience.content.contact_info.phone")}`}
                      className="text-primary hover:underline"
                    >
                      {t("faq.experience.content.contact_info.phone")}
                    </a>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="tech-2">
                  <AccordionTrigger>
                    {t("faq.technical.accordion.item2.title")}
                  </AccordionTrigger>
                  <AccordionContent>
                    {t("faq.technical.accordion.item2.content")}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="tech-3">
                  <AccordionTrigger>
                    {t("faq.technical.accordion.item3.title")}
                  </AccordionTrigger>
                  <AccordionContent>
                    {t("faq.technical.accordion.item3.content")}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-12 text-center">
        <h2 className="text-xl font-semibold mb-4">
          {t("faq.additional_help.title")}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t("faq.additional_help.description")}
        </p>
        <a
          href="https://t.me/+INexjvzJ_Yw3ZGI0"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 mr-2"
        >
          {t("faq.additional_help.telegram_button")}
        </a>
        <a
          href="tel:+393497013557"
          className="inline-flex items-center justify-center rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20"
        >
          {t("faq.additional_help.whatsapp_button")}
        </a>
      </div>
    </div>
  );
}
