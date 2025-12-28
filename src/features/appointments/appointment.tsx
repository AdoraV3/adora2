"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { BookAppointmentForm } from "./book-appointment-form"
import { CreateAvailabilityForm } from "./create-availability-form"
import { AppointmentList } from "./appointment-list"
import Instructions from "./instructions"
import {
  ChevronRight,
  Download,
  Calendar,
  ArrowLeft,
  LayoutDashboard,
  Plus,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

export function Appointment() {
  const [view, setView] = useState<"setup" | "manage">("manage")
  const [stage, setStage] = useState<number>(1)
  const [stageA, setStageA] = useState<number>(1)
  const [stageC, setStageC] = useState<number>(1)

  const handleDownload = (type: "A" | "C") => {
    // ... existing download logic ...
    if (type === "A") setStageA(2)
    else setStageC(2)
  }

  return (
    <section className="bg-slate-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center pt-8">
          <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex items-center">
            <button
              onClick={() => setView("manage")}
              className={`flex items-center px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                view === "manage" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Manage Appointments
            </button>
            <button
              onClick={() => setView("setup")}
              className={`flex items-center px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                view === "setup" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Plus className="w-4 h-4 mr-2" />
              Setup Integration
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 pt-8">
          {/* Main Content Area */}
          <div className="lg:w-3/5">
            {view === "setup" ? (
              <>
                <header className="mb-10">
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Integration Setup</h1>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-700 ease-in-out"
                        style={{ width: `${(stage / 2) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-500 whitespace-nowrap">Step {stage} of 2</span>
                  </div>
                </header>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300">
                  <div className="p-8 md:p-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">
                          {stage === 1 ? "Calendar Availability" : "Booking Configuration"}
                        </h2>
                        <p className="text-slate-500 text-sm">Follow the prompts to configure your integration.</p>
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="space-y-8">
                      {(stage === 1 ? stageA : stageC) === 1 ? (
                        <div className="bg-slate-50 rounded-xl p-8 border border-slate-100 text-center">
                          <div className="max-w-md mx-auto">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Get Started with the Template</h3>
                            <p className="text-slate-500 mb-8">
                              Download our pre-configured Make.com blueprint to speed up your workflow.
                            </p>
                            <Button
                              className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 font-semibold shadow-lg shadow-slate-200 transition-all active:scale-95"
                              onClick={() => handleDownload(stage === 1 ? "A" : "C")}
                            >
                              <Download className="mr-2 h-5 w-5" />
                              Download Template
                            </Button>
                            <button
                              className="mt-6 text-sm font-medium text-slate-400 hover:text-slate-600 flex items-center justify-center w-full transition-colors"
                              onClick={() => setStage(stage === 1 ? 2 : 1)}
                            >
                              {stage === 1 ? (
                                <>
                                  Skip to Step 2 <ChevronRight className="ml-1 h-4 w-4" />
                                </>
                              ) : (
                                <>
                                  <ArrowLeft className="mr-1 h-4 w-4" /> Back to Step 1
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="animate-in fade-in zoom-in-95 duration-300">
                          {stage === 1 ? (
                            <CreateAvailabilityForm setStage={setStage} />
                          ) : (
                            <BookAppointmentForm setStage={setStage} />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Display the AppointmentList in the management view */
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <header className="mb-10">
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">My Appointments</h1>
                  <p className="text-slate-500">Overview and management of your business appointments.</p>
                </header>
                <AppointmentList />
              </div>
            )}
          </div>

          {/* Sidebar Instructions */}
          <div className="lg:w-2/5">
            <div className="sticky top-12">
              <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-8 md:p-10">
                <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
                  <h3 className="text-lg font-bold text-slate-900">
                    {view === "setup" ? "Setup Guide" : "Appointment Insights"}
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                    {view === "setup" ? "Instructional" : "Quick Tips"}
                  </span>
                </div>
                {view === "setup" ? (
                  <Instructions step={stage} />
                ) : (
                  /* Dynamic content for the management view sidebar */
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <h4 className="font-bold text-slate-900 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
                        Confirmation Workflow
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Confirmed appointments trigger automated notifications to both you and the caller via your
                        configured webhooks.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <h4 className="font-bold text-slate-900 mb-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2 text-amber-500" />
                        Pending Requests
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Ensure you review pending appointments within 24 hours to maintain high customer satisfaction.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
                <p className="text-sm text-emerald-800 leading-relaxed font-medium">
                  <strong>Need help?</strong> Our integration team is available to assist you with the Make.com
                  configuration if you run into any issues.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
