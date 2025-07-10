import React from 'react';
import Image from "next/legacy/image";

const partnerLogos = [
  { src: '/logos/partners/emirates.png', alt: 'Emirates', width: 151, height: 57 },
  { src: '/logos/partners/lufthansa.png', alt: 'Lufthansa', width: 223, height: 57 },
  { src: '/logos/partners/qatar.png', alt: 'Qatar Airways', width: 139, height: 57 },
  { src: '/logos/partners/swiss.png', alt: 'Swiss', width: 169, height: 57 },
  { src: '/logos/partners/turkish.png', alt: 'Turkish Airlines', width: 146, height: 57 },
  { src: '/logos/partners/united.png', alt: 'United Airlines', width: 227, height: 57 },
];

const PartnerAirlinesSection = () => {
  return (
    <section className="py-8 bg-[#F0FBFA]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center gap-8 flex-wrap">
          {partnerLogos.map((logo) => (
            <div key={logo.alt} className="relative opacity-40" style={{ width: logo.width, height: logo.height }}>
              <Image
                src={logo.src}
                alt={logo.alt}
                layout="fill"
                objectFit="contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerAirlinesSection; 