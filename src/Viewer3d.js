import React, { Suspense } from "react";
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js';
// import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';

export default function Viewer3d(props) {
    return (
        <div style={{
            height: props.height || '500px'
        }}>
            <Canvas>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />
                {/*<Box position={[-1.2, 0, 0]} />*/}
                {/*<Box position={[1.2, 0, 0]} />*/}
                <Scene />
                <OrbitControls />
            </Canvas>
        </div>
    );
};

function Scene() {
    const materials = useLoader(MTLLoader, "/textured.mtl");
    const obj = useLoader(OBJLoader, '/textured.obj', loader => {
        materials.preload();
        loader.setMaterials(materials)
    })
    console.log('obj', obj)
    // const obj = useLoader(FBXLoader, '/Dec7at2-22PM-poly.fbx')
    return (
        <Suspense fallback={null}>
            <primitive object={obj} scale={1.5} />
        </Suspense>
    )

}
