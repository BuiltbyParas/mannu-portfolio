import type { ReactNode } from "react";
import type { FormId } from "./forms";
import { RibbonSVG } from "./RibbonSVG";

/**
 * A place on the page where the ribbon rests. The 3D scene reads its box from
 * `data-sculpture`; the still SVG inside stands in whenever the scene does not
 * run. `aspect` is the box's typical width ÷ height, used only by the still;
 * `phoneAspect` adds a second still for slots that change shape on phones.
 * `live` makes the scene read the slot's box on every frame instead of once
 * per layout check, for a slot that moves on its own (the opening's name).
 * `stageAt` places a slot on the opening's stage (lib/stage.ts): the moment
 * of the stage at which its form rests. `boxId` names a live slot's box where
 * the form's own name is already taken (the landing's, which rests the same
 * form as the opening's). `children` are further stills.
 */
export function Slot({
  form,
  aspect,
  phoneAspect,
  className,
  live,
  stageAt,
  boxId,
  children,
}: {
  form: FormId;
  aspect: number;
  phoneAspect?: number;
  className?: string;
  live?: boolean;
  stageAt?: number;
  boxId?: string;
  children?: ReactNode;
}) {
  const id = live ? (boxId ?? `slot-${form}`) : undefined;
  return (
    <div id={id} className={`slot ${className ?? ""}`} data-sculpture={form} data-sculpture-box={id} data-stage-at={stageAt} aria-hidden="true">
      <RibbonSVG form={form} aspect={aspect} className={`slot-still${phoneAspect ? " slot-still-wide" : ""}`} />
      {phoneAspect ? <RibbonSVG form={form} aspect={phoneAspect} className="slot-still slot-still-phone" /> : null}
      {children}
    </div>
  );
}
