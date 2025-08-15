import Image from 'next/image'
import Navbar from '@/components/navbar'
import ClientsMarquee from '@/components/clients-marquee'
import ReviewsStaggeredGrid from '@/components/reviews-staggered-grid'

function TrustpilotStars({ count = 5, size = 28 }: { count?: number; size?: number }) {
  const star = (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l2.954 6.101 6.729.978-4.842 4.72 1.143 6.672L12 17.77l-6.0 3.701 1.143-6.672L2.301 9.079l6.745-.978L12 2z" fill="white"/>
    </svg>
  )
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="flex items-center justify-center" style={{ width: size + 8, height: size + 8, backgroundColor: '#00B67A' }}>
          {star}
        </span>
      ))}
    </div>
  )
}

function ReviewsHero() {
  return (
    <section className="relative w-full bg-[#0ABAB5]">
      <div className="absolute inset-0 -z-10 bg-[#0ABAB5]" />
      <Navbar isDarkBackground={true} />

      <div className="mx-auto max-w-[1280px] px-4 pt-28 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-10 lg:gap-[230px] justify-items-center lg:justify-items-stretch">
          {/* Left: Title, Intro, CTA */}
          <div className="text-white text-center lg:text-left flex flex-col items-center lg:items-start">
            <h1 className="font-poppins font-bold text-[32px] md:text-[50px] leading-[1.1] tracking-tight">
              Trusted by Travelers Worldwide
            </h1>
            <p className="mt-6 text-white text-[16px] leading-[1.4] max-w-[595px] text-center lg:text-left">
              Discover why discerning travelers trust Fly Lux Sky for their business-class trips. Our clients appreciate the reliable
              service, competitive fares, and comfort that make every journey easy and enjoyable.
            </p>

            <div className="mt-10">
              <a href="#reviews" className="w-[150px] h-[150px] rounded-full bg-[#EC5E39] text-white flex flex-col items-center justify-center shadow-[0_10px_24px_rgba(236,94,57,0.35)] cursor-pointer mx-auto lg:mx-0">
                <span className="font-poppins text-[16px] font-medium uppercase leading-[1.1] text-center">
                  READ<br/>REVIEWS
                </span>
                <span className="mt-3 inline-flex items-center justify-center w-6 h-6">
                  <Image src="/icons/ph_arrow-left-light.svg" alt="arrow-down" width={24} height={24} />
                </span>
              </a>
            </div>
          </div>

          {/* Right: Ratings block */}
          <div className="flex flex-col items-center text-center gap-4">
            <Image src="/trust.svg" alt="Trustpilot" width={280} height={70} />
            <div className="text-white font-ubuntu text-[24px] leading-[1.1]">98% of Travelers<br/>Love Us on Trustpilot</div>
            <TrustpilotStars />
            <div className="text-white/90 font-ubuntu text-[14px] leading-[1.1]">
              Excellent, Rated 4.9 out of 5. Based on 1101 reviews on Trustpilot
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 -bottom-6 h-12 bg-gradient-to-b from-[#0ABAB5]/20 to-transparent blur-md" />
    </section>
  )
}

export default function ReviewsPage() {
  return (
    <main className="min-h-screen bg-[#F0FBFA]">
      <ReviewsHero />
      <ClientsMarquee />
      <ReviewsStaggeredGrid />
    </main>
  )
}

