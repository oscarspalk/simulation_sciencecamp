import * as THREE from 'three'

function rotate(planetModel, camera, increment){
    let anchorPoint = new THREE.Vector3()
    planetModel.position.copy(anchorPoint)
    let moveDir = new THREE.Vector3(
        anchorPoint.x - camera.position.x,
        anchorPoint.y - camera.position.y,
        anchorPoint.z - camera.position.z
    );
    moveDir.normalize();
    let moveDist = camera.position.distanceTo(anchorPoint);
    /// step 2: move camera to anchor point
    camera.translateOnAxis(moveDir, moveDist);
    let cameraRotation = camera.rotation

    /// step 3: rotate camera
    camera.rotateX(cameraRotation.x);
    camera.rotateY(cameraRotation.y + increment);
    camera.rotateZ(cameraRotation.z);

    /// step4: move camera along the opposite direction
    moveDir.multiplyScalar(-1);
    camera.translateOnAxis(moveDir, moveDist);
}

export {rotate}