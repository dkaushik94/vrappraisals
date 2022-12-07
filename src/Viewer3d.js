import React, { useRef, Suspense } from "react";
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';

import * as THREE from 'three'

export default function Viewer3d(props) {

    const ref = useRef();

    const addMarker = (clickPos) => {
        
        console.log(clickPos);

        const mesh = new THREE.Mesh() // <mesh />
        const material = new THREE.MeshNormalMaterial() // <meshNormalMaterial />
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5) // <boxGeometry />
        
        mesh.material = material
        mesh.geometry = geometry

        mesh.position.set(clickPos.point.x, clickPos.point.y, clickPos.point.z);

        ref.current.add(mesh);
    }

    const CarModel = () => {
        const obj = useLoader(OBJLoader, '/textured.obj')
        return (
            <group ref={ref} name="sceneWrapperGroup">
                <mesh onClick={(e) => addMarker(e)}>
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
                {/*<Box position={[-1.2, 0, 0]} />*/}
                {/*<Box position={[1.2, 0, 0]} />*/}
                <CarModel />
                <OrbitControls />
            </Canvas>
        </div>
    );
};
