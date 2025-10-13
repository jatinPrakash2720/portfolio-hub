"use client"

import { Button } from "../../../components/ui/shared/button"
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "../../components/ui/collapsible"
import { Input } from "../../../components/ui/shared/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/shared/tooltip"
import { cn } from "../../../lib/utils"
import {
  ChevronDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  RotateCcwIcon,
  ExternalLinkIcon,
  SmartphoneIcon,
  TabletIcon,
  MonitorIcon,
  InfoIcon,
} from "lucide-react"
import type { ComponentProps, ReactNode } from "react"
import { createContext, useContext, useEffect, useState, useRef } from "react"
// import {
//   TerminalConsole,
//   type ConsoleLog,
//   type NetworkRequest,
// } from "./terminal-console"

export type WebPreviewContextValue = {
  url: string
  setUrl: (url: string) => void
  consoleOpen: boolean
  setConsoleOpen: (open: boolean) => void
  iframeRef: React.RefObject<HTMLIFrameElement | null>
}

const WebPreviewContext = createContext<WebPreviewContextValue | null>(null)

const useWebPreview = () => {
  const context = useContext(WebPreviewContext)
  if (!context) {
    throw new Error("WebPreview components must be used within a WebPreview")
  }
  return context
}

export type WebPreviewProps = ComponentProps<"div"> & {
  defaultUrl?: string
  onUrlChange?: (url: string) => void
}

export const WebPreview = ({
  className,
  children,
  defaultUrl = "",
  onUrlChange,
  onPreviousProject,
  onNextProject,
  hasPrevious,
  hasNext,
  showProjectNavigation,
  ...props
}: WebPreviewProps & {
  onPreviousProject?: () => void
  onNextProject?: () => void
  hasPrevious?: boolean
  hasNext?: boolean
  showProjectNavigation?: boolean
}) => {
  const [url, setUrl] = useState(defaultUrl)
  const [consoleOpen, setConsoleOpen] = useState(false)
  const [showInitialTooltips, setShowInitialTooltips] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Update URL when defaultUrl prop changes (when project changes)
  useEffect(() => {
    setUrl(defaultUrl)
  }, [defaultUrl])

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl)
    onUrlChange?.(newUrl)
  }

  // Show tooltips on first load for mobile/tablet navigation
  useEffect(() => {
    if (showProjectNavigation) {
      const timer = setTimeout(() => {
        setShowInitialTooltips(true)
        // Hide tooltips after 3 seconds
        setTimeout(() => {
          setShowInitialTooltips(false)
        }, 3000)
      }, 1000) // Show after 1 second delay

      return () => clearTimeout(timer)
    }
  }, [showProjectNavigation])

  const contextValue: WebPreviewContextValue = {
    url,
    setUrl: handleUrlChange,
    consoleOpen,
    setConsoleOpen,
    iframeRef,
  }

  return (
    <WebPreviewContext.Provider value={contextValue}>
      <div
        className={cn(
          "flex size-full flex-col rounded-lg bg-black/80 backdrop-blur-sm border-purple-500/20 overflow-hidden relative",
          className
        )}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          border: "1px solid rgba(147, 51, 234, 0.2)",
        }}
        {...props}
      >
        {children}

        {/* Project Navigation - Mobile/Tablet Only - Floating Buttons */}
        {showProjectNavigation && (
          <>
            {/* Previous Button - Bottom Left */}
            <div className="absolute bottom-2 left-2 z-20 group">
              <Button
                variant="ghost"
                size="sm"
                onClick={onPreviousProject}
                disabled={!hasPrevious}
                className={`h-8 w-8 p-0 text-white/80 hover:text-white bg-black/80 hover:bg-black transition-all rounded-full border border-purple-500/20 ${
                  !hasPrevious
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-purple-500/20 hover:border-purple-500/40"
                }`}
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
              {/* Custom Tooltip */}
              <div
                className={`absolute left-full top-1/2 transform -translate-y-1/2 ml-1.5 px-1.5 py-0.5 bg-black/20 backdrop-blur-sm border border-purple-400/20 text-purple-700 text-[9px] font-medium rounded whitespace-nowrap transition-all duration-500 ease-out ${
                  showInitialTooltips
                    ? "opacity-60 scale-100 translate-x-0"
                    : "opacity-0 scale-90 -translate-x-2 group-hover:opacity-60 group-hover:scale-100 group-hover:translate-x-0"
                }`}
              >
                Previous Project
              </div>
            </div>

            {/* Next Button - Bottom Right */}
            <div className="absolute bottom-2 right-2 z-20 group">
              <Button
                variant="ghost"
                size="sm"
                onClick={onNextProject}
                disabled={!hasNext}
                className={`h-8 w-8 p-0 text-white/80 hover:text-white bg-black/80 hover:bg-black transition-all rounded-full border border-purple-500/20 ${
                  !hasNext
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-purple-500/20 hover:border-purple-500/40"
                }`}
              >
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
              {/* Custom Tooltip */}
              <div
                className={`absolute right-full top-1/2 transform -translate-y-1/2 mr-1.5 px-1.5 py-0.5 bg-black/20 backdrop-blur-sm border border-purple-400/20 text-purple-700 text-[9px] font-medium rounded whitespace-nowrap transition-all duration-500 ease-out ${
                  showInitialTooltips
                    ? "opacity-60 scale-100 translate-x-0"
                    : "opacity-0 scale-90 translate-x-2 group-hover:opacity-60 group-hover:scale-100 group-hover:translate-x-0"
                }`}
              >
                Next Project
              </div>
            </div>
          </>
        )}
      </div>
    </WebPreviewContext.Provider>
  )
}

