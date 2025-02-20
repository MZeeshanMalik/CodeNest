"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/UI/input";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Label } from "@/components/UI/label";
import { cn } from "@/lib/utils";
import { SyncLoader } from "react-spinners";
import { LoginFormValues, loginSchema } from "@/types/loginTypes";
import { useAuthLogin } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import SocialLoginButton from "../UI/SocialLoginButton";

export default function LoginForm() {
  const { toast } = useToast();
  const loginMutation = useAuthLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        localStorage.setItem("user", JSON.stringify(data?.data));
        toast({
          title: "Success",
          description: "✅ Login successful! Welcome to Code Nest",
          variant: "success",
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        console.log(error);
        toast({
          title: "Internal server error.",
          description:
            error.response?.data?.message ||
            "Login failed! Try again later.Sorry for inconvience.",
          variant: "destructive",
        });
      },
    });
  };

  const handleAuthWithGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_APP_API_URL}/api/v1/users/auth/google`;
  };
  const handleAuthWithGithub = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_APP_API_URL}/api/v1/users/auth/github`;
  };

  return (
    <div className="flex items-center justify-center  bg-gray-200 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <Button
              type="submit"
              className="w-full bg-btnColor hover:bg-btnHoverCol"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <SyncLoader color="#f1f3f2" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
          <div>
            <p className="mt-4 text-center">
              Forgot your password?{" "}
              <a
                href="/forgot-password"
                className="text-btnColor hover:underline"
              >
                Reset password
              </a>{" "}
              <span>or</span>{" "}
              <a href="/signup" className="text-btnColor hover:underline">
                Sign up
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
