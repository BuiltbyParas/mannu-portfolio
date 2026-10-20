import type { FormId } from "./forms";
import { RibbonSVG } from "./RibbonSVG";

/**
 * A place on the page where the ribbon rests. The 3D scene reads its box from
 * `data-sculpture`; the still SVG inside stands in whenever the scene does not
 * run. `aspect` is the box's typical width ÷ height, used only by the still;
 * `phoneAspect` adds a second still for slots that change shape on phones.
 * `live` makes the scene read the slot's box on every frame instead of once
 * per layout check, for a slot that moves on its own (the opening's name).
 */
export function Slot({
  form,
  aspect,
  phoneAspect,
  className,
  live,
}: {
  form: FormId;
  aspect: number;
  phoneAspect?: number;
  className?: string;
  live?: boolean;
}) {
  const id = live ? `slot-${form}` : undefined;
  return (
    <div id={id} className={`slot ${className ?? ""}`} data-sculpture={form} data-sculpture-box={id} aria-hidden="true">
      <RibbonSVG form={form} aspect={aspect} className={`slot-still${phoneAspect ? " slot-still-wide" : ""}`} />
      {phoneAspect ? <RibbonSVG form={form} aspect={phoneAspect} className="slot-still slot-still-phone" /> : null}
    </div>
  );
}
