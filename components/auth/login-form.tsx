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
import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "../form-message";
import { useForm } from "react-hook-form";
import ValidateInput from "../shared/ValidateInput";
import { useFormStatus } from "react-dom";
import { createClient } from "@/utils/supabase/client";
import { useSignIn } from "@/queries/misc";

interface FormValues {
  email: string;
  password: string;
}

interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {
  searchParams: Message;
}

export function LoginForm({
  className,
  searchParams,
  ...props
}: LoginFormProps) {
  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isPending, mutate } = useSignIn();

  const onSubmit = async (data: FormValues) => {
    mutate(data);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your email or password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              {/* <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div> */}
              <div className="grid gap-6">
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
                  {/* <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  /> */}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    {/* <Label htmlFor="password"></Label> */}
                    <Link
                      href="/forgot-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <ValidateInput
                    control={control}
                    name="password"
                    placeholder=""
                    className="w-full"
                    required
                    rules={{
                      required: "Password is required",
                    }}
                    label="Password"
                    type="password"
                  />
                </div>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Signing in..." : "Sign in"}
                </Button>
                {/* <FormMessage message={searchParams} /> */}
                {/* <Button type="submit" className="w-full">
                  Login
                </Button> */}
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="underline underline-offset-4">
                  Sign up
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
