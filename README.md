# Dynamic Portfolio 🚀

### A premium, full-stack, and interactive personal website featuring a state-of-the-art admin dashboard.

---


---

## ✨ Features
- **Dynamic Content**: Manage every section of your portfolio through a secure admin dashboard.
- **Hybrid Media Storage**: Intelligent file handling using MongoDB Atlas. Small images are stored as Base64 for rapid loading, while large images and videos (>500KB) are seamlessly streamed into **MongoDB GridFS**.
- **Premium UI/UX**: Built with Material UI and Framer Motion for smooth, high-end animations and responsive layouts.
- **Full CRUD Operations**: Create, read, update, and delete Projects, Experience, Education, Certifications, and Achievements in real-time.
- **Responsive Design**: Flawless experience across mobile, tablet, and desktop devices.
- **Glassmorphism Aesthetics**: Modern, frosted-glass design system with intelligent hover effects and glows.

---

## 🛠 Tech Stack
- **Frontend**: React.js, TypeScript, Vite, Material UI (MUI), Framer Motion, Lucide React icons.
- **Backend**: Node.js, Express.js, TypeScript, TypeORM.
- **Database**: MongoDB Atlas (Cloud NoSQL).
- **State Management**: React Context API.
- **Notifications**: React Hot Toast.

---

## ⚙️ Installation / Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sushmitha614/Sushmitha_PortFolio.git
   cd Sushmitha_PortFolio
   ```

2. **Backend Setup**:
   ```bash
   cd server
   npm install
   # Create a .env file with your DATABASE_URL (MongoDB Atlas connection string), JWT_SECRET, and PORT.
   npm run build
   npm start
   ```

3. **Frontend Setup**:
   ```bash
   cd ../client
   npm install
   # Create a .env file with VITE_API_URL (e.g., http://localhost:5000/api)
   npm run dev
   ```

*(Alternatively, you can run both simultaneously from the root with tools like concurrently, or build the entire project using root scripts if configured.)*

---

## 🚀 Usage
- **Visitors**: Navigate through sections like Projects, Skills, and Experience to explore the portfolio.
- **Admin**: Log in via the hidden admin access (using the `/login` route or login button) to manage your content.
- **Media Uploads**: Use the integrated upload buttons in the admin panel to add images/videos. The system will automatically direct files to the appropriate storage (Base64 vs GridFS) based on size constraints.

---

## 📈 Project Status
**Completed & Production Ready.** Optimized for deployment on platforms like Replit, Render, Vercel, or any Node.js hosting.

---

## 🧠 Challenges / Learning
- **MongoDB 16MB Limit**: Resolved the challenge of storing large project videos by migrating from raw Base64 strings to a **MongoDB GridFS** streaming architecture.
- **Real-time Synchronization**: Implemented efficient React state management to ensure the UI updates instantly after admin edits without requiring a full page refresh.

---

## 🔮 Future Improvements
- **SEO Optimization**: Further enhancing metadata for better search engine rankings.
- **Blog Section**: Adding a dynamic blog module to share technical insights.
- **Theme Toggle**: Adding a manual dark/light mode switcher for user preference.

---

## 💎 Credits / References
- **MongoDB Atlas**: For providing a scalable, cloud-based NoSQL database with GridFS support.
- **MUI**: For the comprehensive component library.
- **Framer Motion**: For the fluid entrance and interaction animations.
- **Lucide**: For the crisp and consistent iconography.

---

## 👩‍💻 Author / Contact
- **Sushmitha**
- **GitHub**: [Sushmitha614](https://github.com/Sushmitha614)
- **LinkedIn**: [Sushmitha Profile](#)

---

## 📄 License
This project is licensed under the MIT License.
