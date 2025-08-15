"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import Image from 'next/image'

type Direction = 'left' | 'right'

interface MarqueeRowProps {
  items: string[]
  direction?: Direction
  speedPxPerSec?: number
  itemSize?: number
}

function MarqueeRow({
  items,
  direction = 'left',
  speedPxPerSec = 80,
  itemSize = 80,
}: MarqueeRowProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  const [halfWidth, setHalfWidth] = useState<number>(0)

  // Duplicate items for seamless loop
  const data = useMemo(() => [...items, ...items], [items])

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const compute = () => {
      const w = Math.floor(el.scrollWidth / 2)
      setHalfWidth(w)
    }
    compute()
    const ro = new ResizeObserver(() => compute())
    ro.observe(el)
    window.addEventListener('resize', compute)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', compute)
    }
  }, [items])

  useEffect(() => {
    if (!halfWidth) return
    const distance = halfWidth
    const duration = Math.max(1, distance / speedPxPerSec)
    const from = direction === 'left' ? 0 : -distance
    const to = direction === 'left' ? -distance : 0
    controls.set({ x: from })
    controls.start({
      x: to,
      transition: { duration, ease: 'linear', repeat: Infinity, repeatType: 'loop' },
    })
  }, [controls, halfWidth, direction, speedPxPerSec])

  return (
    <div ref={wrapperRef} className="overflow-hidden w-full">
      <motion.div ref={contentRef} animate={controls} className="flex will-change-transform" style={{ columnGap: 16 }}>
        {data.map((src, idx) => (
          <div key={idx} className="rounded-full overflow-hidden flex-shrink-0" style={{ width: itemSize, height: itemSize }}>
            <Image src={src} alt="client" width={itemSize} height={itemSize} className="w-full h-full object-cover" />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function ClientsMarquee() {
  const avatars = Array.from({ length: 35 }, (_, i) => `/images/reviews/clients/client-${i + 1}.png`)
  const ITEM_SIZE = 80
  const GAP_PX = 16

  const [minCount, setMinCount] = useState<number>(16)
  useEffect(() => {
    const calc = () => {
      const vw = Math.max(320, window.innerWidth || 0)
      const perRow = Math.ceil(vw / (ITEM_SIZE + GAP_PX)) + 2
      setMinCount(perRow)
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  const items = useMemo(() => Array.from({ length: minCount }, (_, i) => avatars[i % avatars.length]), [avatars, minCount])

  return (
    <section className="w-full px-0 py-16 relative overflow-hidden">

      <div className="mx-auto max-w-[1280px] px-4">
        <h2 className="text-center text-[#0D2B29] font-poppins font-bold text-[32px] md:text-[50px] leading-[1.1]">What our clients say</h2>
      </div>

      <div className="mt-6 space-y-4">
        <MarqueeRow items={items} direction="left" itemSize={ITEM_SIZE} />
        <MarqueeRow items={items} direction="right" itemSize={ITEM_SIZE} />
      </div>
    </section>
  )
}

