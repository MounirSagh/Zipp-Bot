import React, {
  useEffect,
  useRef,
  useMemo,
  useCallback,
  type ReactNode,
  type RefObject,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
  staggerDelay?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div";
  enableRotation?: boolean;
  customEasing?: string;
  enableGradient?: boolean;
  gradientColors?: string;
  enableScale?: boolean;
  baseScale?: number;
  enableShadow?: boolean;
  variant?: "default" | "gradient" | "outlined" | "minimal";
}

/**
 * ScrollReveal Component
 *
 * Animates text content with scroll-triggered reveal effects including:
 * - Rotation animation
 * - Opacity fade-in
 * - Optional blur effect
 *
 * @example
 * ```tsx
 * <ScrollReveal enableBlur baseOpacity={0.2}>
 *   Your amazing text here
 * </ScrollReveal>
 * ```
 */
const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
  rotationEnd = "bottom bottom",
  wordAnimationEnd = "bottom bottom",
  staggerDelay = 0.05,
  as: Component = "h2",
  enableRotation = true,
  customEasing = "none",
  enableGradient = false,
  gradientColors = "from-purple-400 via-pink-500 to-red-500",
  enableScale = false,
  baseScale = 0.95,
  enableShadow = false,
  variant = "default",
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  // Variant-based styling
  const variantStyles = useMemo(() => {
    const styles = {
      default: "transition-all duration-300",
      gradient: `bg-gradient-to-r ${gradientColors} bg-clip-text text-transparent transition-all duration-300`,
      outlined:
        "text-transparent bg-clip-text bg-gradient-to-r from-current to-current [text-shadow:_0_0_1px_rgb(0_0_0_/_40%)] transition-all duration-300",
      minimal: "opacity-90 hover:opacity-100 transition-all duration-300",
    };
    return styles[variant];
  }, [variant, gradientColors]);

  // Memoize text splitting to avoid unnecessary recalculations
  const splitText = useMemo(() => {
    const text = typeof children === "string" ? children : "";

    return text.split(/(\s+)/).map((segment, index) => {
      // Preserve whitespace as-is
      if (/^\s+$/.test(segment)) {
        return (
          <React.Fragment key={`space-${index}`}>{segment}</React.Fragment>
        );
      }

      return (
        <span
          className={`inline-block word transition-all duration-200 hover:scale-105 ${
            enableShadow ? "drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]" : ""
          }`}
          key={`word-${index}`}
          style={{
            willChange: "opacity, filter, transform",
            textShadow: enableShadow ? "0 1px 2px rgba(0,0,0,0.1)" : undefined,
          }}
        >
          {segment}
        </span>
      );
    });
  }, [children]);

  // Cleanup function for scroll triggers
  const cleanup = useCallback(() => {
    triggersRef.current.forEach((trigger) => trigger.kill());
    triggersRef.current = [];
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef?.current ?? window;
    const wordElements = el.querySelectorAll<HTMLElement>(".word");

    if (!wordElements.length) return;

    // Clear any existing triggers
    cleanup();

    // Rotation animation
    if (enableRotation) {
      const rotationTween = gsap.fromTo(
        el,
        {
          transformOrigin: "0% 50%",
          rotate: baseRotation,
        },
        {
          ease: customEasing,
          rotate: 0,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: "top bottom",
            end: rotationEnd,
            scrub: true,
            onEnter: () => el.classList.add("scroll-reveal-active"),
          },
        }
      );

      if (rotationTween.scrollTrigger) {
        triggersRef.current.push(rotationTween.scrollTrigger);
      }
    }

    // Opacity and Scale animation
    const animationProps: any = { opacity: baseOpacity };
    const targetProps: any = {
      ease: customEasing,
      opacity: 1,
      stagger: staggerDelay,
      scrollTrigger: {
        trigger: el,
        scroller,
        start: "top bottom-=20%",
        end: wordAnimationEnd,
        scrub: true,
      },
    };

    if (enableScale) {
      animationProps.scale = baseScale;
      targetProps.scale = 1;
    }

    const opacityTween = gsap.fromTo(wordElements, animationProps, targetProps);

    if (opacityTween.scrollTrigger) {
      triggersRef.current.push(opacityTween.scrollTrigger);
    }

    // Blur animation (optional)
    if (enableBlur) {
      const blurTween = gsap.fromTo(
        wordElements,
        { filter: `blur(${blurStrength}px)` },
        {
          ease: customEasing,
          filter: "blur(0px)",
          stagger: staggerDelay,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: "top bottom-=20%",
            end: wordAnimationEnd,
            scrub: true,
          },
        }
      );

      if (blurTween.scrollTrigger) {
        triggersRef.current.push(blurTween.scrollTrigger);
      }
    }

    return cleanup;
  }, [
    scrollContainerRef,
    enableBlur,
    enableRotation,
    baseRotation,
    baseOpacity,
    rotationEnd,
    wordAnimationEnd,
    blurStrength,
    staggerDelay,
    customEasing,
    enableScale,
    baseScale,
    cleanup,
  ]);

  return (
    <Component
      ref={containerRef as any}
      className={`my-8 perspective-1000 ${containerClassName}`.trim()}
      aria-label={typeof children === "string" ? children : undefined}
    >
      <p
        className={`
          text-[clamp(1.8rem,5vw,4rem)] 
          leading-[1.4] 
          font-bold 
          tracking-tight
          ${variantStyles}
          ${
            enableGradient
              ? `bg-gradient-to-r ${gradientColors} bg-clip-text text-transparent`
              : ""
          }
          ${enableShadow ? "drop-shadow-[0_4px_12px_rgba(0,0,0,0.2)]" : ""}
          ${textClassName}
        `.trim()}
      >
        {splitText}
      </p>
    </Component>
  );
};

export default ScrollReveal;
