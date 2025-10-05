import "./icon.scss"

interface Props {
  src: string,
  alt?: string,
  className?: string, // for the icon img i.e. the <img> tag
  size?: 'sm' | 'md' | 'lg', // for the <div> tag
  href?: string,
  onClick?: (...args: any[]) => void,
};

export default function Icon({
  src,
  alt,
  className,
  size = 'md',
  href,
  onClick
}: Props) {
  const containerClass = `icon-container icon-container-${size}`;

  return (
    <>
    {href ?
    <a className={containerClass} href={href} target="_blank">
      <img className={`icon-img ${className}`} src={src} alt={alt || ""} draggable="false"/>
    </a> :
    <div className={containerClass} onClick={onClick}>
      <img className={`icon-img ${className}`} src={src} alt={alt || ""} draggable="false"/>
    </div> }
    </>
  );
}