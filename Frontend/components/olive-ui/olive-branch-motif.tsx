export function OliveBranchMotif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 60"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M2 30c30-18 60-18 90 0s60 18 90 0"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.55"
      />
      {[18, 44, 70, 96, 122, 148, 174].map((x, i) => (
        <ellipse
          key={x}
          cx={x}
          cy={i % 2 === 0 ? 22 : 38}
          rx="7"
          ry="3.6"
          transform={`rotate(${i % 2 === 0 ? -20 : 20} ${x} ${
            i % 2 === 0 ? 22 : 38
          })`}
          fill="currentColor"
          opacity="0.5"
        />
      ))}
      <circle cx="206" cy="30" r="4" fill="currentColor" opacity="0.8" />
    </svg>
  );
}