export type WebPreviewNavigationProps = ComponentProps<"div"> & {
  onDescriptionClick?: () => void
}

export const WebPreviewNavigation = ({
  className,
  children,
  onDescriptionClick,
  ...props
}: WebPreviewNavigationProps) => {
  const { iframeRef } = useWebPreview()
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)
  const [responsiveMode, setResponsiveMode] = useState<
    "mobile" | "tablet" | "desktop"
  >("desktop")

  const handleBack = () => {
    if (iframeRef?.current?.contentWindow) {
      iframeRef.current.contentWindow.history.back()
    }
  }

  const handleForward = () => {
    if (iframeRef?.current?.contentWindow) {
      iframeRef.current.contentWindow.history.forward()
    }
  }

  const handleRefresh = () => {
    if (iframeRef?.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }

  const { url } = useWebPreview()

  const handleOpenInNewTab = () => {
    window.open(url, "_blank")
  }

  const handleResponsiveMode = (mode: "mobile" | "tablet" | "desktop") => {
    setResponsiveMode(mode)
    // Apply responsive styles to iframe
    if (iframeRef?.current) {
      const iframe = iframeRef.current
      iframe.style.width =
        mode === "mobile" ? "375px" : mode === "tablet" ? "768px" : "100%"
      iframe.style.height =
        mode === "mobile" ? "667px" : mode === "tablet" ? "1024px" : "100%"
      iframe.style.margin = "0 auto"
      iframe.style.display = "block"
    }
  }

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-1 p-2 bg-black/50 rounded-t-lg",
          className
        )}
        style={{
          borderBottom: "1px solid rgba(147, 51, 234, 0.2)",
        }}
        {...props}
      >
        {/* Browser Navigation Buttons */}
        <div className="flex items-center gap-1 mr-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  disabled={!canGoBack}
                  className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                >
                  <ArrowLeftIcon className="h-4 w-4 text-purple-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Back</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleForward}
                  disabled={!canGoForward}
                  className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                >
                  <ArrowRightIcon className="h-4 w-4 text-purple-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Forward</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                >
                  <RotateCcwIcon className="h-4 w-4 text-purple-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* URL Bar */}
        <div className="flex-1">{children}</div>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-1 ml-2">
          {/* Responsive Mode Buttons */}
          <div className="flex items-center gap-1 border border-purple-500/30 rounded-lg p-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleResponsiveMode("mobile")}
                    className={`h-7 w-7 p-0 text-white/70 hover:text-white hover:bg-white/10 ${
                      responsiveMode === "mobile"
                        ? "bg-purple-600/20 text-purple-400"
                        : ""
                    }`}
                  >
                    <SmartphoneIcon className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mobile View (375px)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleResponsiveMode("tablet")}
                    className={`h-7 w-7 p-0 text-white/70 hover:text-white hover:bg-white/10 ${
                      responsiveMode === "tablet"
                        ? "bg-purple-600/20 text-purple-400"
                        : ""
                    }`}
                  >
                    <TabletIcon className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tablet View (768px)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleResponsiveMode("desktop")}
                    className={`h-7 w-7 p-0 text-white/70 hover:text-white hover:bg-white/10 ${
                      responsiveMode === "desktop"
                        ? "bg-purple-600/20 text-purple-400"
                        : ""
                    }`}
                  >
                    <MonitorIcon className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Desktop View (100%)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Open in New Tab Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleOpenInNewTab}
                  className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                >
                  <ExternalLinkIcon className="h-4 w-4 text-purple-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open in new tab</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Project Description Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDescriptionClick}
                  className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                >
                  <InfoIcon className="h-4 w-4 text-purple-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Project Description</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  )
}

