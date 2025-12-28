/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

const appointmentSchema = z.object({
  url: z.string().url("Please enter a valid webhook URL"),
  scenarioId: z.string().min(1, "Scenario ID is required"),
})

type AppointmentSchemaType = z.infer<typeof appointmentSchema>

interface CreateAvailabilityFormProps {
  setStage: (stage: number) => void
}

export function CreateAvailabilityForm({ setStage }: Readonly<CreateAvailabilityFormProps>) {
  const form = useForm<AppointmentSchemaType>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      url: "",
      scenarioId: "",
    },
  })

  const onSubmit = async (data: AppointmentSchemaType) => {
    try {
      console.log("[v0] Saving availability config:", data)
      toast.success("Availability configurations saved successfully")
      setStage(2)
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong")
    }
  }

  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="scenarioId"
            render={({ field }: any) => (
              <FormItem>
                <p className="mb-2 text-left font-medium text-gray-700">Scenario Id</p>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter scenario id"
                    {...field}
                    className="h-12 border-gray-300 focus:ring-[#653716] focus:border-[#653716]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }: any) => (
              <FormItem>
                <p className="mb-2 text-left font-medium text-gray-700">Webhook URL</p>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="Paste webhook URL"
                    {...field}
                    className="h-12 border-gray-300 focus:ring-[#653716] focus:border-[#653716]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row items-center justify-between gap-4 mt-8">
            <Button
              onClick={() => window.history.back()}
              type="button"
              variant="outline"
              className="w-full h-12 border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Close
            </Button>
            <Button className="w-full h-12 bg-[#653716] hover:bg-[#4d2911] text-white">Next Step</Button>
          </div>
        </form>
      </Form>
    </section>
  )
}
