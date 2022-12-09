import React, { useRef, Suspense, useState, setState} from "react";
import { Canvas, useLoader } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js';
import { Card, PrimaryButton, ConnectedBulletList, ConnectedBullet, Dialog, Textarea} from '@snapsheet/uikit';

import * as THREE from 'three'
import '@snapsheet/uikit/dist/snapsheet-uikit.css';
import './Viewer3d.css';
import { render } from "@testing-library/react";
import { click } from "@testing-library/user-event/dist/click";

const BottomUI = (args) => {
    return (
        <div className='ss-container'>
        <div id='bottom-ui' className='ss-row' >
            <div className='ss-col-md'>
                <Card>
                    <h2>Description:</h2>
                    <span>{args["description"]}</span>
                </Card>
            </div>
            <div className='ss-col-md'>
                <Card>
                    <h2>Points of Interest:</h2>
                    <ConnectedBulletList>
                        { args["pointsOfInterest"].map( (interestStr, idx) => {
                            return(<ConnectedBullet key={idx}>{interestStr}</ConnectedBullet>)
                        })}
                    </ConnectedBulletList>
                </Card>
            </div>
            <div className='ss-col-md'>
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
    const [modalVisibility, setModalVisibility] = useState(false);
    const [clickPos, setClickPos] = useState(null)
    const [newPointOfInterestName, setNewPointOfInterestName] = useState("undefined")
    const [pointsOfInterest, setPointsOfInterest] = useState([
        "Broken Windshield", "Broken Side Window", "Broken Side Window"
    ]);

    const [markers, setMarkers] = useState([]);
    const descr = "Car had wind and hail damage."

    const ref = useRef();

    const showModal = (clickPos) => {
        setClickPos(clickPos)
        setModalVisibility(true)  
    }

    const addMarker = () => {
        
        const mesh = new THREE.Mesh()
        const material = new THREE.MeshNormalMaterial()
        const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
        
        mesh.material = material
        mesh.geometry = geometry
        
        let currMarker = {
            position: clickPos,
        }

        mesh.position.set(clickPos.point.x, clickPos.point.y, clickPos.point.z);
        console.log(newPointOfInterestName)
        setPointsOfInterest(currentPointsOfInterest => [...currentPointsOfInterest, newPointOfInterestName]);
        setMarkers(currMark => [...currMark, currMarker]);
        ref.current.add(mesh);
        setModalVisibility(false) 
        setClickPos(null)
    }

    // const boxMarkers = (pos) => {
    //     const ref = useRef();



    //     return (
    //         <mesh ref={ref} castShadow receiveShadow>
    //             <boxGeometry attach="geometry" args={[2, 2, 2]} />
    //             <meshStandardMaterial attach="material" />
    //         </mesh>
    //     )
    // }

    const CarModel = (props) => {
        const materials = useLoader(MTLLoader, `${props.baseUrl}/textured.mtl`);
        const obj = useLoader(OBJLoader, `${props.baseUrl}/textured.obj`, loader => {
            materials.preload();
            loader.setMaterials(materials)
        })
        // return <primitive object={obj} scale={1.5} />

        return obj && (
            <group ref={ref} name="sceneWrapperGroup">

                <mesh onDoubleClick={(e) => showModal(e)}>
                    <Suspense fallback={null}>
                        <primitive object={obj} />
                    </Suspense>
                </mesh>
                {
                    markers.map((mark) => {
                        return (
                            <mesh key={`${mark.position.point.x}-${mark.position.point.y}-${mark.position.point.z}`} position={new THREE.Vector3(mark.position.point.x, mark.position.point.y, mark.position.point.z)}>
                                <meshNormalMaterial />
                                <boxGeometry args={[0.2,0.2,0.2]} />
                            </mesh>
                        )
                    })
                }
            </group>
        )
    }

    return (
        <div>
            <Dialog id='pointOfInterestModal' show={modalVisibility} >
                <div className="modal-wrapper">
                    <h2>New Point of Interest</h2>
                    <label htmlFor={'poi-text'}>Enter label/name:</label>
                    <Textarea id={'poi-text'} onChange={ (e) => { setNewPointOfInterestName(e.target.value)} }></Textarea>
                    <div className={'bottom-buttons'}>
                        <PrimaryButton onClick={ ()=> { setModalVisibility(false)}} >
                            Cancel
                        </PrimaryButton>
                        <PrimaryButton onClick={ ()=> { addMarker() }}>
                            OK
                        </PrimaryButton>
                    </div>
                </div>
            </Dialog>
            <div style={{
                height: props.height || '500px'
            }}>
                <Canvas ref={ref} style={{ background: "#171717" }}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                    <pointLight position={[-10, -10, -10]} />
                    <Suspense fallback={<Html center><h2>Loading&nbsp;scans...</h2></Html>}>
                        <CarModel baseUrl="https://vrappraisals-demo-files.s3-us-east-2.amazonaws.com/incidents/29383493" />
                    </Suspense>
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
