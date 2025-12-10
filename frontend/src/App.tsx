import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UploadForm } from './components/UploadForm';
import { DocumentList } from './components/DocumentList';

// Define the type here too
interface PatientDocument {
  id: number;
  filename: string;
  original_name: string;
  file_size: number;
  created_at: string;
}

const API_BASE_URL = 'http://localhost:5000';

function App() {
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // 1. Fetch documents on load
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/documents`);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setMessage({ type: 'error', text: 'Failed to load documents.' });
    }
  };

  // 2. Upload Logic
  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`${API_BASE_URL}/documents/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage({ type: 'success', text: 'File uploaded successfully!' });
      fetchDocuments();
    } catch (error) {
      console.error('Upload failed:', error);
      setMessage({ type: 'error', text: 'Upload failed. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  // 3. Delete Logic
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/documents/${id}`);
      setMessage({ type: 'success', text: 'File deleted successfully.' });
      setDocuments(documents.filter(doc => doc.id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
      setMessage({ type: 'error', text: 'Failed to delete file.' });
    }
  };

  // 4. Download Logic
  const handleDownload = async (id: number, filename: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/documents/${id}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      setMessage({ type: 'error', text: 'Failed to download file.' });
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#333' }}>Patient Portal</h1>
        <p style={{ color: '#666' }}>Patient Document Management System</p>
      </header>

      {message && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '4px',
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24'
        }}>
          {message.text}
        </div>
      )}

      <UploadForm onUpload={handleUpload} isUploading={isUploading} />

      <DocumentList 
        documents={documents} 
        onDelete={handleDelete} 
        onDownload={handleDownload} 
      />
    </div>
  );
}

export default App;
