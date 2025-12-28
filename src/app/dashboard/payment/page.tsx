/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, Table, Modal, Button, Tag, Statistic, Row, Col, Empty } from "antd"
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  DollarOutlined,
  CalendarOutlined,
  EyeOutlined,
} from "@ant-design/icons"
import { useAuthStore } from "@/store/auth-store"
import { useSubscriptionStore } from "@/store/subscription-store"
import { usePaymentStore } from "@/store/payment-store"

interface PaymentHistory {
  _id: string
  amount: number
  planName: string
  status: "completed" | "pending" | "failed"
  paymentProvider: string
  transactionId: string
  createdAt: string
}

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying")
  const [message, setMessage] = useState("Verifying payment...")
  const [subscription, setSubscription] = useState<any>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistory | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const { user, business, businesses } = useAuthStore()
  const businessId = business?._id || businesses?.[0]?._id || ""
  const { refreshSubscriptionStatus } = useSubscriptionStore()

  const { payments, stats, loading: paymentsLoading, fetchPayments, fetchStats, verifyPayment } = usePaymentStore()

  useEffect(() => {
    const handleVerifyPayment = async () => {
      try {
        const reference = searchParams.get("reference")
        const sessionId = searchParams.get("session_id")

        if (!reference && !sessionId) {
          setStatus("error")
          setMessage("No payment reference found")
          setLoading(false)
          setShowHistory(true)

          if (businessId) {
            fetchPayments(businessId, 1, 10)
            fetchStats()
          }
          return
        }

        if (reference) {
          const data = await verifyPayment(reference)

          if (data.success && data.status === "success") {
            setStatus("success")
            setMessage("Payment successful! Subscription active.")
            setSubscription(data.subscription)

            if (businessId) {
              setTimeout(() => {
                refreshSubscriptionStatus(businessId)
                fetchPayments(businessId, 1, 10)
                fetchStats()
                setShowHistory(true)

                setTimeout(() => {
                  router.push("/dashboard/account-settings?tab=subscription")
                }, 3000)
              }, 500)
            }
          } else {
            setStatus("error")
            setMessage(data.message || "Payment verification failed")
            setShowHistory(true)

            if (businessId) {
              fetchPayments(businessId, 1, 10)
              fetchStats()
            }
          }
        } else if (sessionId) {
          setStatus("success")
          setMessage("Processing Stripe payment...")

          if (businessId) {
            setTimeout(() => {
              fetchPayments(businessId, 1, 10)
              fetchStats()
              setShowHistory(true)
              router.push("/dashboard/account-settings?tab=subscription")
            }, 2000)
          }
        }

        setLoading(false)
      } catch (error) {
        setStatus("error")
        setMessage("Payment verification failed")
        setLoading(false)
        setShowHistory(true)

        if (businessId) {
          fetchPayments(businessId, 1, 10)
          fetchStats()
        }
      }
    }

    handleVerifyPayment()
  }, [searchParams, businessId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success"
      case "pending":
        return "warning"
      case "failed":
        return "error"
      default:
        return "default"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => formatDate(date),
      width: 120,
    },
    {
      title: "Plan",
      dataIndex: "planName",
      key: "planName",
      width: 150,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => <span className="font-semibold">${amount.toFixed(2)}</span>,
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)} className="capitalize">
          {status}
        </Tag>
      ),
      width: 100,
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
      render: (id: string) => <code className="text-xs bg-slate-100 px-2 py-1 rounded">{id.substring(0, 18)}...</code>,
      width: 200,
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: PaymentHistory) => (
        <Button type="primary" ghost size="small" icon={<EyeOutlined />} onClick={() => setSelectedPayment(record)}>
          View
        </Button>
      ),
      width: 100,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10">
      <div className="max-w-5xl mx-auto space-y-8 px-4 md:px-0">
        {/* {loading && (
          <Card className="border-0 shadow-sm">
            <div className="flex items-center justify-center gap-3 py-8">
              <LoadingOutlined className="text-2xl text-blue-600" />
              <span className="text-lg text-slate-700">{message}</span>
            </div>
          </Card>
        )} */}

        {!loading && status === "success" && (
          <Card className="border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-transparent shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircleOutlined className="text-3xl text-green-600" />
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{message}</h2>
                <p className="text-sm text-slate-600 mt-1">{subscription && `Plan: ${subscription.plan}`}</p>
              </div>
            </div>
          </Card>
        )}

        {!loading && status === "error" && (
          <Card className="border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-transparent shadow-sm">
            <div className="flex items-center gap-3">
              <ExclamationCircleOutlined className="text-3xl text-red-600" />
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{message}</h2>
                <p className="text-sm text-slate-600 mt-1">Please contact support if the issue persists.</p>
              </div>
            </div>
          </Card>
        )}

        {showHistory && (
          <>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Payment History</h1>
              <p className="text-slate-600 mt-2">Track all your payments and subscription activities.</p>
            </div>

            {/* {stats && !paymentsLoading && (
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Card className="border-0 shadow-sm h-full">
                    <Statistic
                      title="Total Paid"
                      value={stats.totalPaid ?? 0}
                      prefix={<DollarOutlined />}
                      precision={2}
                      valueStyle={{ color: "#2563eb" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12}>
                  <Card className="border-0 shadow-sm h-full">
                    <Statistic
                      title="Total Transactions"
                      value={stats.transactionCount}
                      prefix={<CalendarOutlined />}
                      valueStyle={{ color: "#7c3aed" }}
                    />
                  </Card>
                </Col>
              </Row>
            )} */}

            <Card className="border-0 shadow-md">
              <Table
                columns={columns}
                dataSource={payments.map((payment) => ({
                  ...payment,
                  key: payment._id,
                }))}
                loading={paymentsLoading}
                pagination={{
                  pageSize: pageSize,
                  current: currentPage,
                  total: payments.length,
                  onChange: (page) => setCurrentPage(page),
                }}
                locale={{
                  emptyText: <Empty description="No payments found" style={{ marginTop: 50, marginBottom: 50 }} />,
                }}
                className="[&_.ant-table]:border-none"
              />
            </Card>
          </>
        )}

        <Modal
          title="Payment Details"
          open={!!selectedPayment}
          onCancel={() => setSelectedPayment(null)}
          footer={[
            <Button key="close" onClick={() => setSelectedPayment(null)}>
              Close
            </Button>,
          ]}
          centered
        >
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</p>
                  <p className="text-base font-semibold text-slate-900 mt-1">{formatDate(selectedPayment.createdAt)}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Plan</p>
                  <p className="text-base font-semibold text-slate-900 mt-1">{selectedPayment.planName}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount</p>
                  <p className="text-base font-semibold text-slate-900 mt-1">${selectedPayment.amount.toFixed(2)}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</p>
                  <Tag color={getStatusColor(selectedPayment.status)} className="capitalize mt-2">
                    {selectedPayment.status}
                  </Tag>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Transaction ID</p>
                <code className="block text-sm bg-slate-100 px-3 py-2 rounded mt-1 break-all font-mono">
                  {selectedPayment.transactionId}
                </code>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Payment Provider</p>
                <p className="text-base font-semibold text-slate-900 mt-1 capitalize">
                  {selectedPayment.paymentProvider}
                </p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}
