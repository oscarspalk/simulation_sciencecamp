import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { initLabelRender } from './label_renderer';
import { initGUI } from './gui';
import { loadPlanets } from './loader';
import { parseData } from './data';

async function start(){

    const loader = new THREE.FileLoader();
    const dataCSV = await loader.loadAsync("data/out.csv")
    const config = await loader.loadAsync("data/config.json")
    const planetsJSON = await loader.loadAsync("planets.json")
    
    const parsedData = parseData(dataCSV, config)
    
    const keys = Object.keys(parsedData.datas)
    const planets = JSON.parse(planetsJSON).filter((e) => keys.includes(e.name))
    
    // Canvas
    const canvas = document.querySelector('canvas.webgl')
    
    // Scene
    const scene = new THREE.Scene()
    
    scene.background = new THREE.Color(0x333333)
    
    const planetModels = await loadPlanets(scene, planets, parsedData.datas)
    
    let activePlanet = 0
    let running = true
    
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
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 800000
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
    
    
    /**
     * Animate
     */
    
    
    const clock = new THREE.Clock()
    
    function render(){
        renderer.render(scene, camera)
    }
    
    // Debug
    
    let controls =new  OrbitControls(camera, canvas)
    
    function selectPlanet(planet){
        activePlanet = planet
    }
    
    const axesHelper = new THREE.AxesHelper( 40000000 );
    scene.add( axesHelper );
    
    
    initGUI(planets, planetModels, camera, controls, selectPlanet, toggleRunning)
    
    function toggleRunning(){
        running = !running
    }
    
    let t = 0
    
    let result = initLabelRender(scene, planets, planetModels)
    let labelRenderer = result.labelRenderer
    let labels = result.labels
    
    const tick = () => {
    
        const elapsedTime = clock.getElapsedTime()
        if(running){
        t += 1
        }
    
        let datas = parsedData.datas
        let labelPosition = new THREE.Vector3()
    
        for(let i = 0; i < planets.length; i++){
    
            let planetName = planets[i].name
            let pos_vec = datas[planetName][t].clone()
            let scaled = pos_vec.multiplyScalar(Math.pow(10, -3))
            let planetModel = planetModels[i]
            planetModel.position.set(scaled.x, scaled.y, scaled.z)
            planetModel.updateMatrix()
            let label = labels[i]
            let planet = planets[i]
            let radius = planet.radius
            let oldPosition = planetModel.position
            labelPosition.x = oldPosition.x
            labelPosition.y = oldPosition.y
            labelPosition.z = oldPosition.z
    
            planetModel.position.copy(labelPosition)
            label.position.copy(labelPosition);
        }
    
        // Render
        controls.update()
        render()
        labelRenderer.render(scene, camera)
        
    
        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }
    
    tick()
}

start()