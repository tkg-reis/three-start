"use strict"

import * as THREE from "./build/three.module.js"
import { OrbitControls } from "./controls/OrbitControls.js"
// シーンがはいっているか

// const scene = new THREE.Scene();
// console.log(scene);

let scene ,camara, renderer, pointLight ,controls;

window.addEventListener('load', init);

function init() {

    scene = new THREE.Scene();
    
    camara = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camara.position.set(0 , 0, 500);
    // マウス操作可能に
    
    renderer = new THREE.WebGLRenderer({
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    // document.querySelector('.gravel').appendChild(renderer.domElement);
    // document.querySelector('.rocks').appendChild(renderer.domElement);
    renderer.render(scene, camara);
    
    controls = new OrbitControls(camara , renderer.domElement);
    controls.update();
    // デクスチャを追加
    let textures = new THREE.TextureLoader().load("./textures/earth.jpg");
    
    let gravelTextures = new THREE.TextureLoader().load("./textures/gravel.jpg");

    let rocksTextures = new THREE.TextureLoader().load("./textures/rocks.jpg");
    // 形を生成・物体の形状を表す物（球体・立方体・）
    let ballGeo = new THREE.SphereGeometry(100, 64, 32);
    let gravelGeo = new THREE.SphereGeometry(100, 64, 32);
    let rocksGeo = new THREE.SphereGeometry(100, 64, 32);

    // 柄・材質を設定
    let ballMaterial = new THREE.MeshPhysicalMaterial({
        map: textures
    });

    let gravelMaterial = new THREE.MeshPhysicalMaterial({
        map: gravelTextures
    });

    let rocksMaterial = new THREE.MeshPhysicalMaterial({
        map: rocksTextures
    });
    // メッシュ ＝＞ ジオメトリ＋マテリアル
    // メッシュ化
    let ballMesh = new THREE.Mesh(ballGeo, ballMaterial);
    scene.add(ballMesh);
    
    
    let gravelMesh = new THREE.Mesh(gravelGeo, gravelMaterial);
    gravelMesh.position.set(250,-100,10);
    scene.add(gravelMesh);

    let rocksMesh = new THREE.Mesh(rocksGeo, rocksMaterial);
    rocksMesh.position.set(-250,-100,10);
    scene.add(rocksMesh);
    // 並行光源の追加
    let directionalLight = new THREE.DirectionalLight(0xffffff , 2);
    directionalLight.position.set(1,1,1);
    scene.add(directionalLight);
    
    // ポイント光源
    pointLight = new THREE.PointLight(0xffffff , 1);
    pointLight.position.set(-200,-200,-200);
    scene.add(pointLight);
    // ポイント光源がどこにあるのかを特定する
    let pointLightHelper = new THREE.PointLightHelper(pointLight ,30);
    scene.add(pointLightHelper);

    window.addEventListener('resize', onWindowResize);

    animate();
}

// browser resize

function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);

    // カメラのアスペクト比をただす
    camara.aspect = window.innerWidth / window.innerHeight;
    camara.updateProjectionMatrix();
}


// ポイント光源を巡回させる
function animate() {
    pointLight.position.set(
        200 * Math.sin(Date.now() / 500),
        200 * Math.sin(Date.now() / 1000),
        200 * Math.cos(Date.now() / 500),
        
    );
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camara);
}
// レンダリング