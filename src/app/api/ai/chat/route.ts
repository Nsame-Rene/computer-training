import { NextRequest, NextResponse } from "next/server";

// Enhanced knowledge base for AI responses with conversational patterns
const KNOWLEDGE_BASE = {
  // Conversational patterns
  greetings: {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "howdy", "greetings"],
    responses: [
      "Hello! I'm here to help you with anything related to our school management system. What can I assist you with today?",
      "Hi there! Welcome to EduManage. I'm your AI assistant. How can I help you navigate our system?",
      "Hey! Great to see you. I'm here to guide you through all the features of our school platform. What would you like to know?",
      "Good day! I'm your EduManage assistant. Whether you need help with courses, grades, or system navigation, I'm here to help!"
    ]
  },

  thanks: {
    keywords: ["thank you", "thanks", "thank", "appreciate", "grateful"],
    responses: [
      "You're welcome! I'm always here if you need more help with the system.",
      "Happy to help! Don't hesitate to ask if you have more questions about EduManage.",
      "My pleasure! Feel free to reach out anytime for assistance with our school platform.",
      "Glad I could help! I'm here whenever you need guidance with the system."
    ]
  },

  smallTalk: {
    keywords: ["how are you", "how do you do", "what's up", "how's it going", "nice day"],
    responses: [
      "I'm doing well, thank you! I'm here and ready to help you with anything related to our school management system. What can I assist you with?",
      "I'm great! As your AI assistant, I'm always ready to help with EduManage features. How can I support you today?",
      "Doing fantastic! I'm designed to make your experience with our school platform smooth and easy. What would you like to know?"
    ]
  },

  // Programming assistance
  programming: {
    keywords: ["javascript", "python", "java", "typescript", "react", "code", "function", "variable", "loop", "array", "object", "class"],
    responses: [
      {
        question: /javascript|js/i,
        answer: "JavaScript is a versatile programming language perfect for web development! It's used for both frontend and backend development. Would you like to know about variables, functions, DOM manipulation, or React components?",
      },
      {
        question: /python/i,
        answer: "Python is excellent for beginners and professionals! It's great for data analysis, web development, automation, and AI. What aspect interests you - basics, web frameworks like Django/Flask, or data science?",
      },
      {
        question: /java/i,
        answer: "Java is a powerful, object-oriented language used for enterprise applications, Android development, and large-scale systems. It's known for its 'write once, run anywhere' philosophy. What would you like to learn about Java?",
      },
      {
        question: /function/i,
        answer: "Functions are reusable blocks of code that perform specific tasks. Here's the basic syntax:\n\nfunction myFunction(parameter) {\n  // code to execute\n  return result;\n}\n\n// Call the function\nmyFunction(argument);\n\nFunctions help organize and reuse code efficiently!",
      },
      {
        question: /loop|for|while/i,
        answer: "Loops repeat code execution. Here are the main types:\n\n// For loop - when you know how many times\nfor (let i = 0; i < 5; i++) {\n  console.log(i);\n}\n\n// While loop - when condition is true\nwhile (condition) {\n  // code\n}\n\n// For...of loop - for arrays\nfor (let item of array) {\n  console.log(item);\n}\n\nLoops are essential for processing collections of data!",
      },
      {
        question: /array/i,
        answer: "Arrays store multiple values in a single variable:\n\n// Create an array\nlet fruits = ['apple', 'banana', 'orange'];\n\n// Access elements\nconsole.log(fruits[0]); // 'apple'\n\n// Add elements\nfruits.push('grape');\n\n// Common methods: push(), pop(), slice(), map(), filter()\n\nArrays are fundamental for managing collections of data!",
      },
      {
        question: /object/i,
        answer: "Objects store key-value pairs and represent real-world entities:\n\n// Create an object\nlet person = {\n  name: 'John',\n  age: 30,\n  email: 'john@example.com'\n};\n\n// Access properties\nconsole.log(person.name);\nconsole.log(person['age']);\n\n// Add/modify properties\nperson.job = 'Developer';\n\nObjects help organize related data and functionality!",
      },
      {
        question: /react|component/i,
        answer: "React is a popular JavaScript library for building user interfaces. Key concepts:\n\n// Functional Component\nconst MyComponent = () => {\n  return <div>Hello World!</div>;\n};\n\n// Component with state\nconst Counter = () => {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Count: {count}\n    </button>\n  );\n};\n\nReact makes building interactive UIs easier and more maintainable!",
      },
    ],
  },

  // HTML & Web Development
  html: {
    keywords: ["html", "tag", "div", "button", "form", "input", "css", "markup", "web"],
    responses: [
      {
        question: /html\s+tutorial|learn\s+html/i,
        answer: "HTML (HyperText Markup Language) is the foundation of web pages. Here's a complete basic template:\n\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>My Web Page</title>\n</head>\n<body>\n  <header>\n    <h1>Welcome to My Site</h1>\n  </header>\n  \n  <main>\n    <p>This is my content.</p>\n  </main>\n  \n  <footer>\n    <p>&copy; 2024 My Site</p>\n  </footer>\n</body>\n</html>\n\nHTML provides the structure, CSS adds styling, and JavaScript adds interactivity!",
      },
      {
        question: /button/i,
        answer: "HTML buttons can trigger actions. Here are different types:\n\n<!-- Basic button -->\n<button>Click me</button>\n\n<!-- Button with click handler -->\n<button onclick=\"alert('Hello!')\">Click me</button>\n\n<!-- Submit button in form -->\n<button type=\"submit\">Submit Form</button>\n\n<!-- Styled button -->\n<button style=\"background: blue; color: white; padding: 10px;\">\n  Styled Button\n</button>\n\nButtons are essential for user interaction!",
      },
      {
        question: /form|input/i,
        answer: "HTML forms collect user input. Here's a comprehensive example:\n\n<form action=\"/submit\" method=\"POST\">\n  <!-- Text input -->\n  <label for=\"name\">Name:</label>\n  <input type=\"text\" id=\"name\" name=\"name\" required>\n  \n  <!-- Email input -->\n  <label for=\"email\">Email:</label>\n  <input type=\"email\" id=\"email\" name=\"email\" required>\n  \n  <!-- Password input -->\n  <label for=\"password\">Password:</label>\n  <input type=\"password\" id=\"password\" name=\"password\" required>\n  \n  <!-- Select dropdown -->\n  <label for=\"program\">Program:</label>\n  <select id=\"program\" name=\"program\">\n    <option value=\"web-dev\">Web Development</option>\n    <option value=\"data-science\">Data Science</option>\n  </select>\n  \n  <!-- Radio buttons -->\n  <label>Gender:</label>\n  <input type=\"radio\" id=\"male\" name=\"gender\" value=\"male\">\n  <label for=\"male\">Male</label>\n  <input type=\"radio\" id=\"female\" name=\"gender\" value=\"female\">\n  <label for=\"female\">Female</label>\n  \n  <!-- Checkbox -->\n  <input type=\"checkbox\" id=\"newsletter\" name=\"newsletter\">\n  <label for=\"newsletter\">Subscribe to newsletter</label>\n  \n  <!-- Textarea -->\n  <label for=\"message\">Message:</label>\n  <textarea id=\"message\" name=\"message\" rows=\"4\"></textarea>\n  \n  <!-- Submit button -->\n  <button type=\"submit\">Submit</button>\n</form>\n\nForms are crucial for user data collection!",
      },
      {
        question: /div|container/i,
        answer: "Div elements are the most versatile HTML containers:\n\n<!-- Basic div -->\n<div>\n  <h2>Section Title</h2>\n  <p>Content goes here...</p>\n</div>\n\n<!-- Div with class for styling -->\n<div class=\"container\">\n  <div class=\"header\">Header</div>\n  <div class=\"content\">Main content</div>\n  <div class=\"footer\">Footer</div>\n</div>\n\n<!-- Semantic divs -->\n<div class=\"card\">\n  <div class=\"card-header\">Card Title</div>\n  <div class=\"card-body\">Card content...</div>\n</div>\n\nDivs help organize and style your content structure!",
      },
      {
        question: /css|styling/i,
        answer: "CSS (Cascading Style Sheets) controls the visual appearance of HTML elements. Here are the three ways to add CSS:\n\n<!-- 1. Inline styles -->\n<h1 style=\"color: blue; font-size: 24px;\">Styled Heading</h1>\n\n<!-- 2. Internal stylesheet -->\n<style>\n  .my-class {\n    color: red;\n    font-weight: bold;\n  }\n</style>\n\n<!-- 3. External stylesheet -->\n<link rel=\"stylesheet\" href=\"styles.css\">\n\n/* styles.css */\n.my-class {\n  color: red;\n  font-weight: bold;\n}\n\nCSS makes your websites beautiful and responsive!",
      },
    ],
  },

  // Microsoft Office Tools
  officeTools: {
    keywords: ["word", "excel", "powerpoint", "office", "document", "spreadsheet", "presentation"],
    responses: [
      {
        question: /microsoft\s+word|word\s+tutorial|use\s+word/i,
        answer: "Microsoft Word - Complete Guide:\n\n📝 **Creating Documents:**\n• File > New > Blank document\n• Start typing or use templates\n\n🎨 **Formatting Text:**\n• Select text > Home tab > Font/Paragraph sections\n• Font: Change typeface, size, color, bold/italic/underline\n• Paragraph: Alignment, line spacing, indentation\n\n📄 **Page Layout:**\n• Margins: Layout tab > Margins\n• Orientation: Layout tab > Orientation\n• Page breaks: Ctrl+Enter\n\n🔧 **Advanced Features:**\n• Styles: Home tab > Styles gallery\n• Headers/Footers: Insert tab\n• Tables: Insert tab > Table\n• Images: Insert tab > Pictures\n\n💾 **Saving & Exporting:**\n• Ctrl+S to save\n• File > Save As > Choose format (PDF, DOCX, etc.)\n• AutoSave available with OneDrive\n\nWord is perfect for letters, reports, and documents!",
      },
      {
        question: /microsoft\s+excel|excel\s+tutorial|use\s+excel/i,
        answer: "Microsoft Excel - Complete Guide:\n\n📊 **Getting Started:**\n• Open Excel > New workbook\n• Cells contain data, formulas, or functions\n• Rows (1,2,3...) and Columns (A,B,C...)\n\n🔢 **Basic Formulas:**\n• Start with = sign\n• Addition: =A1+B1 or =SUM(A1:A10)\n• AutoSum: Select cells > Home > AutoSum\n\n📈 **Essential Functions:**\n• SUM: =SUM(range)\n• AVERAGE: =AVERAGE(range)\n• COUNT: =COUNT(range) - counts numbers\n• CountA: =COUNTA(range) - counts non-empty cells\n• MAX/MIN: =MAX(range)\n• IF: =IF(condition, true_value, false_value)\n\n📋 **Data Management:**\n• Sort: Select data > Data > Sort\n• Filter: Data > Filter\n• Remove duplicates: Data > Remove Duplicates\n\n📊 **Charts & Visualization:**\n• Select data > Insert tab > Charts\n• Types: Column, Line, Pie, Bar, etc.\n• Customize: Chart Design tab\n\n🎨 **Formatting:**\n• Cell formatting: Home tab > Number/Font/Fill\n• Conditional formatting: Home > Conditional Formatting\n• Borders and alignment\n\nExcel is powerful for data analysis and calculations!",
      },
      {
        question: /microsoft\s+powerpoint|powerpoint\s+tutorial|use\s+powerpoint|presentation/i,
        answer: "Microsoft PowerPoint - Complete Guide:\n\n🎯 **Creating Presentations:**\n• File > New > Blank presentation or use templates\n• Each slide tells part of your story\n\n📝 **Adding Content:**\n• Click placeholders to add text\n• Insert tab > Text Box for custom text\n• Insert tab > Pictures/Shapes/Icons/Charts\n\n🎨 **Design & Themes:**\n• Design tab > Themes gallery\n• Change colors, fonts, effects\n• Slide Master: View tab > Slide Master\n\n🔄 **Slide Management:**\n• Home tab > New Slide\n• Duplicate slides: Ctrl+D\n• Rearrange: Thumbnail pane on left\n\n✨ **Animations & Transitions:**\n• Transitions tab > Choose transition effects\n• Animations tab > Add entrance/exit effects\n• Animation Pane: Control timing and order\n\n🎤 **Presenting:**\n• F5 or Slide Show tab > From Beginning\n• Use Presenter View for notes\n• Laser pointer: Ctrl+L during slideshow\n• End show: Esc key\n\n💡 **Tips for Great Presentations:**\n• Keep slides clean and uncluttered\n• Use high-quality images\n• Practice your timing\n• Engage your audience\n\nPowerPoint brings your ideas to life!",
      },
      {
        question: /spreadsheet|formula|sum|average/i,
        answer: "Excel Formulas & Functions - Quick Reference:\n\n🔢 **Basic Math:**\n• Addition: =A1+B1 or =SUM(A1:A10)\n• Subtraction: =A1-B1\n• Multiplication: =A1*B1\n• Division: =A1/B1\n\n📊 **Statistical Functions:**\n• Average: =AVERAGE(range)\n• Count: =COUNT(range) - counts numbers\n• CountA: =COUNTA(range) - counts non-empty cells\n• Max: =MAX(range)\n• Min: =MIN(range)\n\n🧠 **Logical Functions:**\n• IF: =IF(condition, true_value, false_value)\n• AND: =AND(condition1, condition2)\n• OR: =OR(condition1, condition2)\n• NOT: =NOT(condition)\n\n📅 **Date & Time:**\n• Today: =TODAY()\n• Now: =NOW()\n• Date difference: =DATEDIF(start_date, end_date, \"d\")\n\n🔍 **Lookup Functions:**\n• VLOOKUP: Search vertically in a table\n• HLOOKUP: Search horizontally\n• INDEX/MATCH: More flexible than VLOOKUP\n\n💰 **Financial Functions:**\n• PMT: Calculate loan payments\n• FV: Future value\n• NPV: Net present value\n\nRemember: All formulas start with = and can reference cell ranges!",
      },
    ],
  },

  // Comprehensive EduManage System Knowledge
  system: {
    keywords: ["system", "dashboard", "enrollment", "attendance", "grade", "fee", "course", "student", "teacher", "program", "edumanage", "school"],
    responses: [
      {
        question: /dashboard|home|main\s+page/i,
        answer: "EduManage Dashboard Overview:\n\n👑 **CEO Dashboard:**\n• Complete system control\n• User management (students, teachers)\n• Program and course administration\n• Financial oversight (fees, payments)\n• System settings and configuration\n• Analytics and reports\n\n👨‍🏫 **Teacher Dashboard:**\n• Course management\n• Student attendance tracking\n• Grade entry and management\n• Project assignments\n• Timetable management\n• Student progress monitoring\n\n🎓 **Student Dashboard:**\n• Course enrollment and progress\n• Grade viewing\n• Attendance records\n• Fee payment status\n• Project submissions\n• Certificate downloads\n\nEach role has a tailored dashboard with relevant tools and information!",
      },
      {
        question: /enrollment|apply|register|join/i,
        answer: "Enrollment Process in EduManage:\n\n📋 **Step 1: Submit Application**\n• Visit the enrollment page\n• Fill out personal information\n• Select your desired program\n• Provide parent/guardian details\n• Submit your application\n\n⏳ **Step 2: Application Review**\n• CEO reviews your application\n• Status: Pending → Approved/Rejected\n• Approval generates your matricule number\n\n🔐 **Step 3: Account Activation**\n• Receive approval notification\n• Click activation link in email\n• Set your password\n• Complete profile information\n\n📚 **Step 4: Start Learning**\n• Access student dashboard\n• View enrolled courses\n• Check timetable\n• Begin your educational journey\n\n💡 **Tips:**\n• Ensure all information is accurate\n• Keep your matricule number safe\n• Contact support if you have issues\n• Check application status regularly",
      },
      {
        question: /attendance|present|absent/i,
        answer: "Attendance System in EduManage:\n\n📊 **How It Works:**\n• Teachers mark attendance for each course\n• Recorded per student, per course, per date\n• Status options: Present, Absent, Late\n\n👨‍🏫 **For Teachers:**\n• Go to Courses section\n• Select a course\n• View class list\n• Mark attendance for each session\n• Save attendance records\n\n🎓 **For Students:**\n• View your attendance records\n• See percentage by course\n• Monitor your attendance status\n• Get notified of low attendance\n\n📈 **Attendance Tracking:**\n• Daily attendance recording\n• Monthly/term summaries\n• Attendance percentages\n• Reports for parents/administration\n\n⚠️ **Important Notes:**\n• Regular attendance is crucial\n• Low attendance may affect grades\n• Make-up classes available for excused absences\n• Contact teachers for attendance concerns",
      },
      {
        question: /grade|result|score|mark/i,
        answer: "Grading System in EduManage:\n\n📊 **Grade Components:**\n• Continuous Assessment (CA): 40%\n• Final Examination: 60%\n• Total = CA + Exam Score\n\n📈 **Letter Grades:**\n• A: 80-100 (Excellent)\n• B: 70-79 (Very Good)\n• C: 60-69 (Good)\n• D: 50-59 (Pass)\n• F: 0-49 (Fail)\n\n👨‍🏫 **For Teachers:**\n• Enter CA scores throughout term\n• Record final exam results\n• System calculates totals automatically\n• Generate grade reports\n\n🎓 **For Students:**\n• View grades by course\n• See detailed breakdown (CA + Exam)\n• Access transcript\n• Track academic progress\n\n📋 **Grade Reports:**\n• Individual course grades\n• GPA calculations\n• Semester/term reports\n• Academic transcripts\n\n💡 **Tips:**\n• Regular assessment participation boosts CA\n• Exam preparation is crucial\n• Monitor progress regularly\n• Seek help when needed",
      },
      {
        question: /fee|payment|tuition|money/i,
        answer: "Fee Management System:\n\n💰 **Fee Structure:**\n• Program-specific tuition fees\n• Payment schedules (semester/term)\n• Additional fees (registration, materials)\n\n📊 **Fee Tracking:**\n• Due dates and amounts\n• Payment status (Pending/Paid/Overdue)\n• Payment history\n• Receipt numbers\n\n👑 **For CEO/Administration:**\n• Set tuition fees per program\n• Generate fee invoices\n• Record payments received\n• Send payment reminders\n• Generate financial reports\n\n🎓 **For Students:**\n• View outstanding fees\n• See payment deadlines\n• Make online payments\n• Download receipts\n• Payment history\n\n💳 **Payment Methods:**\n• Online payment portal\n• Bank transfers\n• Mobile money\n• Cash payments (recorded by admin)\n\n⚠️ **Important:**\n• Pay fees on time to avoid penalties\n• Keep payment receipts\n• Contact admin for payment issues\n• Late fees may apply",
      },
      {
        question: /course|subject|class/i,
        answer: "Course Management in EduManage:\n\n📚 **Course Structure:**\n• Each program has multiple courses\n• Courses have codes, titles, descriptions\n• Credit hours and prerequisites\n• Semester and year specifications\n\n👨‍🏫 **For Teachers:**\n• View assigned courses\n• Manage course content\n• Record attendance\n• Enter grades\n• Create assignments/projects\n\n🎓 **For Students:**\n• View enrolled courses\n• Access course materials\n• Check grades and progress\n• Submit assignments\n• View course timetable\n\n👑 **For CEO:**\n• Create and manage courses\n• Assign teachers to courses\n• Set course prerequisites\n• Monitor course performance\n\n📅 **Course Scheduling:**\n• Timetable management\n• Classroom assignments\n• Semester planning\n• Exam scheduling\n\n📊 **Course Analytics:**\n• Enrollment numbers\n• Pass/fail rates\n• Student performance\n• Teacher effectiveness",
      },
      {
        question: /program|degree|certificate/i,
        answer: "Programs in EduManage:\n\n🎓 **Available Programs:**\n• Computer Science\n• Information Technology\n• Software Development\n• Data Science\n• Web Development\n• Cybersecurity\n• And more...\n\n📋 **Program Details:**\n• Duration (1-4 years)\n• Tuition fees\n• Course curriculum\n• Career outcomes\n• Entry requirements\n\n👨‍🏫 **Program Management:**\n• Teachers assigned to programs\n• Course sequencing\n• Prerequisite management\n• Program completion tracking\n\n🎓 **Student Progression:**\n• Level advancement\n• Course completion\n• GPA tracking\n• Graduation requirements\n\n👑 **CEO Controls:**\n• Create new programs\n• Update program details\n• Set tuition fees\n• Monitor program performance\n• Accreditation management\n\n📜 **Certificates:**\n• Course completion certificates\n• Program graduation certificates\n• Professional certifications\n• Transcript generation",
      },
      {
        question: /user|account|login|password/i,
        answer: "User Account Management:\n\n🔐 **Account Types:**\n• CEO/Administrator: Full system access\n• Teachers: Course and student management\n• Students: Learning platform access\n\n📝 **Registration Process:**\n• Students: Apply → Approved → Activate account\n• Teachers: Hired → Account created by CEO\n• CEO: Pre-configured admin account\n\n🔑 **Login Information:**\n• Username: Usually email address\n• Password: Set during activation\n• Role-based access control\n\n⚙️ **Profile Management:**\n• Update personal information\n• Change password\n• Upload profile photo\n• Contact details\n\n🔒 **Security Features:**\n• Password encryption\n• Session management\n• Role-based permissions\n• Account activation required\n\n💡 **Account Tips:**\n• Use strong passwords\n• Keep login credentials secure\n• Update contact information\n• Report security concerns",
      },
      {
        question: /announcement|news|message|notification/i,
        answer: "Announcements & Communication System:\n\n📢 **Announcement Types:**\n• General announcements (all users)\n• Student-specific announcements\n• Teacher-specific announcements\n• Urgent notifications\n\n👑 **For CEO:**\n• Create announcements\n• Set target audience\n• Set priority levels\n• Schedule announcements\n\n👥 **For All Users:**\n• View announcements on dashboard\n• Filter by relevance\n• Mark as read\n• Search announcements\n\n💬 **Messaging System:**\n• Contact form for inquiries\n• Direct messages to administration\n• Support ticket system\n\n📧 **Communication Channels:**\n• In-system notifications\n• Email notifications\n• Dashboard alerts\n• Mobile notifications (future)\n\n📋 **Announcement Management:**\n• Priority levels (Low/Medium/High)\n• Read/unread status\n• Archiving old announcements\n• Search and filter options",
      },
      {
        question: /project|assignment|task/i,
        answer: "Project & Assignment System:\n\n📝 **Project Management:**\n• Teachers create projects\n• Students submit work\n• Due dates and requirements\n• Maximum scores\n\n👨‍🏫 **For Teachers:**\n• Create project assignments\n• Set deadlines and criteria\n• Review submissions\n• Grade and provide feedback\n• Track student progress\n\n🎓 **For Students:**\n• View assigned projects\n• Submit completed work\n• Check grades and feedback\n• Track submission status\n\n📊 **Project Features:**\n• File upload support\n• Progress tracking\n• Feedback system\n• Grade recording\n• Deadline reminders\n\n📈 **Assessment:**\n• Rubric-based grading\n• Feedback comments\n• Score recording\n• Progress analytics",
      },
      {
        question: /timetable|schedule|calendar/i,
        answer: "Timetable Management:\n\n📅 **Schedule Overview:**\n• Daily/weekly class schedules\n• Course timings and locations\n• Teacher assignments\n• Room allocations\n\n👨‍🏫 **For Teachers:**\n• View teaching schedule\n• Room assignments\n• Class preparation\n• Attendance marking\n\n🎓 **For Students:**\n• View class timetable\n• Know when/where classes are\n• Plan study time\n• Track attendance\n\n👑 **For CEO:**\n• Create/manage timetables\n• Assign teachers to courses\n• Allocate classrooms\n• Resolve scheduling conflicts\n• Generate schedule reports\n\n📊 **Timetable Features:**\n• Semester/year based\n• Day-of-week scheduling\n• Time slot management\n• Conflict detection\n• Print/export options",
      },
      {
        question: /certificate|certification|diploma/i,
        answer: "Certificate System:\n\n📜 **Certificate Types:**\n• Course completion certificates\n• Program graduation certificates\n• Achievement certificates\n• Professional certifications\n\n🎓 **For Students:**\n• View earned certificates\n• Download certificate PDFs\n• Share certificates\n• Certificate history\n\n👨‍🏫 **For Teachers:**\n• Recommend certificates\n• Verify student completion\n• Certificate approval\n\n👑 **For CEO:**\n• Issue certificates\n• Certificate templates\n• Bulk certificate generation\n• Certificate tracking\n\n📋 **Certificate Features:**\n• Unique certificate numbers\n• Digital signatures\n• QR code verification\n• Professional templates\n• Download and print options",
      },
      {
        question: /help|support|guide|tutorial/i,
        answer: "EduManage Help & Support:\n\n🤖 **AI Assistant (Me!):**\n• 24/7 instant help\n• Programming guidance\n• Office tools tutorials\n• System navigation\n• Feature explanations\n\n📚 **Help Resources:**\n• User manuals\n• Video tutorials\n• FAQ sections\n• Quick start guides\n\n💬 **Support Channels:**\n• Contact forms\n• Direct messaging\n• Email support\n• Help desk tickets\n\n📖 **Learning Resources:**\n• Course materials\n• Study guides\n• Practice exercises\n• Reference materials\n\n👥 **Community:**\n• Student forums\n• Teacher collaboration\n• Study groups\n• Mentorship programs\n\n🔧 **Technical Support:**\n• System troubleshooting\n• Account issues\n• Password resets\n• Bug reporting\n\nI'm here to help you navigate and make the most of EduManage!",
      },
    ],
  },
};

