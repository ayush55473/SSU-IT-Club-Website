/**
 * ==============================================================================
 * UNIVERSITY IT CLUB — UPCOMING & RECENT EVENTS
 * ==============================================================================
 * 
 * HOW TO ADD A NEW EVENT:
 * 1. Add a new object to the EVENTS array below.
 * 2. Fill in the required fields: id, title, description, category, date,
 *    time, venue, deadline, status, and image.
 * 3. Status must be one of:
 *    - "Registration Open"
 *    - "Coming Soon"
 *    - "Registration Closed"
 *    - "Event Completed"
 * 4. (Optional) externalUrl: Set a Google Form or external link, or set to null
 *    to use the built-in landing page registration form.
 * 
 * NOTE: These are temporary sample events for demonstration purposes.
 * Replace with your club's confirmed events.
 */

import techWorkshopImg from '../assets/events/tech-workshop.svg';
import interCollegeQuizImg from '../assets/events/inter-college-quiz.svg';
import creativityShowcaseImg from '../assets/events/creativity-showcase.svg';
import techSeminarImg from '../assets/events/tech-seminar.svg';
import codingWorkshopImg from '../assets/events/coding-workshop.svg';
import annualMeetImg from '../assets/events/annual-meet.svg';

export const EVENTS = [
  {
    id: "tech-innovation-workshop",
    title: "Tech Innovation Workshop",
    shortDescription: "A practical, hands-on workshop guiding students through rapid prototyping, collaborative ideation, and emerging technological frameworks.",
    category: "Workshop",
    date: "November 14, 2026",
    time: "10:00 AM – 3:30 PM",
    venue: "Main Campus • Turing Auditorium (Block B)",
    deadline: "November 12, 2026",
    status: "Registration Open", // "Registration Open" | "Coming Soon" | "Registration Closed" | "Event Completed"
    image: techWorkshopImg,
    externalUrl: null, // null uses in-page registration form; or "https://forms.google.com/..."
    seatsTotal: 120,
    seatsLeft: 34,
    tags: ["Hands-On", "Innovation", "Certificates Provided"]
  },
  {
    id: "inter-college-quiz",
    title: "Inter-College Tech Quiz Competition",
    shortDescription: "Test your knowledge of technology history, modern advancements, computer science fundamentals, and IT innovations across universities.",
    category: "Competition",
    date: "November 22, 2026",
    time: "1:30 PM – 5:00 PM",
    venue: "Auditorium Hall 1 & Online Preliminary Round",
    deadline: "November 18, 2026",
    status: "Registration Open",
    image: interCollegeQuizImg,
    externalUrl: null,
    seatsTotal: 80,
    seatsLeft: 18,
    tags: ["Trophies & Prizes", "Team of 2", "Inter-College"]
  },
  {
    id: "student-creativity-showcase",
    //title: "Student Creativity & Tech Showcase",
    shortDescription: "An open exhibition where students present interactive web apps, creative digital design, utility tools, and hardware projects built this semester.",
    category: "Showcase",
    date: "December 05, 2026",
    time: "11:00 AM – 4:00 PM",
    venue: "Student Centre Exhibition Plaza",
    deadline: "November 28, 2026",
    status: "Registration Open",
    // Example of external registration URL (e.g. Google Forms or university portal)
    externalUrl: "https://docs.google.com/forms/sample-showcase-entry",
    seatsTotal: 50,
    seatsLeft: 12,
    tags: ["Exhibition", "Peer Feedback", "Project Stalls"]
  },
  {
    id: "technology-seminar",
    title: "Technology Seminar: Emerging Horizons",
    shortDescription: "Distinguished university alumni and guest speakers discuss current industry shifts, software career paths, and technical problem-solving.",
    category: "Seminar",
    date: "December 12, 2026",
    time: "2:00 PM – 4:30 PM",
    venue: "University Central Media Room",
    deadline: "December 08, 2026",
    status: "Coming Soon",
    image: techSeminarImg,
    externalUrl: null,
    seatsTotal: 150,
    seatsLeft: 150,
    tags: ["Guest Lecture", "Career Insights", "Q&A Session"]
  },
  {
    id: "coding-and-problem-solving",
    title: "Coding & Problem-Solving Bootcamp",
    shortDescription: "Interactive weekend session breaking down core algorithmic thinking, data structures, and intuitive problem-solving strategies for students.",
    category: "Workshop",
    date: "October 10, 2026",
    time: "10:00 AM – 1:00 PM",
    venue: "Computer Science Laboratory 3",
    deadline: "October 08, 2026",
    status: "Event Completed",
    image: codingWorkshopImg,
    externalUrl: null,
    seatsTotal: 60,
    seatsLeft: 0,
    tags: ["Bootcamp", "Problem Solving", "Archived"]
  },
  {
    id: "annual-it-club-meet",
    title: "Annual IT Club Meet & Induction",
    shortDescription: "Our annual celebratory gathering welcoming incoming members, reviewing club achievements, unveiling upcoming projects, and networking.",
    category: "Community",
    date: "October 02, 2026",
    time: "4:00 PM – 7:00 PM",
    venue: "University Amphitheatre",
    deadline: "October 01, 2026",
    status: "Event Completed",
    image: annualMeetImg,
    externalUrl: null,
    seatsTotal: 200,
    seatsLeft: 0,
    tags: ["Networking", "Induction", "Social"]
  }
];

export const EVENT_CATEGORIES = [
  "All",
  "Workshop",
  "Competition",
  "Showcase",
  "Seminar",
  "Community"
];
