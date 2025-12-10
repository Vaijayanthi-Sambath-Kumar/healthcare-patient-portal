import React, { useState } from 'react';

interface Props {
  onUpload: (file: File) => void;
  isUploading: boolean;
}

export const UploadForm: React.FC<Props> = ({ onUpload, isUploading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate PDF only
      if (selectedFile.type !== 'application/pdf') {
        setError('Only PDF files are allowed.');
        setFile(null);
        return;
      }

      setError('');
      setFile(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onUpload(file);
      setFile(null); // Reset after upload
      // Reset the input value manually
      (document.getElementById('file-input') as HTMLInputElement).value = '';
    }
  };

  return (
    <div style={{ marginBottom: '20px', padding: '20px', border: '1px dashed #ccc', borderRadius: '8px', background: '#fff' }}>
      <h3>Upload New Document</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input 
          id="file-input"
          type="file" 
          accept="application/pdf" 
          onChange={handleFileChange} 
        />
        <button 
          type="submit" 
          disabled={!file || isUploading}
          style={{ padding: '8px 16px', cursor: file ? 'pointer' : 'not-allowed' }}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
};
