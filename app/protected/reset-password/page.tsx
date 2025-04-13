import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { GalleryVerticalEnd } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function ResetPassword(props: {
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
                Please enter your new password below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
                <Label htmlFor="password">New password</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="New password"
                  required
                />
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  required
                />
                <SubmitButton formAction={resetPasswordAction}>
                  Reset password
                </SubmitButton>
                <FormMessage message={searchParams} />
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
