import React from 'react';
import { FaDownload, FaTrash } from 'react-icons/fa';

// Define the type directly here to avoid import errors
interface PatientDocument {
  id: number;
  filename: string;
  original_name: string;
  file_size: number;
  created_at: string;
}

interface Props {
  documents: PatientDocument[];
  onDelete: (id: number) => void;
  onDownload: (id: number, filename: string) => void;
}

export const DocumentList: React.FC<Props> = ({ documents, onDelete, onDownload }) => {
  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3>Uploaded Documents</h3>
      {documents.length === 0 ? (
        <p>No documents found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>Filename</th>
              <th style={{ padding: '10px' }}>Size (KB)</th>
              <th style={{ padding: '10px' }}>Uploaded At</th>
              <th style={{ padding: '10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{doc.original_name}</td>
                <td style={{ padding: '10px' }}>{(doc.file_size / 1024).toFixed(2)} KB</td>
                <td style={{ padding: '10px' }}>{new Date(doc.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '10px', display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => onDownload(doc.id, doc.original_name)}
                    style={{ background: 'none', border: '1px solid #007bff', color: '#007bff', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <FaDownload /> Download
                  </button>
                  <button 
                    onClick={() => onDelete(doc.id)}
                    style={{ background: 'none', border: '1px solid #dc3545', color: '#dc3545', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
