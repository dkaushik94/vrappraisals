import React, { useRef, Suspense, useState, setState} from "react";
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js';
import { Card, PrimaryButton, ConnectedBulletList, ConnectedBullet } from '@snapsheet/uikit';

import * as THREE from 'three'
import '@snapsheet/uikit/dist/snapsheet-uikit.css';
import { render } from "@testing-library/react";

const BottomUI = (args) => {
    return (
        <div class='ss-container'>
        <div id='bottom-ui' class='ss-row' >
            <div class='ss-col-md'>
                <Card>
                    <h2>Description:</h2>
                    <span>{args["description"]}</span>
                </Card>
            </div>
            <div class='ss-col-md'>
                <Card>
                    <h2>Points of Interest:</h2>
                    <ConnectedBulletList>
                        { args["pointsOfInterest"].map( (interestStr) => {
                            return(<ConnectedBullet>{interestStr}</ConnectedBullet>)
                        })}
                    </ConnectedBulletList>
                </Card>
            </div>
            <div class='ss-col-md'>
                <Card>
                    <h2>Misc:</h2>
                    <PrimaryButton>Save</PrimaryButton>
                </Card>
            </div>
        </div>
    </div>
    )
}

export default function Viewer3d(props) {
    const [pointsOfInterest, setPointsOfInterest] = useState([
        "Broken Windshield", "Broken Side Window", "Broken Side Window"
    ]);
    const descr = "Car had wind and hail damage."

    const ref = useRef();

    // useEffect( () => {
    //     const materials = useLoader(MTLLoader, "/textured.mtl");
    //     setCarObject( currentCarObj => useLoader(OBJLoader, '/textured.obj', loader => {
    //         materials.preload();
    //         loader.setMaterials(materials)
    //     })
    // }, [])

    const addMarker = (clickPos) => {

        const mesh = new THREE.Mesh()
        const material = new THREE.MeshNormalMaterial()
        const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
        
        mesh.material = material
        mesh.geometry = geometry
        

        mesh.position.set(clickPos.point.x, clickPos.point.y, clickPos.point.z);
        setPointsOfInterest(currentPointsOfInterest => [...currentPointsOfInterest, "New Damange Thing"]);
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
        <div class=''>
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
            <h1>Claim ID: 011291222</h1>
            { BottomUI(
                {
                    "pointsOfInterest": pointsOfInterest,
                    "description": descr
                }
            ) }
        </div>
    );
};


