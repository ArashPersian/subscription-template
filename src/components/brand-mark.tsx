import logoUrl from "@/assets/brand/logo.png";

export function BrandMark() {
  return (
    <div className="brand-mark" aria-hidden="true">
      <div className="brand-mark__glow" />
      <img
        src={logoUrl}
        alt=""
        className="brand-mark__image"
        draggable={false}
      />
    </div>
  );
}
