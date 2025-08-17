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
  honey: z.string().optional(), // Honeypot field
}).refine((data) => !data.honey, {
  message: "Spam detected!",
  path: ["honey"],
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
            <label className="block font-bold mb-1">First Name</label>
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
            <label className="block font-bold mb-1">Last Name</label>
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
          <label className="block font-bold mb-1">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full border p-2 rounded"
            placeholder="jamessmith@example.com"
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="absolute left-[-9999px]">
          <label htmlFor="honey">Don't fill this out</label>
          <input id="honey" type="text" {...register("honey")} />
        </div>

        <button
          type="button"
          className="flex items-center gap-2 text-imperio-gold hover:underline font-bold transition-transform duration-200 hover:scale-105"
          onClick={() => setShowOptional(!showOptional)}
        >
          {showOptional ? (
            "Hide additional fields"
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add more information
            </>
          )}
        </button>

        <div
          className={`
            grid transition-[max-height,opacity] duration-750 ease-in-out overflow-hidden
            ${showOptional ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="space-y-4">
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
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-imperio-blue text-imperio-gold px-4 py-2 rounded hover:bg-imperio-gold hover:text-imperio-blue"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
