"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/UI/input";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Label } from "@/components/UI/label";
import { cn } from "@/lib/utils";
import { SyncLoader } from "react-spinners";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuthResetPass } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

// Define the schema for email validation
const passwordSchema = z
  .object({
    password: z.string().min(6, "Password should be at least 6 characters"), // Customize this as per your requirements
    confirmPassword: z
      .string()
      .min(6, "Password should be at least 6 characters"), // Match the minimum length
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // This will set the error on the confirmPassword field
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function EmailForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  //   const forgoPassMutation = useAuthFogotPass();
  const resetPassMutation = useAuthResetPass();
  const [token, setToken] = useState("");

  const onSubmit = async (data: PasswordFormValues) => {
    setIsSubmitting(true);
    resetPassMutation.mutate(
      { data, token },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "✅ Password reset successfully!",
            variant: "success",
          });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          toast({
            title: "Error",
            description:
              error.response?.data?.message || "Error resetting password!",
            variant: "destructive",
          });
        },
      }
    );
    setIsSubmitting(false);
  };
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    setToken(queryParams.get("resetToken") || "");
  }, []);
  return (
    <div className="flex items-center justify-center bg-gray-200 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            Reset Your Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                className={cn(errors.password && "border-red-500")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Enter your password again"
                {...register("confirmPassword")}
                className={cn(errors.confirmPassword && "border-red-500")}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-btnColor hover:bg-btnHoverCol"
              disabled={isSubmitting}
            >
              {isSubmitting ? <SyncLoader color="#f1f3f2" /> : "Reset Password"}
            </Button>
          </form>
          <div>
            <p className="mt-4 text-center">
              Need help?{" "}
              <a href="/support" className="text-btnColor hover:underline">
                Contact support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
