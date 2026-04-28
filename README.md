<div align="center">
  <img src="https://img.icons8.com/fluency/96/calendar.png" alt="ClassFlow Logo" />
  <h1><font size="7">ClassFlow</font></h1>
  <p><b>Mini Class Scheduling & Dashboard System</b></p>
</div>

---

<h2>📖 Introduction</h2>
<p>
<b>ClassFlow</b> is a clean and fully dynamic web application designed to simplify class scheduling between teachers and students. Built with a modern <b>Black, White & Orange</b> color palette using <b>DaisyUI</b>, the platform allows teachers to manage time slots and students to book them — all without page reloads.
</p>

---

<h2>📸 Application Overviews</h2>

<h3>🔐 Authentication & Landing</h3>
<p align="center">
  <img src="https://i.ibb.co.com/BHkbH81h/2026-04-28-133127-hyprshot.png" alt="Login Landing Page" width="100%">
</p>
<ul>
  <li>Upon visiting the Home page, users are greeted with a smooth animated Login/Register screen.</li>
  <li>New users can easily sign up by choosing either the Teacher or Student role.</li>
  <li>Features GSAP animations for a premium landing page experience.</li>
</ul>

<h3>👨‍🏫 Teacher Dashboard Overview</h3>
<p align="center">
  <img src="https://i.ibb.co.com/xK6xqDmH/2026-04-28-133142-hyprshot.png" alt="Teacher Dashboard Overview" width="100%">
</p>
<ul>
  <li>Provides a quick glance at total slots, available slots, and booked slots.</li>
  <li>Quick navigation links to the Slot Add page, Management page, and Profile page.</li>
  <li>Features a responsive sidebar for desktop and a bottom navigation bar for mobile users.</li>
</ul>

<h3>➕ Slot Creation (Teacher)</h3>
<p align="center">
  <img src="https://i.ibb.co.com/1tkZ1KSn/2026-04-28-133154-hyprshot.png" alt="Teacher Add Slot" width="100%">
</p>
<ul>
  <li>Teachers can create 15-minute class slots effortlessly.</li>
  <li><b>Smart Validation:</b> Prevents creating slots for past dates or times.</li>
  <li><b>Overlap Protection:</b> Ensures no two slots conflict with each other.</li>
  <li>The end time is automatically calculated and set to 15 minutes after the start time.</li>
</ul>

<h3>📋 Slot Management & Bookings</h3>
<p align="center">
  <img src="https://i.ibb.co.com/zwdWGDg/2026-04-28-133204-hyprshot.png" alt="Teacher Booking Slot" width="100%">
</p>
<ul>
  <li>Lists all created slots where teachers can manage individual or bulk deletions.</li>
  <li>Includes a custom confirmation dialog for safe data management.</li>
  <li>Teachers can approve cancellation requests sent by students directly from this view.</li>
</ul>

<h3>👨‍🎓 Student Dashboard & Booking</h3>
<p align="center">
  <img src="https://i.ibb.co.com/TD08pWjB/2026-04-28-133516-hyprshot.png" alt="Student Dashboard Overview" width="100%">
</p>
<ul>
  <li>Students can see their booking stats, available slots, and info on their next upcoming class.</li>
  <li>The Available Slots page allows for one-click booking with the option to add personal notes.</li>
  <li>Real-time UI updates ensure the booking is reflected instantly without a page refresh.</li>
</ul>

<h3>🗓️ Booked Classes & Integrated Meetings</h3>
<p align="center">
  <img src="https://i.ibb.co.com/9641VQH/2026-04-28-133531-hyprshot.png" alt="Student Booked Slot" width="100%">
</p>
<ul>
  <li><b>Automated Meetings:</b> Once a slot is booked, a unique meeting link is automatically generated.</li>
  <li><b>Easy Access:</b> A dedicated "Join Meeting" button appears for both Teacher and Student dashboards.</li>
  <li><b>Seamless Flow:</b> Both parties can join the session directly from their respective booked classes list.</li>
  <li>Students can send cancellation requests, with the status clearly indicated on the UI.</li>
