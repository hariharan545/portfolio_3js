import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { techKeys, type TechKey } from '../data/techKeys'
import { playPress, playRelease } from '../lib/sound'
import { useMediaQuery } from '../hooks/useMediaQuery'
import type { SectionId } from '../hooks/useActiveSection'

const GRID = 5
const SPACING = 1.08
const CAMERA_DISTANCE = 12.2
const BOARD_HALF_DIAGONAL = 4.3

/**
 * Where the one shared keyboard sits in each section.
 * sx / sy are screen-space offsets (-1..1 of half the viewport), so the layout
 * stays the same at any window size. ry/rx are rotations in radians.
 */
type Pose = { sx: number; sy: number; scale: number; ry: number; rx?: number }

const POSES: Record<SectionId, { desktop: Pose; mobile: Pose }> = {
  // hidden behind the cartoon hero; it pops in when you reach Tech Stack
  home: {
    desktop: { sx: 0.55, sy: -0.5, scale: 0.0001, ry: 0 },
    mobile: { sx: 0, sy: -0.4, scale: 0.0001, ry: 0 },
  },
  skills: {
    desktop: { sx: 0, sy: -0.12, scale: 0.95, ry: Math.PI / 12 },
    mobile: { sx: 0, sy: -0.1, scale: 1, ry: Math.PI / 6 },
  },
  // turned around and peeking in from the top, behind the "Projects" heading
  projects: {
    desktop: { sx: 0, sy: 0.82, scale: 0.55, ry: Math.PI + Math.PI / 3 },
    mobile: { sx: 0, sy: 0.7, scale: 0.6, ry: Math.PI + Math.PI / 3 },
  },
  services: {
    desktop: { sx: 0.78, sy: -0.7, scale: 0.34, ry: -Math.PI / 4, rx: 0.15 },
    mobile: { sx: 0.5, sy: -0.8, scale: 0.4, ry: -Math.PI / 4 },
  },
  // off to the side while you fill the form; keycaps jump
  contact: {
    desktop: { sx: 0.55, sy: -0.2, scale: 0.6, ry: 0 },
    mobile: { sx: 0, sy: 0.62, scale: 0.5, ry: 0 },
  },
}

// graphite caps with an orange diagonal, to match the site theme
const capColor = (i: number) => (i % 6 === 0 ? '#e5322d' : i % 2 ? '#26262b' : '#1a1a1e')

const bounceOut = (x: number) => {
  const n1 = 7.5625
  const d1 = 2.75
  if (x < 1 / d1) return n1 * x * x
  if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75
  if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375
  return n1 * (x -= 2.625 / d1) * x + 0.984375
}

