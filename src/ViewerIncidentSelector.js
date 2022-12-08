import {useEffect, useState} from "react";
import {S3Client, ListObjectsCommand} from '@aws-sdk/client-s3';

export function ViewerIncidentSelector() {
    const [incidents, setIncidents] = useState([]);
    const [selectedIncident, setSelectedIncident] = useState(null);
    useEffect(() => {
        (async () => {
            const client = new S3Client({
                credentials: {
                    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
                    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
                },
                region: 'us-east-2'
            });
            console.log(process.env)
            const response = await client.send(new ListObjectsCommand({
                Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
                Prefix: 'incidents'
            }));
            const incidents = response.Contents
                .map(c => c.Key.split('/')[1])
                .filter((c, idx, arr) => c && arr.indexOf(c) === idx);
            console.log('incidents', incidents);
            setIncidents(incidents)
        })();
    }, []);

    const openCurrentIncident = () => {
        if (selectedIncident) {
            window.location.assign('/viewer/' + selectedIncident);
        }
        return false;
    }

    const options = incidents.map(i => <option key={i}>{i}</option>)
    return (
        <div className={'container'}>
            <h1>Select the incident you would like to view</h1>
            <div className={'input-group'}>
            <select className={'form-select'} onChange={v => setSelectedIncident(v.target?.value)}>
                <option></option>
                {options}
            </select>
            <button className={'btn btn-outline-primary'} disabled={!selectedIncident} onClick={openCurrentIncident}>View</button>
            </div>
        </div>
    )
}
