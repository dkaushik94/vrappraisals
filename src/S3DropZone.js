import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import S3 from 'react-aws-s3';

import './dropZone.css';

// installed using npm install buffer --save
window.Buffer = window.Buffer || require("buffer").Buffer;

const fileTypes = ["JPG", "PNG", "GIF", "JPEG"];

const config = {
  bucketName: 'vrappraisals',
  dirName: 'models',
  region: 'us-east-2',
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
}

const S3DropZone = () =>{ 
  const [file, setFile] = useState(null);

  const handleChange = (file) => {
    console.log(file);
    setFile(file);
  };

  const uploadFileToS3 = async () => {
    if(!file) {
      alert('No file Selected'); // Put a toast here instead later.
      return;
    }

    const s3Client = new S3(config);
    s3Client.uploadFile(file, file.name)
    .then(data => alert('Your file has been successfully uploaded to:' + data.location))
    .catch(err => console.error(err));
  }

  return (
    <div className='body'>
      <div className = 'dropZoneParent'>
        <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
      </div>
      <div style = {{ margin: 10 }}>
        <button onClick={uploadFileToS3}>Upload</button>
      </div>
    </div>
  );
}

export default S3DropZone;
