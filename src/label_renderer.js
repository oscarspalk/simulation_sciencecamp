import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import * as THREE from 'three'

function initLabelRender(scene, planets, planetModels) {
    let labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.pointerEvents = 'none';
    document.getElementById('container').appendChild(labelRenderer.domElement);
    let root = new THREE.Group()
    scene.add(root)
    let labelPosition = new THREE.Vector3()
    for (let i = 0; i < planets.length; i++) {
        let planet = planets[i]
        let planetModel = planetModels[i]
        const text = document.createElement('div');
        text.className = 'label';
        text.style.color = '#ffffff';
        text.textContent = planet.displayName;
        const label = new CSS2DObject(text);
        let radius = planet.radius
        let oldPosition = planetModel.position
        labelPosition.x = oldPosition.x
        labelPosition.y = oldPosition.y
        labelPosition.z = oldPosition.z

        planetModel.position.copy(labelPosition)
        labelPosition.add(new THREE.Vector3(0, 1 , 0))
        label.position.copy(labelPosition);
        root.add(label);
    }
    return labelRenderer
}

export {initLabelRender}