function findBestMatch(
  message: string,
  category: any
): string | null {
  for (const item of category.responses) {
    if (item.question.test(message)) {
      return item.answer;
    }
  }
  return null;
}

function generateAIResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // Check conversational patterns first
  for (const category of ['greetings', 'thanks', 'smallTalk']) {
    const answer = findBestMatch(lowerMessage, KNOWLEDGE_BASE[category]);
    if (answer) return answer;
  }

  // Search through knowledge base
  for (const category of Object.values(KNOWLEDGE_BASE)) {
    const answer = findBestMatch(lowerMessage, category);
    if (answer) return answer;
  }

  // Enhanced default responses for unknown questions
  const defaultResponses = [
    "That's an interesting question! I know about programming, HTML, Office tools, and our EduManage system. Can you rephrase or ask about one of these topics?",
    "I'm not sure about that specific topic, but I'm knowledgeable about:\n• JavaScript, Python, and other programming languages\n• HTML and web development\n• Microsoft Word, Excel, and PowerPoint\n• Our school management system features\n\nTry asking about these!",
    "Great question! While I might not have that specific answer, feel free to contact your teacher or administrator. In the meantime, I can help with programming, office tools, or system guidance.",
    "Hmm, that's outside my current knowledge base. But I can definitely help you with programming, HTML, office tools, and how to use our EduManage system. What would you like to know?",
    "I'd love to help! I'm an expert in programming languages, web development, office tools, and navigating our EduManage school system. What specific topic interests you?",
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message" },
        { status: 400 }
      );
    }

    const response = generateAIResponse(message);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return NextResponse.json(
      { error: "Failed to process your message" },
      { status: 500 }
    );
  }
}
