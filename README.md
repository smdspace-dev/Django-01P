# Education Platform - Complete Admin System

A comprehensive educational web application built with Django (backend) and React (frontend) featuring complete admin management for staff, students, clubs, and clusters.

## 📈 Project Status
- **Version**: 1.0.0
- **Status**: In Development
- **Last Updated**: December 2024
- **Author**: Development Team

## 🚀 Technology Stack

- **Backend**: Django 5.2.5, Django REST Framework
- **Frontend**: React 18, Bootstrap 5, React Bootstrap
- **Database**: SQLite (easily changeable to PostgreSQL/MySQL)
- **Styling**: Bootstrap, Custom CSS, FontAwesome Icons
- **API**: RESTful APIs with full CRUD operations

## 📋 Features Overview

### 🏗️ Core Architecture
- **Multi-app Django structure** (accounts, staff, students, clubs, clusters)
- **React SPA** with routing and component-based architecture
- **RESTful API** endpoints for all operations
- **Responsive design** with Bootstrap

### 👨‍💼 Admin Dashboard
- **Central dashboard** with statistics and quick actions
- **Sidebar navigation** with different modules
- **Recent activities** tracking
- **Professional UI** with classical admin styling

### 👥 Staff Management
- **Complete CRUD operations** for staff accounts
- **Department management** and assignment
- **Access control toggles**:
  - Departmental Access Enabled
  - Mentor Access Enabled
- **Mentor cluster assignment** (BCA, B.Com, M.Com, etc.)
- **Staff photo management**
- **Hierarchical dropdown** selection with name and photo display
- **Search and filter** functionality

### 🎓 Student Management
- **Excel bulk upload** for student creation
- **Template-based data import** with validation
- **Auto-generated credentials** (username/password)
- **Email notification system** for credential distribution
- **Cluster-based organization**
- **Club membership management**
- **Temporary club change permissions** (1-day access)

### 🏛️ Cluster Management  
- **Auto-generated cluster IDs** (0=BCA, 1=B.Com, 2=M.Com)
- **Text-to-ID mapping** system
- **Cluster activation/deactivation**
- **Student organization** by academic programs
- **Mentor assignment** to clusters

### 🎭 Club Management
- **Club creation** with coordinator assignment
- **Member capacity management**
- **Student representative** selection (toggle system)
- **Club unique ID** generation for student joining
- **Time-restricted joining periods**
- **One club per student** restriction
- **Bulk operations** (delete all clubs and data)
- **Settings management**:
  - Join period configuration
  - Global club access controls

## 🗂️ Project Structure

```
education_platform/
├── backend (Django)
│   ├── education_platform/     # Main project settings
│   ├── accounts/              # User profiles and authentication
│   ├── clusters/              # Academic cluster management
│   ├── staff/                 # Staff member management
│   ├── students/              # Student management
│   ├── clubs/                 # Club and membership management
│   ├── static/                # Static files
│   ├── media/                 # Uploaded files (photos, documents)
│   └── manage.py              # Django management script
│
└── frontend/                  # React application
    ├── public/                # Public assets
    ├── src/
    │   ├── components/        # React components
    │   │   ├── AdminDashboard.js
    │   │   ├── StaffManagement.js
    │   │   ├── StudentManagement.js
    │   │   ├── ClubManagement.js
    │   │   ├── ClusterManagement.js
    │   │   └── Login.js
    │   ├── App.js             # Main app component
    │   └── App.css            # Custom styling
    └── package.json           # Dependencies
```

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.8+ with pip
- Node.js 14+ with npm
- Git (optional)

### Backend Setup (Django)

1. **Navigate to project directory**:
   ```bash
   cd c:\Users\thous\OneDrive\Desktop\teach
   ```

2. **Install Python dependencies**:
   ```bash
   pip install django djangorestframework django-cors-headers pillow pandas openpyxl django-environ
   ```

3. **Run migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Create superuser**:
   ```bash
   python manage.py createsuperuser
   ```

5. **Start Django server**:
   ```bash
   python manage.py runserver
   ```
   Backend will be available at: http://127.0.0.1:8000/

### Frontend Setup (React)

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Start React development server**:
   ```bash
   npm start
   ```
   Frontend will be available at: http://localhost:3000/

## 🎯 Key Functionalities

### 1. Staff Account Creation
- Complete staff profile with photo
- Department assignment
- Subject expertise and qualification
- Access level configuration
- Mentor cluster assignment (if enabled)

