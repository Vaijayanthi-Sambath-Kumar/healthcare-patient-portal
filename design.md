# Design Document: Patient Portal Document Manager

## 1. Tech Stack Choices
### Q1. Frontend Framework
**Choice:** React (TypeScript)
**Reasoning:** React's component-based structure is ideal for the file list and upload form. TypeScript ensures type safety, which is crucial for maintaining clean code and preventing runtime errors in data-heavy applications.

### Q2. Backend Framework
**Choice:** Node.js with Express
**Reasoning:** Express is lightweight, unopinionated, and excellent for handling I/O-heavy operations like file streams. It allows for quick setup of REST endpoints and easy integration with middleware like `multer` for file handling.

### Q3. Database
**Choice:** SQLite
**Reasoning:** The requirement is a local implementation. SQLite is serverless and self-contained, allowing the entire database to reside in a single file (`database.sqlite`). This simplifies the setup process for reviewers as no external DB server is required.

### Q4. Scaling to 1,000 Users
If the user base grew to 1,000 users, the following changes would be required:
1. **Storage:** Migrate from local disk storage to Object Storage (e.g., AWS S3 or Google Cloud Storage) to handle storage limits and ensure data durability.
2. **Database:** Migrate from SQLite to PostgreSQL. Postgres handles concurrency and row-level locking much better than SQLite (which often locks the whole file on write).
3. **Authentication:** Implement a robust auth provider (like Auth0 or JWT-based auth) to ensure patients can only view their own specific documents (multi-tenancy).

## 2. Architecture Overview
**Flow:**
1. User interacts with **React Frontend**.
2. Frontend sends HTTP requests to **Express Backend**.
3. Backend validates input and manages data:
   * **Metadata** (filename, size, date) -> Saved to **SQLite**.
   * **Binary Data** (PDF file) -> Saved to **Local File System** (`/uploads`).

**Diagram:**
[ User Browser ]
      |
      | (JSON / Multipart Data)
      v
[ Node.js Express API ]
      |
      +----(File Stream)----> [ /uploads Folder ]
      |
      +----(SQL Query)------> [ SQLite Database ]

## 3. API Specification

### 1. Upload Document
* **URL:** `/api/documents/upload`
* **Method:** `POST`
* **Description:** Uploads a single PDF file and stores metadata.
* **Request:** `multipart/form-data`
    * `file`: (Binary PDF file)
* **Response (201 Created):**
    ```json
    {
      "message": "File uploaded successfully",
      "fileId": 1,
      "filename": "report.pdf"
    }
    ```

### 2. List Documents
* **URL:** `/api/documents`
* **Method:** `GET`
* **Description:** Retrieves a list of all uploaded documents.
* **Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "filename": "report.pdf",
        "size": 10240,
        "upload_date": "2023-10-27T10:00:00Z"
      },
      {
        "id": 2,
        "filename": "prescription.pdf",
        "size": 5120,
        "upload_date": "2023-10-28T14:30:00Z"
      }
    ]
    ```

### 3. Download Document
* **URL:** `/api/documents/:id`
* **Method:** `GET`
* **Description:** Downloads the specific PDF file associated with the ID.
* **Response (200 OK):**
    * **Headers:** `Content-Type: application/pdf`, `Content-Disposition: attachment`
    * **Body:** Binary file stream.

### 4. Delete Document
* **URL:** `/api/documents/:id`
* **Method:** `DELETE`
* **Description:** Deletes the file from disk and removes the record from the database.
* **Response (200 OK):**
    ```json
    {
      "message": "Document deleted successfully"
    }
    ```

## 4. Data Flow Description (Q5)
1. **Upload:** Client selects file -> Sends `POST` with FormData -> Backend Middleware (`Multer`) validates PDF MIME type -> Saves file to `/uploads` folder -> Backend inserts file metadata (path, name, size) into SQLite -> Returns success JSON.
2. **Download:** Client requests file by ID -> Backend queries SQLite for the file path -> Backend verifies file existence on disk -> Streams file data to client response.

## 5. Assumptions (Q6)
* **Authentication:** Not implemented; system assumes a single-user environment.
* **File Constraints:** Only `.pdf` files are allowed.
* **Concurrency:** SQLite is sufficient for the scope; race conditions on file renaming are handled by appending timestamps to filenames.
* **Persistence:** The local `uploads/` folder is assumed to be persistent (not ephemeral) for this implementation.