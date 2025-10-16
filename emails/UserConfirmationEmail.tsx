import React from "react"
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Link,
} from "@react-email/components"

interface UserConfirmationEmailProps {
  name: string
  message: string
}

const UserConfirmationEmail = ({
  name,
  message,
}: UserConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#0F0F0F",
          color: "#ffffff",
        }}
      >
        <Container
          style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}
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
                fontSize: "28px",
                fontWeight: "bold",
                color: "#ffffff",
              }}
            >
              Thank You, {name}!
            </Heading>
            <Text
              style={{
                margin: "10px 0 0 0",
                fontSize: "16px",
                color: "#E5E7EB",
                opacity: 0.9,
              }}
            >
              Your message has been received
            </Text>
          </div>

          {/* Main Content */}
          <div style={{ marginBottom: "30px" }}>
            <Text
              style={{
                fontSize: "16px",
                lineHeight: "1.6",
                marginBottom: "20px",
                color: "#D1D5DB",
              }}
            >
              Hi {name},
            </Text>

            <Text
              style={{
                fontSize: "16px",
                lineHeight: "1.6",
                marginBottom: "20px",
                color: "#D1D5DB",
              }}
            >
              Thank you for reaching out! I&apos;ve received your message and
              I&apos;ll get back to you as soon as possible.
            </Text>

            <div
              style={{
                backgroundColor: "#1F2937",
                padding: "20px",
                borderRadius: "8px",
                borderLeft: "4px solid #8B5CF6",
                marginBottom: "20px",
              }}
            >
              <Text
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#9CA3AF",
                }}
              >
                Your Message:
              </Text>
              <Text
                style={{
                  margin: "0",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  color: "#E5E7EB",
                  fontStyle: "italic",
                }}
              >
                &quot;{message}&quot;
              </Text>
            </div>

            <Text
              style={{
                fontSize: "16px",
                lineHeight: "1.6",
                marginBottom: "20px",
                color: "#D1D5DB",
              }}
            >
              In the meantime, feel free to connect with me on my social
              platforms or check out my latest projects.
            </Text>
          </div>

          {/* Social Links */}
          <div
            style={{
              backgroundColor: "#111827",
              padding: "25px",
              borderRadius: "12px",
              marginBottom: "30px",
            }}
          >
            <Heading
              style={{
                margin: "0 0 20px 0",
                fontSize: "18px",
                fontWeight: "bold",
                color: "#8B5CF6",
                textAlign: "center",
              }}
            >
              Connect With Me
            </Heading>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "15px",
              }}
            >
              {/* GitHub */}
              <Link
                href="https://github.com/jatinbuilds"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                  backgroundColor: "#1F2937",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: "#ffffff",
                  transition: "all 0.3s ease",
                  border: "1px solid #374151",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ marginRight: "10px" }}
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span style={{ fontSize: "14px", fontWeight: "500" }}>
                  GitHub
                </span>
              </Link>

              {/* LinkedIn */}
              <Link
                href="https://linkedin.com/in/jatinbuilds"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                  backgroundColor: "#1F2937",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: "#ffffff",
                  transition: "all 0.3s ease",
                  border: "1px solid #374151",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ marginRight: "10px" }}
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span style={{ fontSize: "14px", fontWeight: "500" }}>
                  LinkedIn
                </span>
              </Link>

              {/* Twitter */}
              <Link
                href="https://twitter.com/jatinbuilds"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                  backgroundColor: "#1F2937",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: "#ffffff",
                  transition: "all 0.3s ease",
                  border: "1px solid #374151",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ marginRight: "10px" }}
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span style={{ fontSize: "14px", fontWeight: "500" }}>
                  Twitter
                </span>
              </Link>

              {/* Email */}
              <Link
                href="mailto:noreply@jatinbuilds.com"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                  backgroundColor: "#1F2937",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: "#ffffff",
                  transition: "all 0.3s ease",
                  border: "1px solid #374151",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ marginRight: "10px" }}
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span style={{ fontSize: "14px", fontWeight: "500" }}>
                  Email
                </span>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              textAlign: "center",
              padding: "20px 0",
              borderTop: "1px solid #374151",
              color: "#9CA3AF",
            }}
          >
            <Text
              style={{
                margin: "0 0 10px 0",
                fontSize: "14px",
              }}
            >
              Best regards,
              <br />
              <strong style={{ color: "#8B5CF6" }}>Jatin</strong>
            </Text>
            <Text
              style={{
                margin: "0",
                fontSize: "12px",
                opacity: 0.8,
              }}
            >
              This is an automated message. Please do not reply to this email.
            </Text>
          </div>
        </Container>
      </Body>
    </Html>
  )
}

export default UserConfirmationEmail
