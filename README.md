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

<p align="center">
  <img src="https://i.ibb.co.com/FvK7XJJ/2026-04-27-214305-hyprshot.png" alt="ClassFlow Screenshot 1" width="100%">
</p>
<p align="center">
  <img src="https://i.ibb.co.com/fdmLJKpw/2026-04-27-214352-hyprshot.png" alt="ClassFlow Screenshot 2" width="100%">
</p>
<p align="center">
  <img src="https://i.ibb.co.com/7x5wZJhP/2026-04-27-214405-hyprshot.png" alt="ClassFlow Screenshot 3" width="100%">
</p>
<p align="center">
  <img src="https://i.ibb.co.com/0TdRycc/2026-04-27-214417-hyprshot.png" alt="ClassFlow Screenshot 4" width="100%">
</p>

---

<h2>👥 User Roles & Permissions</h2>

<h3>👨‍🏫 Teacher Dashboard</h3>
<ul>
  <li><b>Dashboard Stats:</b> View total slots created, total booked, and total available at a glance.</li>
  <li><b>Slot Management:</b> Add new time slots with date and start time — end time auto-calculated as +15 minutes.</li>
  <li><b>Slot Rules:</b> Cannot add overlapping slots or past time slots.</li>
  <li><b>Profile Update:</b> Update name and profile photo via ImageBB API.</li>
</ul>

<h3>👨‍🎓 Student Dashboard</h3>
<ul>
  <li><b>Browse Slots:</b> View all available slots in a clean card grid.</li>
  <li><b>Instant Booking:</b> Book a slot with one click — UI updates instantly without page reload.</li>
  <li><b>Booking History:</b> View personal booked slots in a separate section.</li>
  <li><b>Profile Update:</b> Update name and profile photo via ImageBB API.</li>
</ul>

---

<h2>💻 Tech Stack & Dependencies</h2>

<h3>🌐 Frontend Technologies</h3>
<p>
  <img src="https://skillicons.dev/icons?i=nextjs,tailwind,react,js" />
</p>
<ul>
  <li><b>Framework:</b> Next.js 15 (App Router, JSX)</li>
  <li><b>Styling:</b> Tailwind CSS</li>
  <li><b>UI Components:</b> DaisyUI (custom "classflow" theme)</li>
  <li><b>Animations:</b> GSAP</li>
  <li><b>Icons:</b> React Icons</li>
  <li><b>Runtime:</b> Bun</li>
</ul>

<h3>⚙️ Backend & Database</h3>
<p>
  <img src="https://skillicons.dev/icons?i=mongodb,firebase,vercel" />
</p>
<ul>
  <li><b>Database:</b> MongoDB (Mongoose)</li>
  <li><b>Authentication:</b> Firebase Auth (Email/Password)</li>
  <li><b>Image Upload:</b> ImageBB API</li>
  <li><b>Deployment:</b> Vercel</li>
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
    <td>Distinct dashboards for Teachers and Students with protected routes.</td>
  </tr>
  <tr>
    <td><b>Smart Slot System</b></td>
    <td>15-minute slots with overlap detection and past-time validation.</td>
  </tr>
  <tr>
    <td><b>Instant Booking</b></td>
    <td>Slot booking updates the UI dynamically — no page reload required.</td>
  </tr>
  <tr>
    <td><b>Profile Image Upload</b></td>
    <td>Upload and update profile photos using the ImageBB API.</td>
  </tr>
  <tr>
    <td><b>DaisyUI Theme</b></td>
    <td>Custom black, white, and orange theme applied globally via CSS variables.</td>
  </tr>
  <tr>
    <td><b>GSAP Animations</b></td>
    <td>Smooth, subtle animations on page load and slot card rendering.</td>
  </tr>
</table>

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
  <li>Configure your <code>.env.local</code> file with:
    <ul>
      <li>MongoDB URI</li>
      <li>Firebase Config Keys</li>
      <li>ImageBB API Key</li>
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
    <td>teacher@classflow.com</td>
    <td>Teacher@123</td>
  </tr>
  <tr>
    <td>👨‍🎓 Student</td>
    <td>student@classflow.com</td>
    <td>Student@123</td>
  </tr>
</table>

---

<h2>🔗 Live Demo</h2>

<p align="center">
  <a href="https://classflow.vercel.app">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-classflow.vercel.app-f97316?style=for-the-badge" alt="Live Demo" />
  </a>
</p>

---

<div align="center">
  <h3>Developed by <a href="https://github.com/prodiphore">Prodip Hore</a></h3>
</div>
