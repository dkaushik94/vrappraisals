import React, { useRef, Suspense } from "react";
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js';
// import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';

import * as THREE from 'three'

export default function Viewer3d(props) {

    const ref = useRef();

    const addMarker = (clickPos) => {

        const mesh = new THREE.Mesh()
        const material = new THREE.MeshNormalMaterial()
        const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
        
        mesh.material = material
        mesh.geometry = geometry

        mesh.position.set(clickPos.point.x, clickPos.point.y, clickPos.point.z);

        ref.current.add(mesh);
    }

    const CarModel = () => {
        const materials = useLoader(MTLLoader, "/textured.mtl");
        const obj = useLoader(OBJLoader, '/textured.obj', loader => {
            materials.preload();
            loader.setMaterials(materials)
        })
        return (
            <group ref={ref} name="sceneWrapperGroup">
                <mesh onDoubleClick={(e) => addMarker(e)}>
                    <Suspense fallback={null}>
                        <primitive object={obj} />
                    </Suspense>
                </mesh>
            </group>
        )
    }

    return (
        <div style={{
            height: props.height || '500px'
        }}>
            <Canvas ref={ref} style={{ background: "#171717" }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />
                <CarModel />
                <OrbitControls />
            </Canvas>
        </div>
    );
};