function makeTexture(k: TechKey) {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#ffffff'
  if (k.path) {
    ctx.translate(48, 48)
    ctx.scale(160 / 24, 160 / 24)
    ctx.fill(new Path2D(k.path))
  } else {
    const size = Math.min(110, Math.floor(220 / Math.max(1, k.label.length * 0.62)))
    ctx.font = `bold ${size}px Inter, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(k.label, 128, 134)
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

type KeycapProps = {
  k: TechKey
  index: number
  x: number
  z: number
  pressed: boolean
  revealAt: React.RefObject<number | null>
  section: React.RefObject<SectionId>
  onOver: () => void
  onOut: () => void
  onDown: () => void
}

function Keycap({ k, index, x, z, pressed, revealAt, section, onOver, onOut, onDown }: KeycapProps) {
  const root = useRef<THREE.Group>(null)
  const cap = useRef<THREE.Group>(null)
  const press = useRef(0)
  const texture = useMemo(() => makeTexture(k), [k])

  useFrame(({ clock }, delta) => {
    if (!root.current || !cap.current) return
    const r = revealAt.current
    // keys drop in one after another the first time the keyboard appears
    const t = r === null ? -1 : clock.elapsedTime - r - index * 0.06
    root.current.visible = t >= 0
    const drop = t < 0 ? 0 : 4 * (1 - bounceOut(Math.min(t / 0.9, 1)))
    const jump =
      section.current === 'contact' ? Math.pow(Math.max(0, Math.sin(clock.elapsedTime * 1.6 + index * 0.9)), 6) * 0.7 : 0
    press.current = THREE.MathUtils.damp(press.current, pressed ? -0.16 : 0, 20, delta)
    cap.current.position.y = press.current + drop + jump
  })

  return (
    <group
      ref={root}
      position={[x, 0, z]}
      onPointerOver={(e) => {
        e.stopPropagation()
        onOver()
      }}
      onPointerOut={onOut}
      onPointerDown={(e) => {
        e.stopPropagation()
        onDown()
      }}
    >
      {/* fixed hit box so the hover doesn't flicker while the cap moves */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1, 0.8, 1]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <group ref={cap}>
        <RoundedBox args={[0.92, 0.5, 0.92]} radius={0.14} smoothness={4} position={[0, 0.25, 0]}>
          <meshStandardMaterial color={capColor(index)} roughness={0.36} metalness={0.08} />
        </RoundedBox>
        <mesh position={[0, 0.512, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.62, 0.62]} />
          <meshBasicMaterial map={texture} transparent toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

type BoardProps = {
  sectionRef: React.RefObject<SectionId>
  isMobile: boolean
  active: number | null
  setHover: (i: number | null) => void
  press: (i: number) => void
}

function Board({ sectionRef, isMobile, active, setHover, press }: BoardProps) {
  const group = useRef<THREE.Group>(null)
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const size = useThree((s) => s.size)
  const revealAt = useRef<number | null>(null)
  const spring = useRef({ scale: 0.0001, vel: 0 })
  const basis = useMemo(() => ({ right: new THREE.Vector3(), up: new THREE.Vector3(), fwd: new THREE.Vector3() }), [])
  const offset = ((GRID - 1) * SPACING) / 2

  useFrame(({ clock }, rawDelta) => {
    const g = group.current
    if (!g) return
    const dt = Math.min(rawDelta, 0.05)
    const section = sectionRef.current
    const pose = POSES[section][isMobile ? 'mobile' : 'desktop']
    if (section !== 'home' && revealAt.current === null) revealAt.current = clock.elapsedTime

    // visible half-size of the view at the board's distance
    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * CAMERA_DISTANCE
    const halfW = halfH * (size.width / size.height)
    const fit = Math.min(1, halfW / BOARD_HALF_DIAGONAL)

    camera.updateMatrixWorld()
    camera.matrixWorld.extractBasis(basis.right, basis.up, basis.fwd)
    const tx = basis.right.x * pose.sx * halfW + basis.up.x * pose.sy * halfH
    const ty = basis.right.y * pose.sx * halfW + basis.up.y * pose.sy * halfH
    const tz = basis.right.z * pose.sx * halfW + basis.up.z * pose.sy * halfH
    g.position.x = THREE.MathUtils.damp(g.position.x, tx, 4, dt)
    g.position.y = THREE.MathUtils.damp(g.position.y, ty, 4, dt)
    g.position.z = THREE.MathUtils.damp(g.position.z, tz, 4, dt)

    // a spring (not a plain ease) gives the elastic pop when the keyboard appears
    const sp = spring.current
    sp.vel += (pose.scale * fit - sp.scale) * 70 * dt
    sp.vel *= Math.exp(-6 * dt)
    sp.scale = Math.max(0.0001, sp.scale + sp.vel * dt)
    g.scale.setScalar(sp.scale)

    const sway =
      section === 'skills'
        ? Math.sin(clock.elapsedTime * 0.5) * 0.12
        : section === 'contact'
          ? Math.sin(clock.elapsedTime * 0.6) * 0.5
          : 0
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, pose.ry + sway, 3, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, pose.rx ?? 0, 3, dt)
  })

  return (
    <group ref={group}>
      <RoundedBox args={[5.75, 0.6, 5.75]} radius={0.2} smoothness={4} position={[0, -0.25, 0]}>
        <meshStandardMaterial color="#0b0809" roughness={0.55} metalness={0.25} />
      </RoundedBox>
      {techKeys.map((k, i) => (
        <Keycap
          key={k.name}
          k={k}
          index={i}
          x={(i % GRID) * SPACING - offset}
          z={Math.floor(i / GRID) * SPACING - offset}
          pressed={active === i}
          revealAt={revealAt}
          section={sectionRef}
          onOver={() => setHover(i)}
          onOut={() => setHover(null)}
          onDown={() => press(i)}
        />
      ))}
    </group>
  )
}

function Rig() {
  const camera = useThree((s) => s.camera)
  useEffect(() => {
    camera.position.set(1, 1.07, 1).normalize().multiplyScalar(CAMERA_DISTANCE)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [camera])
  return null
}

type Props = {
  section: SectionId
  /** Called with the key that is hovered or pressed in the Tech Stack section (or null). */
  onActiveChange: (k: TechKey | null) => void
}

/** One fixed 3D keyboard behind the whole page. It moves between poses as sections change. */
export default function KeyboardStage({ section, onActiveChange }: Props) {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const sectionRef = useRef<SectionId>(section)
  const [hover, setHover] = useState<number | null>(null)
  const [pressed, setPressed] = useState<number | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const interactive = section === 'skills'
  // only the Tech Stack section reacts to the pointer and keyboard
  const active = interactive ? (hover ?? pressed) : null

  useEffect(() => {
    sectionRef.current = section
  }, [section])

  const press = (i: number) => {
    if (sectionRef.current !== 'skills') return
    playPress()
    setPressed(i)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setPressed(null)
      playRelease()
    }, 900)
  }

  const onHover = (i: number | null) => {
    if (i !== null && sectionRef.current !== 'skills') return
    setHover((prev) => {
      if (i !== null && prev !== i) playPress()
      return i
    })
  }

  useEffect(() => {
    onActiveChange(active === null ? null : techKeys[active])
  }, [active, onActiveChange])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (sectionRef.current !== 'skills') return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return
      const i = techKeys.findIndex((k) => k.letter === e.key.toLowerCase())
      if (i >= 0) press(i)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <Canvas
      className="!pointer-events-none !fixed inset-0 z-0"
      dpr={[1, 2]}
      camera={{ position: [7, 7.5, 7], fov: 27 }}
      gl={{ antialias: true, alpha: true }}
      // listen on the page so the keys still react while normal content sits above the canvas
      eventSource={document.documentElement}
      eventPrefix="client"
    >
      <Rig />
      <ambientLight intensity={1.15} />
      <directionalLight position={[5, 9, 4]} intensity={2.4} />
      <directionalLight position={[-6, 4, -3]} intensity={1.2} color="#ff4a3d" />
      <Board sectionRef={sectionRef} isMobile={isMobile} active={active} setHover={onHover} press={press} />
    </Canvas>
  )
}
