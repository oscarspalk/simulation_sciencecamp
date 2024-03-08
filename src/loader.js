import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


async function loadPlanets(scene, planets) {
    var gltfLoader = new GLTFLoader();
    let planetModels = []
    for (let i = 0; i < planets.length; i++) {
        let planet = planets[i]
        let planetName = planet.name
        let planetScene = await gltfLoader.loadAsync(`planets/${planetName}.glb`)
        let model = planetScene.scene.children[0]
    
        let scale = planet.radius/1000.0
        model.scale.multiplyScalar(scale)
        
        model.position.set(0, 0, i * 149000000/3)
        planetModels.push(model)
        scene.add(model)
    }
    return planetModels
}

export {loadPlanets}