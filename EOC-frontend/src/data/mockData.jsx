export const mockData = {
  currentUser: {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@university.edu",
    studentId: "STU2024001",
    department: "Computer Science",
    year: "3rd Year",
    phone: "+1 234-567-8900",
    avatar: "AJ",
    bio: "Passionate about technology and innovation. Always eager to learn new things."
  },
  events: [
    {
      id: 1,
      title: "Tech Symposium 2025",
      description: "Annual technology symposium featuring industry leaders and innovative projects.",
      date: "2025-11-15",
      time: "09:00 AM",
      location: "Main Auditorium",
      category: "Technical",
      capacity: 200,
      registered: 145,
      organizer: "Tech Club",
      duration: "Full Day"
    },
    {
      id: 2,
      title: "Cultural Fest",
      description: "Celebrate diversity with performances, food stalls, and cultural exhibitions.",
      date: "2025-11-20",
      time: "05:00 PM",
      location: "Campus Ground",
      category: "Cultural",
      capacity: 500,
      registered: 320,
      organizer: "Cultural Committee",
      duration: "3 Days"
    },
    {
      id: 3,
      title: "Hackathon 2025",
      description: "24-hour coding marathon with exciting prizes and mentorship opportunities.",
      date: "2025-12-01",
      time: "08:00 AM",
      location: "Innovation Lab",
      category: "Technical",
      capacity: 100,
      registered: 87,
      organizer: "Coding Club",
      duration: "24 Hours"
    },
    {
      id: 4,
      title: "Sports Meet 2024",
      description: "Inter-department sports competition featuring various athletic events.",
      date: "2024-09-10",
      time: "07:00 AM",
      location: "Sports Complex",
      category: "Sports",
      capacity: 300,
      registered: 280,
      organizer: "Sports Committee",
      duration: "2 Days",
      completed: true
    },
    {
      id: 5,
      title: "AI Workshop Series",
      description: "Learn about artificial intelligence and machine learning from experts.",
      date: "2024-08-20",
      time: "02:00 PM",
      location: "CS Department",
      category: "Workshop",
      capacity: 50,
      registered: 50,
      organizer: "AI Lab",
      duration: "4 Weeks",
      completed: true
    },
    {
      id: 6,
      title: "Career Fair 2025",
      description: "Meet top recruiters and explore career opportunities across industries.",
      date: "2025-10-30",
      time: "10:00 AM",
      location: "Convention Center",
      category: "Career",
      capacity: 400,
      registered: 312,
      organizer: "Placement Cell",
      duration: "Full Day"
    }
  ],
  registeredEvents: [1, 4, 5],
  certificates: [
    {
      id: 1,
      eventId: 4,
      eventName: "Sports Meet 2024",
      issuedDate: "2024-09-15",
      certificateUrl: "#",
      achievement: "Participant"
    },
    {
      id: 2,
      eventId: 5,
      eventName: "AI Workshop Series",
      issuedDate: "2024-09-25",
      certificateUrl: "#",
      achievement: "Completion Certificate"
    }
  ],
  notifications: [
    {
      id: 1,
      title: "Registration Confirmed",
      message: "Your registration for Tech Symposium 2025 has been confirmed.",
      date: "2025-10-20",
      read: false,
      type: "success"
    },
    {
      id: 2,
      title: "Upcoming Event Reminder",
      message: "Career Fair 2025 is starting in 4 days. Don't miss it!",
      date: "2025-10-26",
      read: false,
      type: "info"
    },
    {
      id: 3,
      title: "Certificate Available",
      message: "Your certificate for AI Workshop Series is ready to download.",
      date: "2025-09-25",
      read: true,
      type: "success"
    },
    {
      id: 4,
      title: "New Event Added",
      message: "Check out the newly added Hackathon 2025 event!",
      date: "2025-10-15",
      read: true,
      type: "info"
    }
  ]
};
