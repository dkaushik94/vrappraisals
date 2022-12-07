import React, { useEffect, useRef } from "react";
// import { OrbitControls } from "three";
import { Canvas, useThree, useLoader, useFrame } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const innerHeight = '600px'

const CameraController = () => {
    const { camera, gl } = useThree();
    useEffect(
        () => {
            const controls = new OrbitControls(camera, gl.domElement);

            controls.minDistance = 3;
            controls.maxDistance = 20;
            return () => {
                controls.dispose();
            };
        },
        [camera, gl]
    );
    return null;
};

export default function Viewer3d() {
    return (
        <div style={{
            height: innerHeight
        }}>
            <h3>HIDD</h3>
            <Canvas>
                <CameraController />

                {/*<OrbitControls/>*/}
                <directionalLight intensity={0.5} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 15, 10]} angle={0.9} />
                <Mesh />
            </Canvas>
        </div>
    );
};

function Mesh() {
    return (
        <mesh rotation={[0, 0, 0]}>
            <sphereGeometry attach="geometry" args={[1, 16, 16]} />
            <meshStandardMaterial
                attach="material"
                color="blue"
            />

            <Box />
        </mesh>

    );
}
function Box() {
    return (
        <mesh>
            <boxGeometry attach="geometry" args={[3, 2, 1]} />
            <meshPhongMaterial attach="material" color="hotpink" />
        </mesh>
    );
}
