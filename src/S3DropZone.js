import React, {useRef, useState} from "react";
import { FileUploader } from "react-drag-drop-files";
import S3 from 'react-aws-s3';

import './dropZone.css';

// installed using npm install buffer --save
window.Buffer = window.Buffer || require("buffer").Buffer;

const fileTypes = ["JPG", "PNG", "GIF", "JPEG", "OBJ", "MTL"];



const S3DropZone = () =>{
  const [startedUpload, setStartedUpload] = useState(false);
  const [objFile, setObjFile] = useState(null);
  const [mtlFile, setMtlFile] = useState(null);
  const [jpgFile, setJpgFile] = useState(null);

  const incidentNumRef = useRef(null);
  const [incidentId, setIncidentId] = useState(null);

  const handleChange = (change) => {
    console.log(change);
    const files = change instanceof FileList ? Array.from(change) : [change];
    console.log('files', files)
    // setFile(file);
    // files.push(file);
    for (const file of files) {
      uploadFileToS3(file).then(r => {
        // const fileIdx = files.indexOf()
      });

      setFile(file);
    }
  };
  const setFile = file => {
    const newFile = {name: file.name, uploadCompleted: file.uploadCompleted};
    if (file.name.endsWith('.mtl')) {
      setMtlFile(newFile);
    } else if (file.name.endsWith('.obj')){
      setObjFile(newFile);
    } else {
      setJpgFile(newFile);
    }
  }

  const uploadFileToS3 = async (file) => {
    if (!incidentId) {
      alert('No incident # selected!');
      return;
    }
    if(!file) {
      alert('No file Selected'); // Put a toast here instead later.
      return;
    }
    setStartedUpload(true);

    const config = {
      bucketName: 'vrappraisals-demo-files',
      dirName: 'incidents/' + incidentId,
      region: 'us-east-2',
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
    }
    const s3Client = new S3(config);
    return s3Client.uploadFile(file, file.name)
      .then(data => {
        file.uploadCompleted = true;
        setFile(file);
        console.log('Your file has been successfully uploaded to:' + data.location)
        return file;
      })
      .catch(err => {
        file.uploadFailed = true;
        setFile(file);
        console.error(err)
      });
  }

  const renderFile = file => file && (
      <div className={`item ${file.uploadCompleted ? 'completed': (file.uploadCompleted ? 'failed' : '')}`} >
        <span>{file.name}</span>
        <progress value={ file.uploadCompleted ? 100 : null}></progress>
      </div>
  )
  const uploadSection = (<>
      <div className = 'dropZoneParent'>
        <FileUploader handleChange={handleChange} multiple={true} name="file" types={fileTypes} />
      </div>
      <div className="uploadList">
        {renderFile(objFile)}
        {renderFile(mtlFile)}
        {renderFile(jpgFile)}
      </div>
      {mtlFile?.uploadCompleted && objFile?.uploadCompleted && jpgFile?.uploadCompleted && <h3>You're done!</h3>}
      {startedUpload && !(mtlFile?.uploadCompleted && objFile?.uploadCompleted && jpgFile?.uploadCompleted) && (<>
        <h4>Uploading...</h4>
        <p>Please be patient as this can take several minutes</p>
      </>)}
  </>);

  const handleIncidentChange = () => {
    setIncidentId(incidentNumRef.current.value);
    return false;
  };
  const incidentSection = <>
    <form onSubmit={handleIncidentChange}>
      <div style={{marginBottom: 8}}>
        <label htmlFor={'incident-id'} style={{display: "block"}}>Please enter the incident number to which these scans apply.</label>
        <input className={'form-control col-md-6'} type='text' id='incident-id' placeholder='e.g. 1232131' ref={incidentNumRef} />
      </div>

      <input className={'btn btn-primary'} type={'submit'} value={'Submit'} />
    </form>
  </>;

  return (
    <div className='body container'>
      <h1>Upload incident details</h1>
      <p>You will need to provide 3 files. There will be a <code>.obj</code>, a <code>.mtl</code>, and a <code>.jpg</code> file.</p>
      <p>Drag these files onto the space below and they will automatically start uploading.</p>
      {!incidentId && incidentSection}
      {incidentId && uploadSection}
    </div>
  );
}

export default S3DropZone;
