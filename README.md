
# Vivarium SOPs - Standard Operating Procedures Management System

## Project Overview

Vivarium SOPs is a comprehensive web application designed to manage Standard Operating Procedures (SOPs) for research institutions, laboratories, and organizations working with vivariums. The system allows users to:

- Organize SOPs in folders for easy access
- Upload and manage PDF documents
- Associate quizzes with SOPs for training purposes
- Track user training completion
- Manage user roles and permissions

## Features

### SOP Management
- **Folder Organization**: Create and organize folders to categorize SOPs
- **PDF Upload**: Upload, view, and delete PDF documents
- **Search & Filter**: Find SOPs by category, name, or folder
- **Version Control**: Track when SOPs were uploaded and by whom

### Training & Quizzes
- **Quiz Creation**: Create quizzes related to SOPs
- **Training Assignment**: Assign required training to users
- **Progress Tracking**: Monitor quiz completion and scores
- **Training History**: View historical training data

### User Management
- **User Roles**: Different access levels for administrators and staff
- **Organization-based Access**: SOPs organized by organization
- **Personalized Dashboard**: View assigned and completed training

## Technical Stack

This application is built using:

- **React**: Frontend UI library
- **TypeScript**: Type-safe JavaScript
- **Firebase**: Backend services including:
  - Authentication
  - Firestore database
  - Storage for PDF files
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library for UI elements
- **Vite**: Build tool for faster development

## Getting Started

### Prerequisites
- Node.js (v16.x or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/imacooldeveloper/VivariumSOPs.git
cd VivariumSOPs
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file at the root of the project with your Firebase configuration:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/          # UI components
│   ├── Layout/          # Layout components like Sidebar and MainLayout
│   ├── SOPs/            # SOP-related components
│   ├── Quizzes/         # Quiz-related components
│   ├── Admin/           # Admin panel components
│   └── ui/              # Base UI components from shadcn
├── context/             # React context providers
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
├── pages/               # Top-level page components
├── types/               # TypeScript type definitions
├── viewmodels/          # Business logic for components
└── main.tsx             # Application entry point
```

## Firebase Collections

The application uses the following Firestore collections:

- **sopFolders**: Stores folder information for organizing SOPs
- **pdfCategories**: Stores metadata for uploaded SOPs
- **quizzes**: Stores quiz questions and answers
- **quizAttempts**: Stores user quiz attempts and results
- **userProfiles**: Stores extended user information

## Current Status

The project currently implements:
- User authentication
- SOP folder creation and management
- PDF upload and organization
- Basic quiz structure

## What's Missing / Roadmap

The following features are planned for future implementation:

1. **Enhanced Quiz Functionality**:
   - Quiz creation interface
   - Question bank management
   - Quiz attempt tracking

2. **Advanced Reporting**:
   - Training compliance reports
   - User activity logs
   - Analytics dashboard

3. **Improved User Management**:
   - User groups
   - Batch assignment of training
   - Approval workflows

4. **System Integration**:
   - Calendar integration for training deadlines
   - Email notifications
   - API for external system integration

5. **Mobile Optimization**:
   - Better responsive design
   - Mobile-specific features

## Deployment

The application can be deployed to Firebase Hosting:

```bash
npm run build
firebase deploy
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
