import React from "react"
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Link,
  Button,
} from "@react-email/components"

interface AdminNotificationEmailProps {
  name: string
  email: string
  message: string
  timestamp: string
}

const AdminNotificationEmail = ({
  name,
  email,
  message,
  timestamp,
}: AdminNotificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#ffffff",
          color: "#1F2937",
        }}
      >
        <Container
          style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}
        >
          {/* Header */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "30px",
              padding: "20px",
              background: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)",
              borderRadius: "12px",
            }}
          >
            <Heading
              style={{
                margin: "0",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#ffffff",
              }}
            >
              New Contact Form Submission
            </Heading>
            <Text
              style={{
                margin: "10px 0 0 0",
                fontSize: "14px",
                color: "#E5E7EB",
                opacity: 0.9,
              }}
            >
              Someone reached out through your portfolio
            </Text>
          </div>

          {/* Alert Badge */}
          <div
            style={{
              backgroundColor: "#FEF3C7",
              border: "1px solid #F59E0B",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "25px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="#F59E0B"
              style={{ marginRight: "10px" }}
            >
              <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z" />
            </svg>
            <Text
              style={{
                margin: "0",
                fontSize: "14px",
                fontWeight: "500",
                color: "#92400E",
              }}
            >
              New message received at {timestamp}
            </Text>
          </div>

          {/* Contact Details */}
          <div
            style={{
              backgroundColor: "#F9FAFB",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "25px",
              border: "1px solid #E5E7EB",
            }}
          >
            <Heading
              style={{
                margin: "0 0 15px 0",
                fontSize: "18px",
                fontWeight: "bold",
                color: "#1F2937",
              }}
            >
              Contact Information
            </Heading>

            <div style={{ display: "grid", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Text
                  style={{
                    margin: "0 10px 0 0",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#6B7280",
                    minWidth: "60px",
                  }}
                >
                  Name:
                </Text>
                <Text
                  style={{
                    margin: "0",
                    fontSize: "14px",
                    color: "#1F2937",
                    fontWeight: "500",
                  }}
                >
                  {name}
                </Text>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <Text
                  style={{
                    margin: "0 10px 0 0",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#6B7280",
                    minWidth: "60px",
                  }}
                >
                  Email:
                </Text>
                <Link
                  href={`mailto:${email}`}
                  style={{
                    fontSize: "14px",
                    color: "#8B5CF6",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  {email}
                </Link>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <Text
                  style={{
                    margin: "0 10px 0 0",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#6B7280",
                    minWidth: "60px",
                  }}
                >
                  Time:
                </Text>
                <Text
                  style={{
                    margin: "0",
                    fontSize: "14px",
                    color: "#1F2937",
                  }}
                >
                  {timestamp}
                </Text>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div
            style={{
              backgroundColor: "#1F2937",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "25px",
            }}
          >
            <Heading
              style={{
                margin: "0 0 15px 0",
                fontSize: "18px",
                fontWeight: "bold",
                color: "#8B5CF6",
              }}
            >
              Message Content
            </Heading>
            <div
              style={{
                backgroundColor: "#111827",
                padding: "15px",
                borderRadius: "6px",
                border: "1px solid #374151",
              }}
            >
              <Text
                style={{
                  margin: "0",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  color: "#E5E7EB",
                  whiteSpace: "pre-wrap",
                }}
              >
                {message}
              </Text>
            </div>
          </div>

          {/* Quick Actions */}
          <div
            style={{
              backgroundColor: "#F3F4F6",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "25px",
              border: "1px solid #D1D5DB",
            }}
          >
            <Heading
              style={{
                margin: "0 0 15px 0",
                fontSize: "16px",
                fontWeight: "bold",
                color: "#1F2937",
              }}
            >
              Quick Actions
            </Heading>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Button
                href={`mailto:${email}?subject=Re: Your message from portfolio&body=Hi ${name},%0D%0A%0D%0AThank you for reaching out through my portfolio.`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "8px 16px",
                  backgroundColor: "#8B5CF6",
                  color: "#ffffff",
                  textDecoration: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ marginRight: "6px" }}
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                Reply via Email
              </Button>

              <Button
                href={`https://linkedin.com/in/jatinbuilds`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "8px 16px",
                  backgroundColor: "#0077B5",
                  color: "#ffffff",
                  textDecoration: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ marginRight: "6px" }}
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Connect on LinkedIn
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              textAlign: "center",
              padding: "20px 0",
              borderTop: "1px solid #E5E7EB",
              color: "#6B7280",
            }}
          >
            <Text
              style={{
                margin: "0 0 10px 0",
                fontSize: "14px",
              }}
            >
              This notification was sent from your portfolio contact form
            </Text>
            <Text
              style={{
                margin: "0",
                fontSize: "12px",
                opacity: 0.8,
              }}
            >
              Portfolio Contact System • {new Date().toLocaleDateString()}
            </Text>
          </div>
        </Container>
      </Body>
    </Html>
  )
}

export default AdminNotificationEmail
