import * as dat from 'dat.gui'


function initGUI(planets, planetModels, camera){
    const gui = new dat.GUI()
    const planetFolder = gui.addFolder("Planeter")
    for(let i = 0; i < planets.length; i++){
        let planet = planets[i]
        let planetModel = planetModels[i]
        let selectButton = {}
        selectButton[planet.name] = function(){
            let x = camera.position.x
            let radius = planet.radius
            let multiplier = x/radius
            console.log(multiplier)
            camera.position.y = planetModel.position.z
            camera.fov = 75
            camera.fov /= multiplier
            camera.updateProjectionMatrix();
            camera.lookAt(planetModel.position)
        }
    
        planetFolder.add(selectButton,planet.name)
    }
    planetFolder.open()
}

export {initGUI}