import "./PhotoBlob.css";

export default function PhotoBlob({ src, alt = "", className = "" }) {
  return (
    <div className={`blob ${className}`} role={src ? undefined : "presentation"}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" />
      ) : (
        <span className="blob__placeholder" aria-hidden="true">Photo</span>
      )}
    </div>
  );
}