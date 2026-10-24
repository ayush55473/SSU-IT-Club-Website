/**
 * ==============================================================================
 * UNIVERSITY IT CLUB — EXECUTIVE & TEAM MEMBERS DATA
 * ==============================================================================
 * 
 * ------------------------------------------------------------------------------
 * INSTRUCTIONS FOR CUSTOMIZATION:
 * ------------------------------------------------------------------------------
 * 1. HOW TO ADD A NEW MEMBER:
 *    - Add a new object inside the `MEMBERS` array below.
 *    - Provide a unique `id`, name, role, department, bio, etc.
 * 
 * 2. HOW TO REPLACE A MEMBER PHOTOGRAPH:
 *    - Place your photo file (e.g. member-1.jpg, member-2.png) inside:
 *      `src/assets/members/`
 *    - Import your photo at the top of this file:
 *      `import member1Photo from '../assets/members/member-1.jpg';`
 *    - Update the `image` property of that member:
 *      `image: member1Photo,`
 * 
 * 3. HOW TO CHANGE THE MEMBER'S NAME:
 *    - Edit the `name` string (e.g. `name: "Jane Doe"`).
 * 
 * 4. HOW TO UPDATE THE DESIGNATION / ROLE:
 *    - Edit the `role` string (e.g. `role: "Club President"`).
 * 
 * 5. HOW TO UPDATE CONTACT NUMBER:
 *    - Edit the `phone` string (e.g. `phone: "+1 (555) 234-5678"`).
 *    - If left empty `""` or `null`, the phone icon & link will NOT be shown.
 *    - It uses the standard `tel:` protocol for click-to-call on mobile.
 * 
 * 6. HOW TO UPDATE EMAIL ADDRESS:
 *    - Edit the `email` string (e.g. `email: "president@university-itclub.edu"`).
 *    - If left empty `""` or `null`, the email icon & link will NOT be shown.
 *    - It uses the standard `mailto:` protocol.
 * 
 * 7. HOW TO ADD OR REMOVE SOCIAL MEDIA LINKS:
 *    - Set `linkedin: "https://linkedin.com/in/username"` to display a link.
 *    - Set `linkedin: null` to hide the link.
 * ------------------------------------------------------------------------------
 */

import member1Img from '../assets/members/member-1.svg';
import member2Img from '../assets/members/member-2.svg';
import member3Img from '../assets/members/member-3.svg';
import member4Img from '../assets/members/member-4.svg';
import member5Img from '../assets/members/member-5.svg';
import member6Img from '../assets/members/member-6.svg';

export const MEMBERS = [
  {
    id: "member-1",
    // Name placeholder: Replace with actual student name
    name: "[ Student Name Placeholder ]",
    role: "Club President",
    department: "Department of Computer Science & Engineering",
    yearOfStudy: "Final Year Undergraduate",
    bio: "Passionate about student tech leadership, organizing university-wide innovation events, and creating open peer collaboration opportunities.",
    // Image placeholder: Replace with src/assets/members/member-1.jpg
    image: member1Img,
    // Contact details: Displayed only when provided (clickable tel: & mailto:)
    email: "president.itclub@university.edu",
    phone: "+1 (555) 019-2831",
    linkedin: "https://linkedin.com/in/sample-president",
    isPlaceholder: true // Set to false once real details are filled
  },
  {
    id: "member-2",
    name: "[ Student Name Placeholder ]",
    role: "Vice President",
    department: "Department of Information Technology",
    yearOfStudy: "Third Year Undergraduate",
    bio: "Focuses on club operations, faculty coordination, and building cross-departmental technology initiatives and student workshops.",
    image: member2Img,
    email: "vp.itclub@university.edu",
    phone: "+1 (555) 019-2832",
    linkedin: "https://linkedin.com/in/sample-vp",
    isPlaceholder: true
  },
  {
    id: "member-3",
    name: "[ Student Name Placeholder ]",
    role: "Event Coordinator",
    department: "Department of Software Engineering",
    yearOfStudy: "Third Year Undergraduate",
    bio: "Oversees planning and logistics for seminars, student exhibitions, tech quizzes, and venue setups across the campus.",
    image: member3Img,
    email: "events.itclub@university.edu",
    phone: "+1 (555) 019-2833",
    linkedin: "https://linkedin.com/in/sample-events",
    isPlaceholder: true
  },
  {
    id: "member-4",
    name: "[ Student Name Placeholder ]",
    role: "Technical Coordinator",
    department: "Department of Computer Science",
    yearOfStudy: "Third Year Undergraduate",
    bio: "Coordinates technical content for workshops, hands-on coding sessions, mentorship tables, and club digital assets.",
    image: member4Img,
    email: "technical.itclub@university.edu",
    phone: "+1 (555) 019-2834",
    linkedin: "https://linkedin.com/in/sample-technical",
    isPlaceholder: true
  },
  {
    id: "member-5",
    name: "[ Student Name Placeholder ]",
    role: "Creative & Media Coordinator",
    department: "Department of Digital Media & Design",
    yearOfStudy: "Second Year Undergraduate",
    bio: "Directs visual design, event posters, media coverage, student photography, and club presentation branding.",
    image: member5Img,
    email: "media.itclub@university.edu",
    phone: null, // Example: phone omitted
    linkedin: "https://linkedin.com/in/sample-media",
    isPlaceholder: true
  },
  {
    id: "member-6",
    name: "[ Student Name Placeholder ]",
    role: "Student Representative",
    department: "Department of Information Systems",
    yearOfStudy: "Second Year Undergraduate",
    bio: "Acts as a bridge between freshman students and club activities, encouraging participation in campus tech events.",
    image: member6Img,
    email: "representative.itclub@university.edu",
    phone: null,
    linkedin: null, // Example: social omitted
    isPlaceholder: true
  }
];
