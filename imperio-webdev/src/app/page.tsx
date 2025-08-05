// src/app/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const FormSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email"),
  goals: z.string().optional(),
  timeline: z.string().optional(),
  location: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export default function Page() {
  const [showOptional, setShowOptional] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-center">
        <div className="bg-green-100 text-green-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Thanks for submitting!</h2>
          <p className="text-sm mt-2">We'll be in touch shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white text-gray-800">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg p-6 border rounded-2xl shadow space-y-4"
      >
        <div className="flex items-center justify-center gap-4">
          <div className="w-1/2">
            <label className="block font-medium mb-1">First Name</label>
            <input
              {...register("firstName")}
              className="w-full border p-2 rounded"
              placeholder="James"
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div className="w-1/2">
            <label className="block font-medium mb-1">Last Name</label>
            <input
              {...register("lastName")}
              className="w-full border p-2 rounded"
              placeholder="Smith"
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full border p-2 rounded"
            placeholder="jane@example.com"
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <button
          type="button"
          className="text-sm text-blue-600 hover:underline mx-4"
          onClick={() => setShowOptional(!showOptional)}
        >
          {showOptional ? "Hide additional fields" : "Add more information"}
        </button>

        {showOptional && (
          <>
            <div>
              <label className="block font-medium mb-1">Financial Goals</label>
              <textarea
                {...register("goals")}
                className="w-full border p-2 rounded"
                rows={3}
                placeholder="Tell us what you want to achieve"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Investment Timeline</label>
              <input
                {...register("timeline")}
                className="w-full border p-2 rounded"
                placeholder="e.g., 5-10 years"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Location</label>
              <input
                {...register("location")}
                className="w-full border p-2 rounded"
                placeholder="City, State"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
