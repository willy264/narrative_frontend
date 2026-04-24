import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

import ParticleBackground from './components/ParticleBackground'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Stats from './components/Stats'
import AgentShowcase from './components/AgentShowcase'
import HorizontalPipeline from './components/HorizontalPipeline'
import ConvictionMeter from './components/ConvictionMeter'
import TrustBar from './components/TrustBar'
import Features from './components/Features'
import CTA from './components/CTA'
import Footer from './components/Footer'
import { setLenisInstance } from './utils/scroll'

gsap.registerPlugin(ScrollTrigger)

const App = () => {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.1,
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.05,
    })

    setLenisInstance(lenis)
    lenis.on('scroll', ScrollTrigger.update)

    const update = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
      lenis.destroy()
      setLenisInstance(null)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#07070F' }}>
      <ParticleBackground />
      <Navbar />

      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <Marquee />
        <Stats />
        <AgentShowcase />
        <ConvictionMeter />
        <HorizontalPipeline />
        <TrustBar />
        <Features />
        {/* <CTA /> */}
      </main>

      <Footer />
    </div>
  )
}

export default App
