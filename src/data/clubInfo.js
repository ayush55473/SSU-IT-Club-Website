

export const CLUB_INFO = {
  // University & Club Identity
  universityName: "Sri Sri University",
  universitySubtext: "Learn | Lead | Serve • Faculty of Engineering & Technology",
  clubName: "IT Club",
  clubTagline: "Where Ideas Meet Innovation",
  clubDescription: "Bringing students together to explore technology, exchange ideas, learn new skills, and create meaningful experiences through events, workshops, and collaboration.",
  
  // Official Contact Information (Replace placeholders with your club's actual details)
  contact: {
    email: "itclub@university.edu", // Update with official IT club email
    alternateEmail: "contact.itclub@university.edu",
    phone: "+1 (555) 123-4567", // Update with official club phone or leave empty
    location: "Technology Building, Room 402, Main University Campus",
    city: "University City, State 12345",
    officeHours: "Monday – Friday: 10:00 AM – 5:00 PM",
  },

  // Social Media Links (Update URLs with your actual profiles, or set to null to hide)
  socialLinks: {
    instagram: "https://instagram.com/university_itclub",
    linkedin: "https://linkedin.com/company/university-it-club",
    youtube: "https://youtube.com/@universityitclub",
    github: "https://github.com/university-it-club",
    twitter: null, // Set URL or null to omit
  },

  // Logos configuration - separate and independently editable
  // Replace the SVG files in src/assets/ with your real PNG/SVG files
  logos: {
    university: {
      alt: "State University Official Logo",
      height: 44, // Modify pixel height easily
      // Path reference: replace file at src/assets/university-logo.svg or university-logo.png
    },
    club: {
      alt: "University IT Club Official Logo",
      height: 44, // Modify pixel height easily
      // Path reference: replace file at src/assets/it-club-logo.svg or it-club-logo.png
    }
  }
};
