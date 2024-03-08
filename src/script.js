import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { initLabelRender } from './label_renderer';
import { initGUI } from './gui';
import { loadPlanets } from './loader';

const loader = new THREE.FileLoader();
const planetsJSON = await loader.loadAsync("planets.json")
const planets = JSON.parse(planetsJSON)

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

scene.background = new THREE.Color(0x333333)

const planetModels = await loadPlanets(scene, planets)

let activePlanet = 0

// Lights

const pointLight = new THREE.AmbientLight(0xffffff, 3.0)
scene.add(pointLight)

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
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 100, Math.pow(10, 10))
camera.position.x = 800000
camera.position.y = 0
camera.position.z = 0
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Init labelrenderer
 */

let labelRenderer = initLabelRender(scene, planets, planetModels)

/**
 * Animate
 */


const clock = new THREE.Clock()

function render(){
    renderer.render(scene, camera)
    labelRenderer.render(scene, camera)
}

// Debug

let controls =new  OrbitControls(camera, canvas)

function selectPlanet(planet){
    activePlanet = planet
}


initGUI(planets, planetModels, camera, controls, selectPlanet)


const tick = () => {

    const elapsedTime = clock.getElapsedTime()
    // Render
    controls.update()
    render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()