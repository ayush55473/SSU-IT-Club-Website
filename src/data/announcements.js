/**
 * ==============================================================================
 * UNIVERSITY IT CLUB — ANNOUNCEMENTS & ADMINISTRATIVE BULLETINS
 * ==============================================================================
 * 
 * HOW TO ADD AN ANNOUNCEMENT:
 * 1. Add a new object to the ANNOUNCEMENTS array below.
 * 2. Set 'pinned: true' if you want the announcement pinned to the top.
 * 3. Categories can be:
 *    - "Important Update"
 *    - "Upcoming Event"
 *    - "Workshop Announcement"
 *    - "Registration Reminder"
 *    - "Club Activity"
 * 
 * NOTE: Since this is a frontend-only project, announcements are updated by editing
 * this file and redeploying or rebuilding the project.
 */

export const ANNOUNCEMENTS = [
  {
    id: "ann-01",
    title: "Registration Now Open for Tech Innovation Workshop 2026",
    category: "Workshop Announcement",
    date: "October 18, 2026",
    pinned: true,
    shortMessage: "Registrations are officially open for our upcoming hands-on workshop on rapid tech prototyping. Limited to 120 seats on a first-come, first-served basis.",
    fullContent: `We are pleased to announce that registration for the Tech Innovation Workshop 2026 is now live! 

This interactive session focuses on ideation, collaborative problem solving, and modern digital prototyping. Students from all university faculties are invited to join. All participants will receive a certificate of completion and access to follow-up mentorship sessions organized by the IT Club.

Please register via the in-page form below before the deadline of November 12, 2026. Bring your personal laptop and your curiosity!`,
    author: "IT Club Executive Committee",
    actionLink: "#registration",
    actionText: "Reserve Your Spot"
  },
  {
    id: "ann-02",
    title: "Call for Student Project Submissions: Annual Tech Showcase",
    category: "Club Activity",
    date: "October 15, 2026",
    pinned: false,
    shortMessage: "Have you built a web application, mobile app, hardware prototype, or digital design project? Submit your work to be exhibited at the Student Creativity Showcase.",
    fullContent: `Submissions are open for our upcoming Student Creativity Showcase scheduled for December 05, 2026.

This is your opportunity to demonstrate your projects to faculty members, fellow students, and industry mentors. Selected projects will receive exhibition space at the Student Centre, promotional coverage on the IT Club social channels, and commemorative awards.

Submit your project abstract and repository/demo link using the showcase registration link by November 28, 2026.`,
    author: "Technical & Projects Committee",
    actionLink: "#events",
    actionText: "View Event Details"
  },
  {
    id: "ann-03",
    title: "Inter-College Tech Quiz: Rules & Team Formation Guidelines",
    category: "Upcoming Event",
    date: "October 12, 2026",
    pinned: false,
    shortMessage: "The official rulebook and team formation guidelines for the Inter-College Tech Quiz Competition are now published. Teams of two can register starting this week.",
    fullContent: `Prepare your minds! The annual Inter-College Tech Quiz will test knowledge across computer science history, hardware fundamentals, modern internet technologies, and scientific milestones.

Key Guidelines:
1. Teams must consist of exactly two undergraduate or postgraduate students from any recognized college/university.
2. The preliminary round will be conducted online, followed by the top 8 teams competing on stage in Auditorium Hall 1.
3. Exciting trophies, cash awards, and certificates will be presented to the finalists.

Check the events section for schedule details.`,
    author: "Events Organizing Team",
    actionLink: "#events",
    actionText: "Learn More"
  },
  {
    id: "ann-04",
    title: "Weekly Peer Mentorship & Collaboration Sessions Announcement",
    category: "Important Update",
    date: "October 05, 2026",
    pinned: false,
    shortMessage: "Starting this semester, the IT Club will host open peer-learning tables every Wednesday afternoon in the Technology Building study lounge.",
    fullContent: `To foster a collaborative student culture, the IT Club is introducing weekly open peer tables. Whether you are stuck on a programming assignment, eager to learn a new framework, or looking for teammates for your next project, stop by Room 402 every Wednesday from 3:00 PM to 5:00 PM.

No registration is required. All skill levels—from beginners to experienced programmers—are warmly welcome!`,
    author: "Student Engagement Lead",
    actionLink: "#about",
    actionText: "About Our Community"
  }
];

export const ANNOUNCEMENT_CATEGORIES = [
  "All",
  "Important Update",
  "Upcoming Event",
  "Workshop Announcement",
  "Club Activity"
];
