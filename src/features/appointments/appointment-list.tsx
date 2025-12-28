/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { useAppointmentStore } from "@/store/appointment-store"
import { useAuthStore } from "@/store/auth-store"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Clock,
  User,
  Mail,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Trash2,
  ExternalLink,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { toast } from "sonner"

export function AppointmentList() {
  const { business } = useAuthStore()
  const { appointments, loading, fetchAppointmentsByBusiness, updateAppointment, deleteAppointment } =
    useAppointmentStore()

  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all")

  useEffect(() => {
    if (business?._id) {
      const filters = filter !== "all" ? { status: filter } : undefined
      fetchAppointmentsByBusiness(business._id, filters)
    }
  }, [business?._id, fetchAppointmentsByBusiness, filter])

  const handleStatusUpdate = async (id: string, status: "confirmed" | "cancelled") => {
    try {
      await updateAppointment(id, { status })
      toast.success(`Appointment ${status} successfully`)
    } catch (error) {
      toast.error("Failed to update appointment status")
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await deleteAppointment(id)
        toast.success("Appointment deleted successfully")
      } catch (error) {
        toast.error("Failed to delete appointment")
      }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1">
            <CheckCircle className="w-3 h-3 mr-1" /> Confirmed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-none px-3 py-1">
            <XCircle className="w-3 h-3 mr-1" /> Cancelled
          </Badge>
        )
      default:
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none px-3 py-1">
            <AlertCircle className="w-3 h-3 mr-1" /> Pending
          </Badge>
        )
    }
  }

  if (loading && appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-slate-500 font-medium">Loading appointments...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Recent Appointments</h3>
        <div className="flex items-center bg-slate-100 rounded-lg p-1">
          {["all", "pending", "confirmed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                filter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {appointments.length === 0 ? (
        <Card className="border-dashed border-2 bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h4 className="text-slate-900 font-bold mb-1">No appointments found</h4>
            <p className="text-slate-500 text-sm max-w-xs">
              {filter === "all"
                ? "You don't have any appointments scheduled yet."
                : `No ${filter} appointments found for your business.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {appointments.map((apt) => (
            <Card
              key={apt._id}
              className="overflow-hidden border-slate-200 hover:border-emerald-200 transition-all group"
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center p-5 gap-6">
                  {/* Date & Time */}
                  <div className="flex md:flex-col items-center md:items-start justify-between md:justify-center md:w-32 pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-slate-100">
                    <div className="flex items-center text-slate-900 font-bold">
                      <Calendar className="w-4 h-4 mr-2 text-emerald-500 md:hidden" />
                      {format(new Date(apt.date), "MMM d, yyyy")}
                    </div>
                    <div className="flex items-center text-slate-500 text-sm mt-1">
                      <Clock className="w-4 h-4 mr-2 text-slate-400" />
                      {apt.time}
                    </div>
                  </div>

                  {/* Caller Info */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center text-slate-900 font-bold text-lg">
                      <User className="w-4 h-4 mr-2 text-slate-400" />
                      {apt.callerName}
                    </div>
                    <div className="flex items-center text-slate-500 text-sm">
                      <Mail className="w-4 h-4 mr-2 text-slate-400" />
                      {apt.callerEmail}
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {getStatusBadge(apt.status)}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {apt.status !== "confirmed" && (
                          <DropdownMenuItem onClick={() => handleStatusUpdate(apt._id, "confirmed")}>
                            <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
                            Confirm Appointment
                          </DropdownMenuItem>
                        )}
                        {apt.status !== "cancelled" && (
                          <DropdownMenuItem onClick={() => handleStatusUpdate(apt._id, "cancelled")}>
                            <XCircle className="w-4 h-4 mr-2 text-rose-500" />
                            Cancel Appointment
                          </DropdownMenuItem>
                        )}
                        {apt.webhookUrl && (
                          <DropdownMenuItem asChild>
                            <a
                              href={apt.webhookUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center"
                            >
                              <ExternalLink className="w-4 h-4 mr-2 text-blue-500" />
                              View Webhook
                            </a>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleDelete(apt._id)}
                          className="text-rose-600 focus:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Permanent
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
