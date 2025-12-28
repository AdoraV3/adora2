/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { useSubscriptionStore } from "@/store/subscription-store"
import { useToast } from "@/hooks/use-toast"
import { Card, Button, Segmented, Skeleton, Empty, Popconfirm, Row, Col, Statistic, Badge } from "antd"
import { CheckOutlined } from "@ant-design/icons"

export default function SubscriptionContent() {
  const router = useRouter()
  const { toast } = useToast()
  const { profile, business } = useAuthStore()
  const {
    plans,
    currentSubscription,
    subscriptionStatus,
    loading,
    loadingPlanId,
    error,
    fetchSubscriptionPlans,
    fetchBusinessSubscription,
    fetchSubscriptionStatus,
    createCheckoutSession,
    cancelSubscription,
  } = useSubscriptionStore()

  const [selectedCountry, setSelectedCountry] = useState<"Nigeria" | "Other">("Other")
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")
  const [isPageReady, setIsPageReady] = useState(false)

  useEffect(() => {
    setIsPageReady(true)
  }, [])

  useEffect(() => {
    if (profile?.country) {
      const country = profile.country.toLowerCase() === "nigeria" ? "Nigeria" : "Other"
      setSelectedCountry(country)
    }
  }, [profile?.country])

  useEffect(() => {
    const loadSubscriptionData = async () => {
      if (!business?._id) {
        return
      }

      try {
        await fetchSubscriptionPlans()
        await fetchBusinessSubscription(business._id)
        await fetchSubscriptionStatus(business._id)
      } catch (error) {
        toast({
          title: "Error",
          message: error instanceof Error ? error.message : "Failed to load subscription data",
          type: "error",
        })
      }
    }

    loadSubscriptionData()
  }, [business?._id, fetchSubscriptionPlans, fetchBusinessSubscription, fetchSubscriptionStatus, toast])

  const filteredPlans = plans.filter((plan) => {
    const countryMatch = selectedCountry === "Nigeria" ? plan.currency === "NGN" : plan.currency === "USD"
    const periodMatch = plan.period === billingPeriod
    return countryMatch && periodMatch
  })

  const handleUpgradePlan = async (planId: string, paymentLink?: string) => {
    if (!business?._id) {
      toast({
        title: "Error",
        message: "Please select a business first",
        type: "error",
      })
      return
    }

    try {
      if (paymentLink) {
        window.location.href = paymentLink
        return
      }

      const response = await createCheckoutSession(business._id, planId)

      if (response.url) {
        window.location.href = response.url
      } else if (response.authorizationUrl) {
        window.location.href = response.authorizationUrl
      } else if (response.reference) {
        toast({
          title: "Success",
          message: "Payment processed successfully! Updating your subscription...",
          type: "success",
        })

        setTimeout(async () => {
          try {
            await fetchBusinessSubscription(business._id)
            await fetchSubscriptionStatus(business._id)
            toast({
              title: "Success",
              message: "Your subscription has been updated!",
              type: "success",
            })
            router.push("/dashboard/account-settings")
          } catch (err) {
            console.error("Error refreshing subscription:", err)
          }
        }, 2000)
      } else {
        throw new Error("No payment URL returned from server")
      }
    } catch (error) {
      toast({
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to create checkout session",
        type: "error",
      })
    }
  }

  const handleCancelSubscription = async () => {
    if (!business?._id) return

    try {
      await cancelSubscription(business._id)
      toast({
        title: "Success",
        message: "Subscription cancelled successfully",
        type: "success",
      })
      await fetchBusinessSubscription(business._id)
      await fetchSubscriptionStatus(business._id)
    } catch (error) {
      toast({
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to cancel subscription",
        type: "error",
      })
    }
  }

  const daysLeft = currentSubscription?.subscriptionEndDate
    ? Math.ceil((new Date(currentSubscription.subscriptionEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0

  const getCurrencyDisplay = () => {
    if (selectedCountry === "Nigeria") {
      return { symbol: "₦", code: "NGN", provider: "Paystack" }
    }
    return { symbol: "$", code: "USD", provider: "Stripe" }
  }

  const currency = getCurrencyDisplay()

  function PlanCardSkeleton() {
    return (
      <Card className="h-full">
        <Skeleton active paragraph={{ rows: 5 }} />
      </Card>
    )
  }

  function SubscriptionSkeletonFull() {
    return (
      <div className="space-y-6 max-w-6xl w-full">
        <Skeleton active paragraph={{ rows: 2 }} />
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Card>
              <Skeleton active paragraph={{ rows: 1 }} />
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card>
              <Skeleton active paragraph={{ rows: 1 }} />
            </Card>
          </Col>
        </Row>
        <div>
          <Skeleton active title={{ width: "20%" }} paragraph={{ rows: 1 }} />
          <Row gutter={16} className="mt-4">
            <Col xs={24} sm={12} lg={8}>
              <PlanCardSkeleton />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <PlanCardSkeleton />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <PlanCardSkeleton />
            </Col>
          </Row>
        </div>
      </div>
    )
  }

  if (!isPageReady || (loading && !plans.length)) {
    return (
      <div className="p-6">
        <SubscriptionSkeletonFull />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header with Title and Status */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subscription Plans</h2>
          <p className="text-gray-600 mt-2">Manage your subscription and billing preferences</p>
        </div>
        {currentSubscription && (
          <div className="text-right">
            {!currentSubscription?.isFreeTrial && daysLeft > 0 && (
              <Badge count={`${daysLeft} days left`} style={{ backgroundColor: "#f59e0b" }} />
            )}
            {currentSubscription?.isFreeTrial && <Badge count="Free Trial" style={{ backgroundColor: "#10b981" }} />}
          </div>
        )}
      </div>

      {/* Current Subscription Info Card */}
      {currentSubscription && (
        <Card className="border-l-4 border-l-orange-500 shadow-md">
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="Current Plan"
                value={currentSubscription.subscription?.plan || "Free"}
                suffix="Plan"
                valueStyle={{ color: "#1f2937", fontSize: "18px", fontWeight: "600" }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="Status"
                value={currentSubscription.isFreeTrial ? "Free Trial" : "Active"}
                valueStyle={{
                  color: currentSubscription.isFreeTrial ? "#10b981" : "#0ea5e9",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              />
            </Col>
            {currentSubscription.subscriptionStartDate && (
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="Started"
                  value={new Date(currentSubscription.subscriptionStartDate).toLocaleDateString()}
                  valueStyle={{ fontSize: "14px", fontWeight: "600" }}
                />
              </Col>
            )}
            {currentSubscription.subscriptionEndDate && (
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="Expires"
                  value={new Date(currentSubscription.subscriptionEndDate).toLocaleDateString()}
                  valueStyle={{ fontSize: "14px", fontWeight: "600" }}
                />
              </Col>
            )}
          </Row>

          {subscriptionStatus && (
            <Row gutter={[24, 24]} className="mt-6 pt-6 border-t border-gray-200">
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="Vapi Status"
                  value={subscriptionStatus.isVapiActive ? "Active" : "Inactive"}
                  valueStyle={{
                    color: subscriptionStatus.isVapiActive ? "#10b981" : "#ef4444",
                    fontSize: "18px",
                    fontWeight: "600",
                  }}
                />
              </Col>
              {subscriptionStatus.daysLeftInTrial > 0 && (
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Trial Days Left"
                    value={subscriptionStatus.daysLeftInTrial}
                    valueStyle={{ fontSize: "18px", fontWeight: "600" }}
                  />
                </Col>
              )}
              {subscriptionStatus.freeTrialStartDate && (
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Trial Start"
                    value={new Date(subscriptionStatus.freeTrialStartDate).toLocaleDateString()}
                    valueStyle={{ fontSize: "14px", fontWeight: "600" }}
                  />
                </Col>
              )}
              {subscriptionStatus.freeTrialEndDate && (
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Trial End"
                    value={new Date(subscriptionStatus.freeTrialEndDate).toLocaleDateString()}
                    valueStyle={{ fontSize: "14px", fontWeight: "600" }}
                  />
                </Col>
              )}
            </Row>
          )}
        </Card>
      )}

      {/* Billing Period Selector */}
      <div className="space-y-3 mt-[20px]">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Billing Period</h3>
        <Segmented
          value={billingPeriod}
          onChange={(value) => setBillingPeriod(value as "monthly" | "yearly")}
          options={[
            { label: "Monthly", value: "monthly" },
            { label: "Yearly", value: "yearly" },
          ]}
          block
          style={{ padding: "8px", backgroundColor: "#f3f4f6" }}
        />
      </div>

      {/* Plans Section */}
      {filteredPlans.length > 0 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Available Plans</h3>
            <p className="text-sm text-gray-600 mt-2">
              Pricing in {currency.code} ({currency.symbol}) via {currency.provider}
            </p>
          </div>

          <Row gutter={[24, 24]}>
            {filteredPlans.map((plan) => {
              const isCurrentPlan =
                currentSubscription?.subscription?.plan === plan.plan &&
                currentSubscription?.subscription?.period === plan.period
              const isLoadingThisPlan = loadingPlanId === plan._id

              return (
                <Col xs={24} sm={12} lg={8} key={plan._id}>
                  <Card
                    className={`h-full transition-all ${isCurrentPlan ? "border-2 border-orange-500 shadow-lg" : "shadow-md hover:shadow-lg"}`}
                    hoverable
                  >
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <h4 className="text-xl font-bold text-orange-600 capitalize">{plan.plan} Plan</h4>
                      <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                    </div>

                    {/* Price Section */}
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-gray-900">{currency.symbol}</span>
                        <span className="text-3xl font-semibold text-gray-900">
                          {(plan.amount / (currency.code === "USD" ? 100 : 1)).toLocaleString()}
                        </span>
                        <span className="text-gray-600 font-medium ml-2">
                          {plan.period === "yearly" ? "/year" : "/month"}
                        </span>
                      </div>
                    </div>

                    {/* Features List */}
                    {plan.features && plan.features.length > 0 && (
                      <div className="mb-6 space-y-3">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <CheckOutlined className="text-orange-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* CTA Button */}
                    <Button
                      type={isCurrentPlan ? "default" : "primary"}
                      danger={false}
                      block
                      size="large"
                      onClick={() => handleUpgradePlan(plan._id, plan.paymentLink)}
                      disabled={isLoadingThisPlan || isCurrentPlan}
                      loading={isLoadingThisPlan}
                      style={!isCurrentPlan ? { backgroundColor: "#ea580c", borderColor: "#ea580c" } : {}}
                    >
                      {isCurrentPlan ? "Current Plan" : "Get Started"}
                    </Button>
                  </Card>
                </Col>
              )
            })}
          </Row>
        </div>
      )}

      {/* Empty State */}
      {filteredPlans.length === 0 && plans.length > 0 && (
        <Empty
          description={`No plans available for ${selectedCountry} (${billingPeriod})`}
          style={{ marginTop: "60px", marginBottom: "60px" }}
        />
      )}

      {/* Cancel Subscription Button */}
      {!currentSubscription?.isFreeTrial && currentSubscription?.subscription && (
        <div className="pt-6 border-t border-gray-200">
          <Popconfirm
            title="Cancel Subscription"
            description="Are you sure you want to cancel your subscription? This action cannot be undone."
            onConfirm={handleCancelSubscription}
            okText="Yes, Cancel"
            cancelText="No, Keep It"
            okButtonProps={{ danger: true }}
          >
            <Button type="primary" danger loading={loading}>
              Cancel Subscription
            </Button>
          </Popconfirm>
        </div>
      )}
    </div>
  )
}
