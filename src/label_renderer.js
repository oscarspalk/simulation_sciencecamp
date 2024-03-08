import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import * as THREE from 'three'

function initLabelRender(scene, planets, planetModels) {
    let labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.pointerEvents = 'none';
    document.getElementById('container').appendChild(labelRenderer.domElement);
    let labels = []
    let root = new THREE.Group()
    scene.add(root)
    for (let i = 0; i < planetModels.length; i++) {
        let planet = planets[i]
        let planetModel = planetModels[i]
        const text = document.createElement('div');
        text.className = 'label';
        text.style.color = '#ffffff';
        text.textContent = planet.displayName;
        const label = new CSS2DObject(text);
        labels.push(label)
        root.add(label);
    }
    return {
        labelRenderer: labelRenderer,
        labels: labels
    } 
}

export {initLabelRender}