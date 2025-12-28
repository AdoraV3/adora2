import { CheckCircle, AlertCircle, AlertTriangle, XCircle } from "lucide-react"

interface NotificationIconProps {
  type: "success" | "info" | "warning" | "error"
  size?: number
}

export function NotificationIcon({ type, size = 14 }: NotificationIconProps) {
  const iconMap = {
    success: CheckCircle,
    info: AlertCircle,
    warning: AlertTriangle,
    error: XCircle,
  }

  const colorMap = {
    success: "text-green-600",
    info: "text-blue-600",
    warning: "text-yellow-600",
    error: "text-red-600",
  }

  const bgColorMap = {
    success: "bg-green-50",
    info: "bg-blue-50",
    warning: "bg-yellow-50",
    error: "bg-red-50",
  }

  const IconComponent = iconMap[type]

  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center flex-shrink-0 ${bgColorMap[type]}`}
    >
      <IconComponent size={size} className={colorMap[type]} aria-label={`${type} notification icon`} />
    </div>
  )
}
