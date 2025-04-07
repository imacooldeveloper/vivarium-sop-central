
# Vivarium SOP Central

A comprehensive Standard Operating Procedures (SOP) management system for vivariums and animal research facilities. This application allows organizations to create, organize, and manage SOPs, assign training materials, and track employee compliance.

## Features

- **User Authentication**: Secure login and registration with role-based access control
- **SOP Management**: 
  - Upload PDF documents
  - Organize SOPs into folders
  - View and manage SOPs by category
- **Training & Certification**: 
  - Create and assign quizzes based on SOP content
  - Track quiz completion and scores
  - Monitor employee certifications
- **Dashboard**: Overview of organizational compliance and training status

## Technology Stack

- **Frontend**: React with TypeScript and Tailwind CSS
- **UI Components**: shadcn/ui component library
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Routing**: React Router
- **State Management**: React Context API
- **Form Handling**: React Hook Form

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/imacooldeveloper/vivarium-sop-central.git
   cd vivarium-sop-central
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the project root with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Project Structure

```
src/
  ├── components/          # Reusable UI components
  │   ├── Admin/           # Admin-specific components
  │   ├── Dashboard/       # Dashboard components
  │   ├── Layout/          # Layout components (Sidebar, Topbar)
  │   ├── Quizzes/         # Quiz-related components
  │   ├── SOPs/            # SOP-related components
  │   └── ui/              # shadcn/ui components
  ├── context/             # React contexts
  │   └── AuthContext.tsx  # Authentication context
  ├── hooks/               # Custom React hooks
  ├── lib/                 # Utility functions and configurations
  │   └── firebase.ts      # Firebase initialization
  ├── pages/               # Page components
  │   ├── Auth/            # Authentication pages
  │   └── ...              # Other pages
  ├── types/               # TypeScript type definitions
  │   └── index.ts         # Main type definitions file
  └── viewmodels/          # View models for data handling
```

## Firestore Data Structure

- **Users**: User profiles and authentication info
- **SOPFolders**: Folders for organizing SOPs
- **pdfCategories**: SOP documents and metadata
- **Quizzes**: Quiz questions and configurations
- **QuizAttempts**: User quiz attempt records

## Features To Be Added

- **Advanced Reporting**: Generate compliance reports
- **Email Notifications**: Automatic reminders for required training
- **Version Control**: Track SOP revisions and updates
- **Mobile Optimization**: Responsive design for all device sizes
- **API Integration**: Connect to LIMS and other laboratory systems

## License

This project is proprietary and confidential. Unauthorized copying of this file, via any medium is strictly prohibited.

## Contact

For questions or support, please contact [your-email@example.com](mailto:your-email@example.com).
