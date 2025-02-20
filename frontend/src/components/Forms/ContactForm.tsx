"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/UI/input";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Label } from "@/components/UI/label";
// import { Textarea } from "@/components/UI/textarea";
import { cn } from "@/lib/utils";
import { SyncLoader } from "react-spinners";
import { Textarea } from "../UI/textarea";
import { ContactFormValues, contactSchema } from "@/types/contactTypes";
import { usePostContact } from "@/hooks/useContact";
import { toast } from "@/hooks/use-toast";

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });
  const contactMutation = usePostContact();
  const [loading, setLoading] = useState(false);

  const onSubmit = (data: ContactFormValues) => {
    setLoading(true);

    setTimeout(() => {
      contactMutation.mutate(data, {
        onSuccess: () => {
          toast({
            title: "Success",
            description:
              "✅ Contact form submitted successfully! we will get back to you soon.",
            variant: "success",
          });
          console.log("Contact form submitted successfully");
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "❌ Error submitting contact form! Try again later.",
            variant: "destructive",
          });
          console.log("Error submitting contact form: ", error);
        },
      });
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
