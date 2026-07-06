"use client";

// Small reusable historic dotted pattern component
// Can be used for visual flair — constellations, chamber marks, etc.

export function DottedConstellation({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const lines =
    size === "lg"
      ? [
          "·   ·     ·   ·     ·",
          "  ·   ·     ·   ·   ",
          "·     ·   ·     ·   ",
          "  ·   ·     ·   ·   ",
        ]
      : size === "sm"
      ? ["·   ·   ·", "  ·   ·  "]
      : ["·   ·     ·   ·", "  ·   ·     ·  "];

  return (
    <pre
      className="ascii-dots select-none"
      style={{
        fontSize: size === "lg" ? "11px" : "9px",
        lineHeight: size === "lg" ? "7px" : "6px",
        letterSpacing: "4px",
      }}
      aria-hidden
    >
      {lines.join("\n")}
    </pre>
  );
}
