import Image from "next/legacy/image";

const logos = [
  { src: "/logos/hero/emirates.png", alt: "Emirates", width: 151, height: 58 },
  { src: "/logos/hero/lufthansa.png", alt: "Lufthansa", width: 223, height: 58 },
  { src: "/logos/hero/qatar.png", alt: "Qatar Airways", width: 140, height: 58 },
  { src: "/logos/hero/swiss.png", alt: "Swiss", width: 170, height: 58 },
  { src: "/logos/hero/turkish.png", alt: "Turkish Airlines", width: 147, height: 58 },
  { src: "/logos/hero/united.png", alt: "United Airlines", width: 227, height: 58 },
];

export const HeroLogosSection = () => {
  return (
    <section className="py-8">
      <div className="w-full max-w-[1280px] mx-auto px-2">
        <div className="flex items-center justify-between gap-20">
          {logos.map((logo) => (
            <Image
              key={logo.src}
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className="h-10 w-auto object-contain opacity-15"
            />
          ))}
        </div>
      </div>
    </section>
  );
}; 