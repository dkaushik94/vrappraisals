import S3DropZone from './S3DropZone';
import './App.css';
import Viewer3d from "./Viewer3d";
import { createBrowserRouter, RouterProvider} from "react-router-dom";


function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <>
                <h1>Welcome to our demo app</h1>
                <div style={{width: 400, margin: 'auto', display: 'flex', justifyContent: 'space-between'}}>
                    <a href={'upload'} className={'btn btn primary'}>Upload scans</a>
                    <a href={'viewer'} className={'btn btn primary'}>See the estimate tool</a>
                </div>
            </>
        },
        {
            path: '/upload',
            element: <S3DropZone />
        },
        {
            path: '/viewer',
            element: <Viewer3d />
        }
    ]);
  return (
    <div className="App">
        <RouterProvider router={router} />
    </div>
  );
}

export default App;
