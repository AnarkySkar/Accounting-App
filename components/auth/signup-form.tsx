"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SubmitButton } from "../submit-button";
import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "../form-message";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import ValidateInput from "../shared/ValidateInput";
import { useSignUp } from "@/queries/misc";

interface FormValues {
  name: string;
  email: string;
  address: string;
  password: string;
}

interface SignUpFormProps extends React.ComponentPropsWithoutRef<"div"> {
  searchParams: Message;
}

export function SignupForm({
  className,
  searchParams,
  ...props
}: SignUpFormProps) {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      address: "",
      password: "",
    },
  });

  const { isPending, mutate } = useSignUp();

  const onSubmit = async (data: FormValues) => {
    mutate(data);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Hello there</CardTitle>
          <CardDescription>Create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <ValidateInput
                    control={control}
                    name="name"
                    placeholder="Your Company Name"
                    className="w-full"
                    required
                    rules={{
                      required: "Company Name is required",
                      minLength: {
                        value: 3,
                        message: "Company Name must have at least 3 characters",
                      },
                    }}
                    label="Company Name"
                    type="text"
                  />
                </div>
                <div className="grid gap-2">
                  <ValidateInput
                    control={control}
                    name="email"
                    placeholder="m@example.com"
                    className="w-full"
                    required
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: "Invalid email address",
                      },
                    }}
                    label="Email"
                    type="email"
                  />
                </div>
                <div className="grid gap-2">
                  <ValidateInput
                    control={control}
                    name="address"
                    placeholder="Your Address"
                    className="w-full"
                    required
                    rules={{
                      required: "Company Address is required",
                    }}
                    label="Company Address"
                    type="text"
                  />
                </div>
                <div className="grid gap-2">
                  <ValidateInput
                    control={control}
                    name="password"
                    placeholder=""
                    className="w-full"
                    required
                    rules={{
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must have at least 8 characters",
                      },
                    }}
                    label="Password"
                    type="password"
                  />
                </div>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Signing up..." : "Sign up"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/sign-in" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
