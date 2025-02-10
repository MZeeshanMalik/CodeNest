"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/UI/input";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Label } from "@/components/UI/label";
import { cn } from "@/lib/utils";
// import { Loader2 } from "lucide-react";
import { SyncLoader } from "react-spinners";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = (data: LoginFormValues) => {
    setLoading(true);
    setTimeout(() => {
      console.log("Logged in with: ", data);
      setLoading(false);
    }, 2000);
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
              // disabled={loading}
            >
              {loading ? <SyncLoader color="#f1f3f2" /> : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