export type WebPreviewNavigationButtonProps = ComponentProps<typeof Button> & {
  tooltip?: string
}

export const WebPreviewNavigationButton = ({
  onClick,
  disabled,
  tooltip,
  children,
  ...props
}: WebPreviewNavigationButtonProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className="h-8 w-8 p-0 hover:text-foreground"
          disabled={disabled}
          onClick={onClick}
          size="sm"
          variant="ghost"
          {...props}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

export type WebPreviewUrlProps = ComponentProps<typeof Input>

export const WebPreviewUrl = ({
  value,
  onChange,
  onKeyDown,
  ...props
}: WebPreviewUrlProps) => {
  const { url, setUrl } = useWebPreview()
  const [inputValue, setInputValue] = useState(url)

  // Sync input value with context URL when it changes externally
  useEffect(() => {
    setInputValue(url)
  }, [url])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
    onChange?.(event)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const target = event.target as HTMLInputElement
      setUrl(target.value)
    }
    onKeyDown?.(event)
  }

  return (
    <Input
      className="h-8 flex-1 text-sm bg-black/30 border-purple-500/30 text-white placeholder:text-white/60 focus:border-purple-400"
      onChange={onChange ?? handleChange}
      onKeyDown={handleKeyDown}
      placeholder="Enter URL..."
      value={value ?? inputValue}
      {...props}
    />
  )
}

export type WebPreviewBodyProps = ComponentProps<"iframe"> & {
  loading?: ReactNode
  onLoad?: () => void
}

export const WebPreviewBody = ({
  className,
  loading,
  src,
  onLoad,
  ...props
}: WebPreviewBodyProps) => {
  const { url, iframeRef } = useWebPreview()

  return (
    <div className="flex-1 overflow-hidden">
      <iframe
        ref={iframeRef}
        className={cn(
          "size-full web-preview-iframe [&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-track]:bg-black/20 [&::-webkit-scrollbar-thumb]:bg-purple-500/50 [&::-webkit-scrollbar-thumb]:rounded-[4px] [&::-webkit-scrollbar-thumb]:hover:bg-purple-500/70",
          className
        )}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(139, 92, 246, 0.5) rgba(0, 0, 0, 0.2)",
          border: "none",
          outline: "none",
        }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
        src={(src ?? url) || undefined}
        title="Preview"
        onLoad={onLoad}
        {...props}
      />
      {loading}
    </div>
  )
}

// export type WebPreviewConsoleProps = ComponentProps<"div"> & {
//   onConsoleLog?: (log: ConsoleLog) => void
//   onNetworkRequest?: (request: NetworkRequest) => void
// }

// export const WebPreviewConsole = ({
//   className,
//   onConsoleLog,
//   onNetworkRequest,
//   ...props
// }: WebPreviewConsoleProps) => {
//   const { iframeRef } = useWebPreview()

//   return (
//     <TerminalConsole
//       className={className}
//       iframeRef={iframeRef}
//       onConsoleLog={onConsoleLog}
//       onNetworkRequest={onNetworkRequest}
//       {...props}
//     />
//   )
// }