</ul>

---

<h2>🚀 Key Features</h2>

<table>
  <tr>
    <td><b>Feature</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td><b>Role-Based Access</b></td>
    <td>Protected routes and distinct dashboards for Teachers and Students.</td>
  </tr>
  <tr>
    <td><b>Smart Scheduling</b></td>
    <td>15-minute slots with built-in overlap detection and past-time validation.</td>
  </tr>
  <tr>
    <td><b>Meeting System</b></td>
    <td><b>Automated meeting link generation</b> with a "Join Meeting" flow for both roles.</td>
  </tr>
  <tr>
    <td><b>Instant UI Feedback</b></td>
    <td>Dynamic updates using Toast notifications, loading spinners, and modal confirmations.</td>
  </tr>
  <tr>
    <td><b>Profile Management</b></td>
    <td>Update name and profile photos with ease via ImageBB API integration.</td>
  </tr>
  <tr>
    <td><b>Google Calendar</b></td>
    <td>Option to sync bookings directly with Google Calendar for better organization.</td>
  </tr>
  <tr>
    <td><b>Responsive Design</b></td>
    <td>Fully optimized for mobile with a custom bottom navigation system.</td>
  </tr>
</table>

---

<h2>💻 Tech Stack & Dependencies</h2>

<h3>🌐 Frontend Technologies</h3>
<p>
  <img src="https://skillicons.dev/icons?i=nextjs,tailwind,react,js" />
</p>
<ul>
  <li><b>Framework:</b> Next.js 15 (App Router)</li>
  <li><b>Styling:</b> Tailwind CSS & DaisyUI (Custom "ClassFlow" Theme)</li>
  <li><b>Animations:</b> GSAP (GreenSock Animation Platform)</li>
  <li><b>Icons:</b> React Icons</li>
  <li><b>Runtime:</b> Bun</li>
</ul>

<h3>⚙️ Backend & Database</h3>
<p>
  <img src="https://skillicons.dev/icons?i=mongodb,firebase,vercel" />
</p>
<ul>
  <li><b>Database:</b> MongoDB (Mongoose ODM)</li>
  <li><b>Authentication:</b> Firebase Auth (Email/Password)</li>
  <li><b>Image Upload:</b> ImageBB API</li>
  <li><b>Deployment:</b> Vercel</li>
</ul>

---

<h2>🛠️ Installation</h2>

<ol>
  <li>Clone the repository:
    <pre>git clone https://github.com/prodip-shadow/ClassFlow.git</pre>
  </li>
  <li>Navigate to the project folder:
    <pre>cd ClassFlow</pre>
  </li>
  <li>Install dependencies using Bun:
    <pre>bun install</pre>
  </li>
  <li>Configure your <code>.env</code> file with:
    <ul>
      <li>MongoDB URI</li>
      <li>Firebase Config Keys</li>
      <li>ImageBB API Key</li>
      <li>Google Calendar credentials</li>
    </ul>
  </li>
  <li>Start the development server:
    <pre>bun dev</pre>
  </li>
</ol>

---

<h2>🔐 Demo Credentials</h2>

<table>
  <tr>
    <td><b>Role</b></td>
    <td><b>Email</b></td>
    <td><b>Password</b></td>
  </tr>
  <tr>
    <td>👨‍🏫 Teacher</td>
    <td>teacher@gmail.com</td>
    <td>Password</td>
  </tr>
  <tr>
    <td>👨‍🎓 Student</td>
    <td>student@gmail.com</td>
    <td>Password</td>
  </tr>
</table>

---

<h2>🔗 Live Demo</h2>

<p align="center">
  <a href="https://class-flow-26.vercel.app">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-classflow.vercel.app-f97316?style=for-the-badge" alt="Live Demo" />
  </a>
</p>

---

<div align="center">
  <h3>Developed by <a href="https://github.com/prodiphore">Prodip Hore</a></h3>
</div>
