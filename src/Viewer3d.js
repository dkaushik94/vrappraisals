import React, { Suspense } from "react";
import { Canvas, useLoader } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei'
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
                <Suspense fallback={<Html center><h2>Loading&nbsp;scans...</h2></Html>}>
                    <Scene baseUrl="https://vrappraisals-demo-files.s3-us-east-2.amazonaws.com/incidents/29383493" />
                </Suspense>
                <OrbitControls />
            </Canvas>
        </div>
    );
};

function Scene(props) {
    const materials = useLoader(MTLLoader, `${props.baseUrl}/textured.mtl`);
    const obj = useLoader(OBJLoader, `${props.baseUrl}/textured.obj`, loader => {
        materials.preload();
        loader.setMaterials(materials)
    })
    return <primitive object={obj} scale={1.5} />

}
