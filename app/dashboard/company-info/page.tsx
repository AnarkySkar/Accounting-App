import { OnboardingForm } from "@/components/onboarding-company/onboarding-card";
import React from "react";
import { FormMessage, Message } from "@/components/form-message";
import { OnboardingFormPage } from "@/components/onboarding-company/onboarding-page";
import Image from "next/image";
import DynamicComment from "@/components/shared/DynamicComment";
const page = async (props: { searchParams: Promise<Message> }) => {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 py-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <DynamicComment />
          </div>
        </div>
        <OnboardingFormPage searchParams={searchParams} />
      </div>
    </>
  );
};

export default page;
