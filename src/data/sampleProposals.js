import { 
  Globe, 
  Smartphone, 
  Cpu, 
  Building2, 
  Radio, 
  ShieldCheck 
} from 'lucide-react';

export const PROJECT_DOMAINS = [
  {
    id: 'web',
    name: 'Web Application',
    description: 'Portals, dashboards, collaborative web tools & institutional platforms',
    icon: Globe,
    badgeColor: 'bg-amber-100 text-[#672C1C] border-[#AE7B29]'
  },
  {
    id: 'mobile',
    name: 'Mobile App',
    description: 'Android / iOS student utilities, notifications, campus event companion apps',
    icon: Smartphone,
    badgeColor: 'bg-orange-100 text-[#672C1C] border-[#AE7B29]'
  },
  {
    id: 'ai-ml',
    name: 'AI & Data Science',
    description: 'Intelligent campus chatbots, predictive analytics, vision & NLP systems',
    icon: Cpu,
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
  },
  {
    id: 'automation',
    name: 'Campus Automation',
    description: 'Streamlining departmental workflows, resource booking, lab management',
    icon: Building2,
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300'
  },
  {
    id: 'iot',
    name: 'IoT & Smart Campus',
    description: 'Embedded sensors, smart hardware, RFID/NFC automation, energy monitors',
    icon: Radio,
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300'
  },
  {
    id: 'cloud-sec',
    name: 'Cloud & Security',
    description: 'Infrastructure utilities, identity access, open-source developer libraries',
    icon: ShieldCheck,
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300'
  }
];

export const BRANCH_OPTIONS = [
  "Computer Science & Engineering (CSE)",
  "Information Technology (IT)",
  "Artificial Intelligence & Data Science (AI & DS)",
  "Electronics & Communication Engineering (ECE)",
  "Electrical & Electronics Engineering (EEE)",
  "Mechanical Engineering",
  "Civil & Environmental Engineering",
  "Faculty of Management & Commerce",
  "Faculty of Agriculture & Food Technology",
  "Department of Basic Sciences & Humanities",
  "Faculty of Architecture & Design",
  "Interdisciplinary / Other Department"
];

export const PROGRAM_OPTIONS = [
  // Student Programs
  "B.Tech (Bachelor of Technology)",
  "BCA (Bachelor of Computer Applications)",
  "MCA (Master of Computer Applications)",
  "M.Tech (Master of Technology)",
  "B.Sc (Computer Science / Data Science)",
  "M.Sc (Data Science / Information Science)",
  "Ph.D. Research Scholar",
  // Faculty Options
  "Faculty / Assistant Professor",
  "Faculty / Associate Professor",
  "Faculty / Professor",
  "Head of Department (HOD)",
  "Dean / Director / Academic Head",
  "Lab Incharge / Technical Staff"
];

export const SAMPLE_PROPOSALS = [
  {
    id: "sample-1",
    role: "student",
    proposerName: "Rohit Kumar",
    branch: "Computer Science & Engineering (CSE)",
    program: "B.Tech (Bachelor of Technology)",
    domain: "Web Application",
    title: "Centralized Student Project Repository & Peer Review Portal",
    problemStatement: "Student semester capstone projects and hackathon code repositories are scattered across personal Google Drives, resulting in project duplication, lost intellectual property, and lack of peer learning across batches.",
    explanation: "Every year, final-year and pre-final year students build hundreds of innovative apps, but juniors have no centralized archive to inspect previous work, explore existing codebases, or continue development. A university-wide project repository will preserve campus tech assets and encourage peer code reviews.",
    objectives: [
      "Searchable catalog of past projects tagged by tech stack and academic year",
      "Interactive code demo viewer and GitHub repository link integration",
      "Peer review and feedback mechanism for junior-senior collaboration",
      "Team-building board for upcoming inter-college hackathons"
    ],
    urgency: "Medium (Targeted for Spring Semester)",
    status: "Approved for IT Cell Incubation"
  },
  {
    id: "sample-2",
    role: "faculty",
    proposerName: "Dr. Manisha Rao",
    branch: "Electronics & Communication Engineering (ECE)",
    program: "Faculty / Associate Professor",
    domain: "Campus Automation",
    title: "Smart Hardware Component & Lab Equipment Checkout System",
    problemStatement: "Manual paper-based logbooks in the embedded systems and robotics laboratories cause frequent component loss, delayed returns, and lack of visibility into available inventory for student experiments.",
    explanation: "Faculty and lab technical staff spend significant time reconciling paper logs of microcontrollers (Raspberry Pi, Arduino, ESP32 boards) and electronic sensor modules. An automated system with student ID barcode scanning and automated return alerts will drastically reduce equipment damage and loss.",
    objectives: [
      "Instant barcode / QR check-out using student university ID cards",
      "Real-time laboratory inventory dashboard showing available sensor modules",
      "Automated email and SMS return reminders 24 hours before due date",
      "Administrative damage / penalty tracking and maintenance log"
    ],
    urgency: "High (Needed Before Next Academic Term)",
    status: "Under Active Development by IT Cell Sprint Team"
  },
  {
    id: "sample-3",
    role: "student",
    proposerName: "Ananya Verma",
    branch: "Information Technology (IT)",
    program: "MCA (Master of Computer Applications)",
    domain: "AI & Data Science",
    title: "AI-Powered Campus Lost & Found Helper with Image Matching",
    problemStatement: "Valuable belongings like student ID cards, notebooks, lab coats, and accessories lost across campus auditoriums and libraries rarely reach their rightful owners due to disjointed WhatsApp groups.",
    explanation: "Currently, students post lost item notices in crowded WhatsApp groups where messages get buried within minutes. An intelligent campus portal with image-based matching and secure claim verification will allow students to report lost or found items and receive automated match notifications.",
    objectives: [
      "Image-based classification and automated visual similarity matching",
      "Instant email notification to student when a matched item is surrendered",
      "Secure claim verification requiring campus security or block warden approval",
      "Public status board of recently recovered and claimed items"
    ],
    urgency: "Normal (Ongoing Campus Initiative)",
    status: "Community Proposal Showcase"
  }
];
