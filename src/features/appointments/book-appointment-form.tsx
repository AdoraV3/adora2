/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { useAppointmentStore } from "@/store/appointment-store"
import { useAuthStore } from "@/store/auth-store"
import { Loader2 } from "lucide-react"

const appointmentSchema = z.object({
  callerName: z.string().min(2, "Name is required"),
  callerEmail: z.string().email("Invalid email address"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  timezone: z.string().min(1, "Timezone is required"),
  scenarioId: z.string().optional(),
  webhookUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
})

type AppointmentSchemaType = z.infer<typeof appointmentSchema>

interface BookAppointmentFormProps {
  setStage: (stage: number) => void
}

export function BookAppointmentForm({ setStage }: Readonly<BookAppointmentFormProps>) {
  const { createAppointment, loading } = useAppointmentStore()
  const { business } = useAuthStore()

  const form = useForm<AppointmentSchemaType>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      callerName: "",
      callerEmail: "",
      date: "",
      time: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      scenarioId: "",
      webhookUrl: "",
    },
  })

  const onSubmit = async (data: AppointmentSchemaType) => {
    try {
      console.log("[v0] =================================")
      console.log("[v0] BOOK APPOINTMENT FORM SUBMISSION")
      console.log("[v0] =================================")
      console.log("[v0] Form Data:", JSON.stringify(data, null, 2))
      console.log("[v0] Business ID:", business?._id)
      console.log("[v0] Business:", business)

      if (!business?._id) {
        console.error("[v0] ❌ No business ID found")
        toast.error("Please select a business first")
        return
      }

      const appointmentPayload = {
        businessId: business._id,
        ...data,
        scenarioId: data.scenarioId ? Number(data.scenarioId) : undefined,
      }

      console.log("[v0] Appointment Payload:", JSON.stringify(appointmentPayload, null, 2))
      console.log("[v0] Calling createAppointment...")
      console.log("[v0] =================================")

      await createAppointment(appointmentPayload)

      console.log("[v0] ✅ Appointment creation completed successfully")
      toast.success("Appointment created and integration triggered successfully")
      form.reset()
    } catch (err: any) {
      console.error("[v0] =================================")
      console.error("[v0] ❌ FORM SUBMISSION ERROR")
      console.error("[v0] Error Type:", err?.constructor?.name)
      console.error("[v0] Error Message:", err?.message)
      console.error("[v0] Full Error Object:", err)
      console.error("[v0] =================================")
      toast.error(err?.message || "Failed to create appointment")
    }
  }

  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="callerName"
              render={({ field }: any) => (
                <FormItem>
                  <p className="mb-1 text-sm font-bold text-slate-700">Customer Name</p>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} className="h-11 border-slate-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="callerEmail"
              render={({ field }: any) => (
                <FormItem>
                  <p className="mb-1 text-sm font-bold text-slate-700">Customer Email</p>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} className="h-11 border-slate-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="date"
              render={({ field }: any) => (
                <FormItem>
                  <p className="mb-1 text-sm font-bold text-slate-700">Date</p>
                  <FormControl>
                    <Input type="date" {...field} className="h-11 border-slate-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }: any) => (
                <FormItem>
                  <p className="mb-1 text-sm font-bold text-slate-700">Time</p>
                  <FormControl>
                    <Input type="time" {...field} className="h-11 border-slate-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="scenarioId"
              render={({ field }: any) => (
                <FormItem>
                  <p className="mb-1 text-sm font-bold text-slate-700">Scenario ID (Optional)</p>
                  <FormControl>
                    <Input type="number" placeholder="12345" {...field} className="h-11 border-slate-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="webhookUrl"
              render={({ field }: any) => (
                <FormItem>
                  <p className="mb-1 text-sm font-bold text-slate-700">Webhook URL (Optional)</p>
                  <FormControl>
                    <Input placeholder="https://hook.make.com/..." {...field} className="h-11 border-slate-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-row items-center justify-between gap-4 mt-8">
            <Button
              onClick={() => setStage(1)}
              type="button"
              variant="outline"
              className="w-full h-12 border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
            >
              Back
            </Button>
            <Button
              disabled={loading}
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg shadow-slate-200"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                "Create Appointment"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  )
}
