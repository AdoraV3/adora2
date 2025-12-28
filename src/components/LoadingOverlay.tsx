/* eslint-disable @next/next/no-img-element */
import type React from "react"
import "./loading-overlay.css"

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible, message }) => {
  if (!isVisible) return null

  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <div className="loading-logo">
          {/* Logo Image */}
          <img style={{width: '20x', height: "25px"}} src="/adora3-logo.png" alt="Loading" />
        </div>
        {message && <p className="loading-message">{message}</p>}
      </div>
    </div>
  )
}
