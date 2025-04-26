import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GalleryVerticalEnd } from "lucide-react";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Transfer Book.
        </a>
        <div className={cn("flex flex-col gap-6")} {...props}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Reset Password</CardTitle>
              <CardDescription>
                Already have an account?{" "}
                <Link className="text-primary underline" href="/sign-in">
                  Sign in
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6 min-w-64  mx-auto">
                <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8 [&>button]:mb-4">
                  <Label htmlFor="email">Email</Label>
                  <Input name="email" placeholder="you@example.com" required />
                  <SubmitButton formAction={forgotPasswordAction}>
                    Reset Password
                  </SubmitButton>
                  <FormMessage message={searchParams} />
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        <SmtpMessage />
      </div>
    </div>
  );
}
