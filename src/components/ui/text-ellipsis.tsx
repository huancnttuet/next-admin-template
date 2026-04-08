'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface Props {
  /**
   * The text content to display
   */
  children: string;
  /**
   * Additional class names
   */
  className?: string;
  /**
   * Maximum number of lines before truncating
   * @default 1
   */
  lines?: number;
  /**
   * Tooltip placement
   * @default "top"
   */
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * TextEllipsis component that truncates text and shows full text on hover
 *
 * @example
 * ```tsx
 * <TextEllipsis>This is a very long text that will be truncated</TextEllipsis>
 * <TextEllipsis lines={2}>Multi-line text that will be truncated after 2 lines</TextEllipsis>
 * ```
 */
export function TextEllipsis({
  children,
  className,
  lines = 1,
  placement = 'top',
}: Props) {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    // Check if text is truncated
    const checkTruncation = () => {
      if (lines === 1) {
        setIsTruncated(element.scrollWidth > element.clientWidth);
      } else {
        setIsTruncated(element.scrollHeight > element.clientHeight);
      }
    };

    checkTruncation();

    // Recheck on window resize
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [children, lines]);

  const truncateClass =
    lines === 1
      ? 'truncate'
      : `line-clamp-${lines} overflow-hidden text-ellipsis`;

  // Only show tooltip if text is actually truncated
  if (!isTruncated) {
    return (
      <div ref={textRef} className={cn(truncateClass, className)}>
        {children}
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div ref={textRef} className={cn(truncateClass, className)}>
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side={placement}
          className='z-[9999] max-w-xs break-words'
          sideOffset={5}
        >
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
