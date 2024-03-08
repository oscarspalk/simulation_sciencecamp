import * as dat from 'dat.gui'
import * as THREE from 'three'

const size = new THREE.Vector3();
const center = new THREE.Vector3();
const box = new THREE.Box3();

function fitCameraToSelection(camera, controls, selection, fitOffset = 1.3) {
  box.makeEmpty();
  for(const object of selection) {
    box.expandByObject(object);
  }
  
  box.getSize(size);
  box.getCenter(center );
  
  const maxSize = Math.max(size.x, size.y, size.z);
  const fitHeightDistance = maxSize / (2 * Math.atan(Math.PI * camera.fov / 360));
  const fitWidthDistance = fitHeightDistance / camera.aspect;
  const distance = fitOffset * Math.max(fitHeightDistance, fitWidthDistance);
  
  const direction = controls.target.clone()
    .sub(camera.position)
    .normalize()
    .multiplyScalar(distance);

  //controls.maxDistance = distance * 10;
  controls.target.copy(center);
  //camera.near = distance / 100;
  //camera.far = distance * 100;
  camera.updateProjectionMatrix();

  camera.position.copy(controls.target).sub(direction);
  
  controls.update();
}

function initGUI(planets, planetModels, camera, controls, onSelectPlanet, toggleRunning) {
    const gui = new dat.GUI()
    const planetFolder = gui.addFolder("Planeter")
    for (let i = 0; i < planets.length; i++) {
        let planet = planets[i]
        let planetModel = planetModels[i]
        let selectButton = {}
        selectButton[planet.name] = function () {
            onSelectPlanet(i)
            fitCameraToSelection(camera,controls, [planetModel])
        }

        planetFolder.add(selectButton, planet.name)
    }
    gui.add(
      {
        pause:function (){
          toggleRunning()
        }
      }, 'pause'
    )
}

export { initGUI }