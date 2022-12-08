import S3DropZone from './S3DropZone';
import './App.css';
import Viewer3d from "./Viewer3d";
import { createBrowserRouter, RouterProvider} from "react-router-dom";
import {ViewerIncidentSelector} from "./ViewerIncidentSelector";


const AppList = () => {
    return <div style={{width: 400, margin: 'auto', display: 'flex', justifyContent: 'space-between'}}>
        <a href={'/upload'} className={'btn btn primary'}>Upload scans</a>
        <a href={'/viewer'} className={'btn btn primary'}>Incident viewer</a>
    </div>
}

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <>
                <h1>Welcome to our demo app</h1>
                <AppList />
            </>
        },
        {
            path: '/upload',
            element: <>
                <AppList />
                <S3DropZone />
            </>
        },
        {
            path: '/viewer',
            element: <>
                <AppList />
                <ViewerIncidentSelector />
            </>
        },
        {
            path: '/viewer/:incidentId',
            element: <>
                <AppList />
                <Viewer3d />
            </>
        }
    ]);
  return (
    <div className="App">
        <RouterProvider router={router} />
    </div>
  );
}

export default App;
