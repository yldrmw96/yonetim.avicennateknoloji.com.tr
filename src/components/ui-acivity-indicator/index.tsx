"use client"

import { cn } from "@/lib/utils"
import { type HTMLAttributes, useMemo } from "react"

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Number of blades in the spinner
   * @default 12
   */
  bladeCount?: number

  /**
   * Size of the spinner in pixels
   * @default "20px"
   */
  size?: string | number

  /**
   * Color of the spinner blades
   * @default "currentColor"
   */
  color?: string

  /**
   * Duration of the animation in seconds
   * @default 1
   */
  duration?: number

  /**
   * Thickness of the spinner blades in pixels
   * @default "auto" (calculated based on size)
   */
  thickness?: number

  /**
   * Distance of blades from center (0-1)
   * 0 = blades at center, 1 = blades at edge
   * @default 0.5
   */
  distanceFromCenter?: number
}

export const Spinner = ({
  className,
  bladeCount = 12,
  size = "20px",
  color = "currentColor",
  duration = 1,
  thickness,
  distanceFromCenter = 0.5,
  style,
  ...props
}: SpinnerProps) => {
  // Calculate dimensions based on size
  const dimensions = useMemo(() => {
    const sizeValue = typeof size === "number" ? `${size}px` : size
    const numericSize = Number.parseInt(sizeValue)

    // Clamp distanceFromCenter between 0 and 1
    const clampedDistance = Math.max(0, Math.min(1, distanceFromCenter))

    // Calculate radius - how far blades are from center
    const radius = numericSize * 0.5 * clampedDistance

    return {
      containerSize: sizeValue,
      bladeWidth: thickness !== undefined ? thickness : Math.max(numericSize * 0.125, 2), // Use thickness if provided, otherwise 12.5% of size, min 2px
      bladeHeight: numericSize * 0.325, // 32.5% of size
      bladeRadius: Math.max(numericSize * 0.02625, 1), // 6.25% of size, min 1px
      centerOffset: numericSize * 0.5, // 50% of size (center)
      translateY: radius, // Distance from center based on the distanceFromCenter prop
    }
  }, [size, thickness, distanceFromCenter])

  // Generate blades
  const blades = useMemo(() => {
    return Array.from({ length: bladeCount }).map((_, index) => {
      const rotationDegree = (360 / bladeCount) * index
      const animationDelay = -((duration / bladeCount) * (bladeCount - index))

      return (
        <div
          key={index}
          className="spinner-blade"
          style={{
            position: "absolute",
            width: `${dimensions.bladeWidth}px`,
            height: `${dimensions.bladeHeight}px`,
            backgroundColor: color,
            borderRadius: `${dimensions.bladeRadius}px`,
            transform: `rotate(${rotationDegree}deg) translateY(-${dimensions.translateY}px)`,
            animationDelay: `${animationDelay}s`,
            left: `${dimensions.centerOffset - dimensions.bladeWidth / 2}px`,
            top: `${dimensions.centerOffset - dimensions.bladeHeight / 2 + dimensions.bladeHeight / 4}px`,
          }}
        />
      )
    })
  }, [bladeCount, color, dimensions, duration])

  return (
    <div
      className={cn("spinner", className)}
      style={{
        position: "relative",
        width: dimensions.containerSize,
        height: dimensions.containerSize,
        ...style,
      }}
      {...props}
    >
      <style jsx global>{`
        .spinner-blade {
          animation: ${duration}s ease-in infinite spinnerBlade;
          will-change: opacity;
        }
        
        @keyframes spinnerBlade {
          0% {
            opacity: 0.85;
          }
          50% {
            opacity: 0.15;
          }
          100% {
            opacity: 0.25;
          }
        }
      `}</style>
      {blades}
    </div>
  )
}
