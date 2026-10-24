/**
 * Sets a heading with its last few words tinted (`.tint`, coloured per
 * section in globals.css). The tint is the words' resting colour, so it shows
 * without scripts; motion/reveals.ts only decides how they arrive at it.
 */
export function Tint({ text, words = 1 }: { text: string; words?: number }) {
  const parts = text.trim().split(" ");
  if (parts.length <= words) return <span className="tint">{text}</span>;
  return (
    <>
      {parts.slice(0, -words).join(" ")} <span className="tint">{parts.slice(-words).join(" ")}</span>
    </>
  );
}
