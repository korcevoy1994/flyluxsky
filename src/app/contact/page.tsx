import Image from 'next/image'
import Navbar from '@/components/navbar'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F0FBFA]">
      <section className="relative w-full bg-[#0ABAB5]">
        <div className="absolute inset-0 -z-10 bg-[#0ABAB5]" />
        <Navbar isDarkBackground={true} />

        <div className="mx-auto max-w-[1280px] px-4 pt-16 pb-16 md:pt-24 md:pb-24 grid grid-cols-1 lg:grid-cols-[493px_1fr] items-stretch gap-10 lg:gap-[205px]">
          {/* Left: Title, Copy, Stats */}
          <div className="text-white self-stretch flex flex-col h-full">
            <h1 className="font-poppins font-bold text-[34px] md:text-[50px] leading-[1.5] capitalize">contact us</h1>
            <p className="mt-3 text-[16px] leading-[1.5] max-w-[493px]">
              At Fly Lux Sky, we help you book business-class flights that fit your needs. Whether you’re planning a trip, looking for special fares, or need support, our team of travel advisors is available 24/7 to assist you.
            </p>

            <div className="mt-8 lg:mt-auto flex flex-wrap items-end gap-4 pb-0">
              <div className="bg-white text-[#0D2B29] rounded-[18px] px-4 py-3 md:px-5 md:py-4 text-center shadow-[0_4px_10px_rgba(0,46,52,0.06)]">
                <div className="font-poppins font-semibold text-[20px] md:text-[24px] leading-none">250+</div>
                <div className="mt-1 font-poppins text-[14px] md:text-[16px]">Destinations</div>
              </div>
              <div className="bg-white text-[#0D2B29] rounded-[18px] px-4 py-3 md:px-5 md:py-4 text-center shadow-[0_4px_10px_rgba(0,46,52,0.06)]">
                <div className="font-poppins font-semibold text-[20px] md:text-[24px] leading-none">10, 000+</div>
                <div className="mt-1 font-poppins text-[14px] md:text-[16px]">Happy Travelers</div>
              </div>
              <div className="bg-white text-[#0D2B29] rounded-[18px] px-4 py-3 md:px-5 md:py-4 text-center shadow-[0_4px_10px_rgba(0,46,52,0.06)]">
                <div className="font-poppins font-semibold text-[20px] md:text-[24px] leading-none">50+</div>
                <div className="mt-1 font-poppins text-[14px] md:text-[16px]">Top Airlines</div>
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div className="hidden lg:block self-stretch">
            <div className="rounded-2xl overflow-hidden h-[461px] w-[582px]">
              <Image src="/images/contact/contact-hero.png" alt="contact" width={582} height={461} className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact info + form */}
      <section className="w-full">
        <div className="relative mx-auto max-w-[1280px] px-4 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Divider line on desktop */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#0D2B29]/10" />

          {/* Left: Contact information */}
          <div>
            <h3 className="text-[#0D2B29] font-poppins text-[28px] md:text-[32px] font-semibold">Our Location:</h3>
            <div className="mt-4 text-[#0D2B29] font-inter leading-relaxed">
              <p>7901 4TH ST N STE 102</p>
              <p>Saint Petersburg,</p>
              <p>Florida, 33702,</p>
              <p>United States</p>
            </div>

            <h3 className="mt-8 text-[#0D2B29] font-poppins text-[28px] md:text-[32px] font-semibold">Phone:</h3>
            <div className="mt-4 text-[#0D2B29] font-inter leading-relaxed">
              <p>
                General: <a className="underline" href="tel:+18888307444">+1 (888) 830-7444</a>
              </p>
              <p>
                Support: <a className="underline" href="tel:+18884041154">+1 (888) 404-1154</a>
              </p>
            </div>

            <h3 className="mt-8 text-[#0D2B29] font-poppins text-[28px] md:text-[32px] font-semibold">Email Address:</h3>
            <div className="mt-4 text-[#0D2B29] font-inter leading-relaxed">
              <p>Email: <a className="underline" href="mailto:support@luxeskies.com">support@luxeskies.com</a></p>
            </div>

            <div className="mt-6 flex items-center gap-3 text-[#0D2B29]">
              <Image src="/icons/footer/whatsapp.svg" alt="WhatsApp" width={22} height={22} />
              <span className="font-inter">WhatsApp</span>
            </div>
            <div className="mt-2">
              <a href="#" className="underline text-[#0D2B29] font-inter">Start a Conversation</a>
            </div>
          </div>

          {/* Right: Contact form */}
          <div>
            <h3 className="text-[#0D2B29] font-poppins text-[34px] md:text-[40px] font-semibold">Have A Question?</h3>
            <p className="mt-3 text-[#0D2B29] font-inter">
              Submit your inquiry below, and one of our expert advisors will respond within 1 hour.
            </p>

            <form className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="block">
                  <span className="block text-[#0D2B29] font-inter">Full name</span>
                  <input type="text" className="mt-2 w-full bg-transparent border-b border-[#0D2B29]/30 focus:border-[#0ABAB5] outline-none py-2" />
                </label>
                <label className="block">
                  <span className="block text-[#0D2B29] font-inter">Email address</span>
                  <input type="email" className="mt-2 w-full bg-transparent border-b border-[#0D2B29]/30 focus:border-[#0ABAB5] outline-none py-2" />
                </label>
                <label className="block">
                  <span className="block text-[#0D2B29] font-inter">Phone number</span>
                  <input type="tel" className="mt-2 w-full bg-transparent border-b border-[#0D2B29]/30 focus:border-[#0ABAB5] outline-none py-2" />
                </label>
                <label className="block">
                  <span className="block text-[#0D2B29] font-inter">Preferred destination</span>
                  <input type="text" className="mt-2 w-full bg-transparent border-b border-[#0D2B29]/30 focus:border-[#0ABAB5] outline-none py-2" />
                </label>
              </div>

              <label className="block mt-6">
                <span className="block text-[#0D2B29] font-inter">Message</span>
                <textarea rows={3} className="mt-2 w-full bg-transparent border-b border-[#0D2B29]/30 focus:border-[#0ABAB5] outline-none py-2" />
              </label>

              <div className="mt-8">
                <button type="submit" className="w-full md:w-auto px-10 py-4 bg-[#EC5E39] text-white font-poppins font-semibold rounded-2xl shadow-[0_6px_18px_rgba(236,94,57,0.35)] cursor-pointer transition-all hover:brightness-95">
                  SEND
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

