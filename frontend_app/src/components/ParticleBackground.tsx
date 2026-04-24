import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  layer: number
}

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    const pointer = { x: -9999, y: -9999 }
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const particleCount = Math.min(110, Math.floor(window.innerWidth / 16))
    const particles: Particle[] = Array.from({ length: particleCount }, () => {
      const layer = Math.random()

      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * (0.18 + layer * 0.18),
        vy: (Math.random() - 0.5) * (0.18 + layer * 0.18),
        radius: 0.7 + layer * 1.9,
        opacity: 0.06 + layer * 0.16,
        layer,
      }
    })

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
    }

    const onPointerLeave = () => {
      pointer.x = -9999
      pointer.y = -9999
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerleave', onPointerLeave)

    const drawGlow = (x: number, y: number, radius: number, color: string, opacity: number) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
      gradient.addColorStop(0, color.replace('OPACITY', `${opacity}`))
      gradient.addColorStop(1, color.replace('OPACITY', '0'))
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      drawGlow(window.innerWidth * 0.18, window.innerHeight * 0.2, 180, 'rgba(0,230,118,OPACITY)', 0.05)
      drawGlow(window.innerWidth * 0.86, window.innerHeight * 0.78, 220, 'rgba(250,204,21,OPACITY)', 0.035)
      drawGlow(window.innerWidth * 0.72, window.innerHeight * 0.18, 160, 'rgba(176,176,200,OPACITY)', 0.03)

      for (const particle of particles) {
        particle.x += particle.vx
        particle.y += particle.vy

        const dx = pointer.x - particle.x
        const dy = pointer.y - particle.y
        const distance = Math.hypot(dx, dy)

        if (distance < 140) {
          particle.x -= dx * 0.0014 * particle.layer
          particle.y -= dy * 0.0014 * particle.layer
        }

        if (particle.x < -40) particle.x = window.innerWidth + 40
        if (particle.x > window.innerWidth + 40) particle.x = -40
        if (particle.y < -40) particle.y = window.innerHeight + 40
        if (particle.y > window.innerHeight + 40) particle.y = -40

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.layer > 0.72
          ? `rgba(0, 230, 118, ${particle.opacity})`
          : `rgba(160, 170, 255, ${particle.opacity})`
        ctx.fill()
      }

      for (let i = 0; i < particles.length; i += 1) {
        const source = particles[i]

        for (let j = i + 1; j < particles.length; j += 1) {
          const target = particles[j]
          const dx = source.x - target.x
          const dy = source.y - target.y
          const distance = Math.hypot(dx, dy)

          if (distance > 94) continue

          ctx.beginPath()
          ctx.moveTo(source.x, source.y)
          ctx.lineTo(target.x, target.y)
          ctx.strokeStyle = `rgba(86, 93, 142, ${(1 - distance / 94) * 0.12})`
          ctx.lineWidth = 0.6
          ctx.stroke()
        }
      }

      raf = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        opacity: 0.92,
      }}
    />
  )
}

export default ParticleBackground
