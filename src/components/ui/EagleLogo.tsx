import React from "react";

interface EagleLogoProps {
  className?: string;
  size?: number;
  color?: string;
  accentColor?: string;
}

/**
 * Official Eagle Technology Logo (mark + geometric EAGLE wordmark).
 * Geometry matches the official Eagle Technology emblem: right-facing eagle
 * profile with 7 circuit-node wing terminals, dual chevron base, and
 * geometric sans-serif wordmark.
 */
export function EagleLogo({
  className = "",
  size = 110,
  color = "currentColor",
  accentColor,
}: EagleLogoProps) {
  const nodeColor = accentColor ?? color;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 314 192"
      width={size}
      height={Math.round(size * (192 / 314))}
      className={className}
      aria-label="Eagle Technology logo"
      role="img"
    >
      <g
        fill="none"
        stroke={color}
        strokeWidth="6.5"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      >
        {/* Upper wing bars + right-facing eagle head */}
        <path d="M29 29 L56 68 H135 L149 25 L176 23 L181 35 L170 38 L178 68 H258 L285 29" />
        {/* Inner chest V */}
        <path d="M135 68 L157 93 L178 68" />
        {/* Center chest circuit stem */}
        <line x1="157" y1="93" x2="157" y2="61" />
        {/* Secondary branches & upper chevron */}
        <path d="M61 37 L94 83 H130 L157 110 L184 83 H219 L224 77" />
        <line x1="92" y1="47" x2="115" y2="83" />
        <line x1="253" y1="37" x2="234" y2="68" />
        <line x1="222" y1="47" x2="199" y2="83" />
      </g>

      {/* Bottom detached V chevron */}
      <path
        d="M128 96 L157 125 L186 96 V105 L157 134 L128 105 Z"
        fill={color}
      />

      {/* 7 Circuit nodes */}
      <g fill={nodeColor}>
        <circle cx="29" cy="29" r="8.5" />
        <circle cx="61" cy="37" r="8.5" />
        <circle cx="92" cy="47" r="8.5" />
        <circle cx="157" cy="61" r="8" />
        <circle cx="222" cy="47" r="8.5" />
        <circle cx="253" cy="37" r="8.5" />
        <circle cx="285" cy="29" r="8.5" />
      </g>

      {/* Geometric EAGLE wordmark */}
      <g fill={color}>
        <path d="M44 145 H70 V150 H50 V156 H66 V161 H50 V167 H70 V172 H44 Z" />
        <path
          d="M99 145 H120 V172 H114 V162 H99 V172 H93 V151 Z M99 150 V157 H114 V150 Z"
          fillRule="evenodd"
        />
        <path d="M149 145 H171 V150 H150 V167 H166 V161 H158 V156 H172 V167 L167 172 H149 L144 167 V150 Z" />
        <path d="M195 145 H201 V167 H223 V172 H195 Z" />
        <path d="M244 145 H270 V150 H250 V156 H266 V161 H250 V167 H270 V172 H244 Z" />
      </g>
    </svg>
  );
}

/** Compact Eagle Technology emblem without the wordmark. */
export function EagleLogoMark({
  className = "",
  size = 56,
  color = "currentColor",
  accentColor,
}: EagleLogoProps) {
  const nodeColor = accentColor ?? color;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 314 145"
      width={size}
      height={Math.round(size * (145 / 314))}
      className={className}
      aria-label="Eagle Technology emblem"
      role="img"
    >
      <g
        fill="none"
        stroke={color}
        strokeWidth="6.5"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      >
        <path d="M29 29 L56 68 H135 L149 25 L176 23 L181 35 L170 38 L178 68 H258 L285 29" />
        <path d="M135 68 L157 93 L178 68" />
        <line x1="157" y1="93" x2="157" y2="61" />
        <path d="M61 37 L94 83 H130 L157 110 L184 83 H219 L224 77" />
        <line x1="92" y1="47" x2="115" y2="83" />
        <line x1="253" y1="37" x2="234" y2="68" />
        <line x1="222" y1="47" x2="199" y2="83" />
      </g>
      <path
        d="M128 96 L157 125 L186 96 V105 L157 134 L128 105 Z"
        fill={color}
      />
      <g fill={nodeColor}>
        <circle cx="29" cy="29" r="8.5" />
        <circle cx="61" cy="37" r="8.5" />
        <circle cx="92" cy="47" r="8.5" />
        <circle cx="157" cy="61" r="8" />
        <circle cx="222" cy="47" r="8.5" />
        <circle cx="253" cy="37" r="8.5" />
        <circle cx="285" cy="29" r="8.5" />
      </g>
    </svg>
  );
}
