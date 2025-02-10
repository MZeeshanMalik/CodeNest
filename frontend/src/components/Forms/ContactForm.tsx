"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/UI/input";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Label } from "@/components/UI/label";
// import { Textarea } from "@/components/UI/textarea";
import { cn } from "@/lib/utils";
import { SyncLoader } from "react-spinners";
import { Textarea } from "../UI/textarea";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = (data: ContactFormValues) => {
    setLoading(true);
    setTimeout(() => {
      console.log("Contact form submitted with: ", data);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            Contact Us
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
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                {...register("message")}
                className={cn(errors.message && "border-red-500")}
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-btnColor hover:bg-btnHoverCol"
            >
              {loading ? <SyncLoader color="#f1f3f2" /> : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
