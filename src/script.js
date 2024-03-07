import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new THREE.FileLoader();

const planetsJSON = await loader.loadAsync("planets.json")
const planets = JSON.parse(planetsJSON)
const planetModels = []
console.log(planets)
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

scene.background = new THREE.Color(0x333333)

let reference = null

var gltfLoader = new GLTFLoader();
for(let i = 0; i < planets.length; i++){
    
    let planet = planets[i]
    let planetName = planet.name
    let planetScene = await gltfLoader.loadAsync(`planets/${planetName}.glb`)
    let model = planetScene.scene.children[0]
    if(reference == null){
        reference = planet.radius
    }
    else {
        let multiplier = planet.radius/reference
        //model.scale.set(multiplier, multiplier, multiplier)
    }
    console.log(model)
    model.position.set(i*2500,0,0)
    planetModels.push(model)
    scene.add(model)
}


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

window.addEventListener('resize', () =>
{
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 100, 100000)
camera.position.x = 100
camera.position.y = 100
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

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

var controls = new OrbitControls( camera, renderer.domElement ); 

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()