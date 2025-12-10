# Patient Portal Document Manager

A full-stack healthcare application allowing users to upload, view, download, and manage medical documents (PDFs). This project was built as an assessment for the Full Stack Developer Intern role.

## 🚀 Features
* **Upload:** Securely upload PDF documents (with validation).
* **View:** List all uploaded files with metadata (size, upload date).
* **Download:** Retrieve original files from the server.
* **Delete:** Remove files from both the database and local storage.

## 🛠️ Tech Stack
* **Frontend:** React (TypeScript), Vite
* **Backend:** Node.js, Express
* **Database:** SQLite (Local file-based DB)
* **Storage:** Local file system

---

## ⚙️ How to Run Locally

### Prerequisites
* **Node.js:** v14 or higher (https://nodejs.org/)
* **Git:** Installed on your machine.

### 1. Clone the Repository
Open your terminal and run:

    git clone https://github.com/Vaijayanthi-Sambath-Kumar/healthcare-patient-portal.git
    cd healthcare-patient-portal


### 2. Setup & Run Backend
The backend runs on port **5000**. It handles file storage and the SQLite database.

1. Open a terminal inside the project folder.
2. Navigate to the backend folder:

       cd backend

3. Install dependencies:

       npm install

4. Start the server:

       npm run dev

   *You should see:* `Server running on http://localhost:5000`

### 3. Setup & Run Frontend
The frontend runs on port **5173** (typically) and communicates with the backend.

1. Open a **new** terminal window (keep the backend running).
2. Navigate to the frontend folder:

       cd frontend

3. Install dependencies:

       npm install

4. Start the React app:

       npm run dev

5. Open the link provided (e.g., `http://localhost:5173`) in your browser to use the app.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/documents` | List all documents |
| `POST` | `/documents/upload` | Upload a new PDF |
| `GET` | `/documents/:id` | Download a specific file |
| `DELETE` | `/documents/:id` | Delete a file |

### Example API Calls (cURL)

**Upload a file:**

    curl -X POST -F "file=@/path/to/report.pdf" http://localhost:5000/documents/upload

**List files:**

    curl http://localhost:5000/documents

**Delete a file (ID: 1):**

    curl -X DELETE http://localhost:5000/documents/1

---

## 📂 Project Structure

    healthcare-patient-portal/
    ├── backend/                # Node.js + Express Server
    │   ├── uploads/            # Local storage for PDF files
    │   ├── database.sqlite     # SQLite database file (auto-generated)
    │   ├── server.js           # Main server logic
    │   └── package.json
    ├── frontend/               # React + TypeScript App
    │   ├── src/
    │   │   ├── components/     # UI Components (UploadForm, DocumentList)
    │   │   ├── App.tsx         # Main Application Logic
    │   │   └── main.tsx        # Entry point
    │   └── package.json
    ├── design.md               # Architecture and Design decisions
    └── README.md               # Setup instructions
    