### 2. Cluster ID System
- **Auto-generated IDs**: 0, 1, 2, 3...
- **Linked text descriptions**: BCA, B.Com, M.Com
- **Admin configurable**: Add/edit cluster mappings
- **Dropdown integration**: Used throughout the system

### 3. Club Operations
- **Create clubs** with coordinator selection
- **Hierarchical staff dropdown**: Department → Staff (with photo)
- **Unique club ID** generation
- **Member management**: Add/remove students
- **Representative toggle**: Mark students as representatives
- **Settings control**: 
  - Join period timing
  - Global access controls
  - Maximum clubs per student

### 4. Student Bulk Operations
- **Excel template** for bulk uploads
- **Cluster-specific** student creation
- **Auto-generated credentials**:
  - Username: `name_clustercode_randomnumber`
  - Password: 8-character random string
- **Email dispatch** system (SMTP configuration required)
- **Club membership** management

### 5. Settings & Controls
- **Global club settings**: Join periods, restrictions
- **Email configuration**: SMTP for credential sending
- **Bulk data removal**: Safety-first deletion system
- **Access toggles**: Granular permission controls

## 🔧 Configuration

### Email Settings (in settings.py)
```python
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'  # Google App Password
```

### Database (default SQLite, easily changeable)
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

## 📱 Usage Guide

### Admin Access
1. Start both Django and React servers
2. Navigate to http://localhost:3000/
3. Login with admin credentials (or use login: admin/admin)
4. Access different modules via sidebar navigation

### Staff Management
1. Go to **Staff** tab
2. Click **Add New Staff**
3. Fill in details including photo upload
4. Configure access levels and mentor assignment
5. Save and manage from staff list

### Student Management  
1. Go to **Students** tab
2. Select **Bulk Upload**
3. Choose cluster from dropdown
4. Download template and fill with student data
5. Upload Excel file
6. Send credentials via **Credentials** tab

### Club Management
1. Go to **Clubs** tab
2. Click **Create Club**
3. Select coordinator from hierarchical dropdown
4. Configure member limits
5. Manage members and representatives
6. Use **Settings** for global configurations

### Cluster Management
1. Go to **Clusters** tab  
2. Add new clusters with auto-generated IDs
3. Link text descriptions to numeric IDs
4. Use for organizing students and mentors

## 🎨 UI/UX Features

- **Classical admin styling** with professional appearance
- **Responsive design** for all screen sizes
- **Icon integration** with FontAwesome
- **Card-based layouts** for better organization
- **Modal dialogs** for form interactions
- **Progress indicators** and status badges
- **Hover effects** and smooth transitions
- **Color-coded status** indicators

## 🛡️ Security Features

- **User authentication** with Django's built-in system
- **CSRF protection** enabled
- **CORS configuration** for React integration
- **Input validation** on both frontend and backend
- **File upload restrictions** (images only for photos)
- **Unique constraint enforcement** (emails, IDs)

## 📊 Database Models

### Key Relationships
- **Staff** ↔ **Department** (Many-to-One)
- **Staff** ↔ **Cluster** (Many-to-One, for mentors)
- **Student** ↔ **Cluster** (Many-to-One)
- **Club** ↔ **Staff** (Many-to-One, coordinator)
- **ClubMember** ↔ **Club + Student** (Many-to-Many through model)

## 🚨 Important Notes

### Development vs Production
- Current setup is for **development only**
- For production: Configure proper database, security settings
- Set `DEBUG = False` and configure `ALLOWED_HOSTS`
- Use proper WSGI server (not Django's development server)

### Email Configuration
- Requires Google App Password for Gmail SMTP
- Configure in `settings.py` before using credential sending
- Test email functionality before bulk operations

### Data Safety
- **Bulk delete operations** are irreversible
- Always backup database before major operations
- Test with small datasets first

## 🤝 Contributing

This is a comprehensive educational platform template. Key areas for enhancement:
- Additional authentication methods
- Advanced reporting and analytics
- Mobile app integration
- API rate limiting
- Advanced search capabilities
- Notification system improvements

## 📞 Support

For technical issues or customization requests:
- Check Django documentation for backend issues
- Check React documentation for frontend issues  
- Ensure all dependencies are properly installed
- Verify database migrations are complete

---

**Project Status**: ✅ Fully Functional Development Environment
**Last Updated**: September 16, 2025
**Version**: 1.0.0
