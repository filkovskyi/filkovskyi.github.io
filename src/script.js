import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })
dat.GUI.toggleHide();

const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('#10235c');

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(4, 4, 512, 512)

debugObject.depthColor = '#10235c'
debugObject.surfaceColor = '#75dbff'

// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms: {
        uTime: { value: 0 },

        uBigWaveElevation: { value: 0.2 },
        uBigWaveFrequency: { value: new THREE.Vector2(4, 1.5) },
        uBigWaveSpeed: { value: 0.75 },

        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 3.0 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallIterations: { value: 4.0 },

        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uColorOffset: { value: 0.25 },
        uColorMultiplier: { value: 2 },
    }
})

gui.add(waterMaterial.uniforms.uBigWaveElevation, 'value')
    .min(0)
    .max(1)
    .step(0.01)
    .name('Wave Elevation')

gui.add(waterMaterial.uniforms.uBigWaveSpeed, 'value')
    .min(0)
    .max(1)
    .step(0.01)
    .name('Wave Frequency Speed')

gui.add(waterMaterial.uniforms.uColorOffset, 'value')
    .min(0)
    .max(1)
    .step(0.01)
    .name('Wave Color Offset')

gui.add(waterMaterial.uniforms.uColorMultiplier, 'value')
    .min(0)
    .max(10)
    .step(0.1)
    .name('Wave Color Multiplier')

gui.add(waterMaterial.uniforms.uBigWaveFrequency.value, 'x')
    .min(0)
    .max(20)
    .step(0.01)
    .name('Wave Frequency X')

gui.add(waterMaterial.uniforms.uBigWaveFrequency.value, 'y')
    .min(0)
    .max(20)
    .step(0.01)
    .name('Wave Frequency Y')

gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value')
    .min(0)
    .max(1)
    .step(0.01)
    .name('Small Wave Elevation')

gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value')
    .min(0)
    .max(1)
    .step(0.01)
    .name('Small Wave Frequency')

gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value')
    .min(0)
    .max(1)
    .step(0.01)
    .name('Small Wave Frequency Speed')

gui.add(waterMaterial.uniforms.uSmallIterations, 'value')
    .min(0)
    .max(10)
    .step(1)
    .name('Small Wave Iterations')

gui.addColor(debugObject, 'depthColor')
    .name('Depth Color')
    .onChange(() =>
        waterMaterial
            .uniforms
            .uDepthColor
            .value
            .set(debugObject.depthColor)
    )

gui.addColor(debugObject, 'surfaceColor')
    .name('Surface Color')
    .onChange(() =>
        waterMaterial
            .uniforms
            .uSurfaceColor
            .value
            .set(debugObject.surfaceColor)
    )

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enabled = false;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    //Update meterials
    waterMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()