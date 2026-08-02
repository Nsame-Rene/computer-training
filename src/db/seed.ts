import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── CEO User ───────────────────────────────────────────────
  const ceoPassword = await bcrypt.hash("admin123", 10);
  const ceo = await prisma.user.upsert({
    where: { email: "admin@edumanage.cm" },
    update: {},
    create: {
      email: "admin@edumanage.cm",
      password: ceoPassword,
      firstName: "Emmanuel",
      lastName: "Ngum",
      role: "ceo",
      phone: "+237677000001",
    },
  });
  console.log("✅ CEO created:", ceo.email);

  // ─── Teacher Users ──────────────────────────────────────────
  const teacherPassword = await bcrypt.hash("teacher123", 10);

  const teacher1User = await prisma.user.upsert({
    where: { email: "paul.ngum@edumanage.cm" },
    update: {},
    create: {
      email: "paul.ngum@edumanage.cm",
      password: teacherPassword,
      firstName: "Paul",
      lastName: "Ngum",
      role: "teacher",
      phone: "+237677100001",
    },
  });

  await prisma.teacher.upsert({
    where: { userId: teacher1User.id },
    update: {},
    create: {
      teacherId: "TCH001",
      userId: teacher1User.id,
      department: "Computer Science",
      specialization: "AI & Machine Learning",
      office: "Office 201, Block A",
    },
  });
  console.log("✅ Teacher created:", teacher1User.email);

  const teacher2User = await prisma.user.upsert({
    where: { email: "marie.atanga@edumanage.cm" },
    update: {},
    create: {
      email: "marie.atanga@edumanage.cm",
      password: teacherPassword,
      firstName: "Marie",
      lastName: "Atanga",
      role: "teacher",
      phone: "+237677100002",
    },
  });

  await prisma.teacher.upsert({
    where: { userId: teacher2User.id },
    update: {},
    create: {
      teacherId: "TCH002",
      userId: teacher2User.id,
      department: "Business",
      specialization: "Strategic Management",
      office: "Office 105, Block B",
    },
  });

  // ─── Student Users ──────────────────────────────────────────
  const studentPassword = await bcrypt.hash("student123", 10);

  const student1User = await prisma.user.upsert({
    where: { email: "amara.fonkeng@student.edumanage.cm" },
    update: {},
    create: {
      email: "amara.fonkeng@student.edumanage.cm",
      password: studentPassword,
      firstName: "Amara",
      lastName: "Fonkeng",
      role: "student",
      phone: "+237677200001",
    },
  });

  await prisma.student.upsert({
    where: { userId: student1User.id },
    update: {},
    create: {
      studentId: "STU2024001",
      userId: student1User.id,
      program: "bsc-computer-science",
      level: 2,
      gender: "female",
      address: "Bamenda, NW Region",
    },
  });
  console.log("✅ Student created:", student1User.email);

  const student2User = await prisma.user.upsert({
    where: { email: "brice.nkemdirim@student.edumanage.cm" },
    update: {},
    create: {
      email: "brice.nkemdirim@student.edumanage.cm",
      password: studentPassword,
      firstName: "Brice",
      lastName: "Nkemdirim",
      role: "student",
      phone: "+237677200002",
    },
  });

  await prisma.student.upsert({
    where: { userId: student2User.id },
    update: {},
    create: {
      studentId: "STU2024002",
      userId: student2User.id,
      program: "bsc-business-administration",
      level: 1,
      gender: "male",
      address: "Bamenda, NW Region",
    },
  });

  // Programs are intentionally not seeded with demo course data.
  // Create real programs from the CEO dashboard.

  // Courses, sample results, and testimonies are intentionally not seeded.
  // They should be created from the dashboards so production installs start clean.

  // No demo fees are seeded.

  // No demo announcements are seeded.

  // No demo testimonies are seeded.

  // No demo About Us content is seeded.

  // No demo gallery or service records are seeded.

  // ─── School Settings ────────────────────────────────────────
  await prisma.schoolSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      schoolName: "Computer Training Institute",
      ceoFirstName: "Dr.",
      ceoLastName: "Emmanuel Ngum",
      ceoTitle: "Chief Executive Officer",
      schoolMotto: "Excellence in Technology Education",
      schoolAddress: "Bamenda, North West Region, Cameroon",
      schoolPhone: "+237677000001",
      schoolEmail: "admin@edumanage.cm",
      aiName: "EduAssistant",
    },
  });
  console.log("✅ School settings initialized");

  console.log("\n🎉 Seeding complete!\n");
  console.log("──────────────────────────────────────────");
  console.log("🔑 Login Credentials:");
  console.log("   CEO:     admin@edumanage.cm       / admin123");
  console.log("   Teacher: paul.ngum@edumanage.cm   / teacher123");
  console.log("   Student: amara.fonkeng@student.edumanage.cm / student123");
  console.log("──────────────────────────────────────────");
  console.log("🤖 AI Assistant: EduAssistant");
  console.log("   Configure the AI name in CEO Dashboard > Settings");
  console.log("──────────────────────────────────────────");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
