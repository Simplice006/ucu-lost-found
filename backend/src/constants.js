// Must match frontend/src/constants.js
const LOCATION_GROUPS = [
  {
    "label": "Academic and administrative buildings",
    "places": [
      "Bishop Tucker Building",
      "Kivengere Block (K-Block)",
      "Maari Block (M-Block)",
      "Suubi Block",
      "Stephen and Peggy Noll Building (N-Block)",
      "Baskerville Block",
      "Mackay Block",
      "Pilkington Block",
      "Misaeri Kawuma Block (Academic Affairs)",
      "Walker Building",
      "Words of Hope Building",
      "Ankrah Foundation Building",
      "Jackson Turyagyenda Building",
      "School of Law",
      "Faculty of Engineering, Design and Technology",
      "ICMI Health and Social Sciences Building",
      "Department of Visual Arts and Design",
      "School of Journalism, Media and Communication Building"
    ]
  },
  {
    "label": "Libraries and research centres",
    "places": [
      "Hamu Mukasa Library",
      "Children's Library",
      "Theology Library",
      "UCU Archives",
      "Research, Partnerships and Innovations Offices",
      "Postgraduate Studies Offices",
      "Tech Park Science Laboratories",
      "Media and eLearning Laboratories",
      "Robotics Laboratories"
    ]
  },
  {
    "label": "Halls of residence",
    "places": [
      "Sabiti Hall",
      "Nsibambi Hall",
      "Florence Hall",
      "Josephine Tucker Hall",
      "Mirembe Hall",
      "Rachael Hall",
      "Winfred Hall",
      "Luwum Hall",
      "Garry House",
      "Continuing Education Residence Hall",
      "Tech Park Dormitory",
      "Tech Park Guest Housing",
      "Eunice Guest House",
      "Thelma Hall"
    ]
  },
  {
    "label": "Religious and community buildings",
    "places": [
      "Nkoyoyo Hall",
      "Ordinands' Village Classrooms",
      "Student Guild Office",
      "Student Boardroom",
      "University Chapel (Bishop Tucker Building)"
    ]
  },
  {
    "label": "Services and facilities",
    "places": [
      "Janani Luwum Dining Hall",
      "Allan Galpin Health Centre",
      "Counselling Office",
      "Police Post",
      "Security Headquarters / Gate House",
      "Stores / Procurement Office",
      "Gym and Athletic Department",
      "Basketball Court",
      "Volleyball Court",
      "Tennis Court",
      "Woodball Court",
      "Washing Bay",
      "Waste / Water Treatment Plant",
      "Water Treatment Tanks",
      "UCU Holdings",
      "USP Workspace",
      "The UCU Business Incubator"
    ]
  },
  {
    "label": "Other",
    "places": [
      "Other campus location"
    ]
  }
];

module.exports = {
  LOCATION_GROUPS,
  LOCATIONS: LOCATION_GROUPS.flatMap((g) => g.places),
  CATEGORIES: ['Keys','Phone','Laptop or tablet','Charger or cable','Wallet or purse','ID or student card','Bag','Books or notebooks','Clothing','Water bottle','Other'],
};
