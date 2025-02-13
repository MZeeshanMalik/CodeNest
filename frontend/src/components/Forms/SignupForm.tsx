"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/UI/input";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Label } from "@/components/UI/label";
import { cn } from "@/lib/utils";
import { SyncLoader } from "react-spinners";
import { signupSchema } from "@/types/signupSchema";
import { useAuthSignup } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import SocialLoginButton from "../UI/SocialLoginButton";

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });
  const signupMutation = useAuthSignup();

  const onSubmit = (data: SignupFormValues) => {
    signupMutation.mutate(data, {
      onSuccess: (data) => {
        localStorage.setItem("user", JSON.stringify(data?.data));

        toast({
          title: "Success",
          description: "✅ Signup successful! Welcome to Code Nest",
          variant: "success",
        });
        window.location.href = "/";
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) =>
        toast({
          title: "Error",
          description: error.response?.data?.message || "Signup failed!",
          variant: "destructive",
        }),
    });
  };
  const handleAuthWithGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_APP_API_URL}/api/v1/users/auth/google`;
  };
  const handleAuthWithGithub = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_APP_API_URL}/api/v1/users/auth/github`;
  };

  return (
    <div className="flex items-center justify-center bg-gray-200 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                {...register("name")}
                className={cn(errors.name && "border-red-500")}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter you email"
                {...register("email")}
                className={cn(errors.email && "border-red-500")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

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
                placeholder="Confirm your password"
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
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? (
                <SyncLoader color="#f1f3f2" />
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
          <div>
            <p className="mt-4 text-center">
              Already have an account?{" "}
              <a href="/login" className="text-btnColor hover:underline">
                Login
              </a>
            </p>
          </div>
          <div className="mt-4 space-y-2">
            <SocialLoginButton
              provider="google"
              onClick={handleAuthWithGoogle}
            />
            <SocialLoginButton
              provider="github"
              onClick={handleAuthWithGithub}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
