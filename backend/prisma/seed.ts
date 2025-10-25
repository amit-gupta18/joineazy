import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting database seed...");

    // --- Admins ---
    const admins = await prisma.user.createMany({
        data: [
            { name: "Admin One", email: "admin1@example.com", passwordHash: "hashed1", role: "admin" },
            { name: "Admin Two", email: "admin2@example.com", passwordHash: "hashed2", role: "admin" },
        ],
    });

    // --- Students ---
    const students = await prisma.user.createMany({
        data: [
            { name: "Amit Gupta", email: "amit@student.com", passwordHash: "amit123", role: "student" },
            { name: "Rohit Kumar", email: "rohit@student.com", passwordHash: "rohit123", role: "student" },
            { name: "Sneha Verma", email: "sneha@student.com", passwordHash: "sneha123", role: "student" },
            { name: "Arjun Mehta", email: "arjun@student.com", passwordHash: "arjun123", role: "student" },
        ],
    });

    // Fetch created users (since createMany doesn’t return them)
    const allUsers = await prisma.user.findMany();
    const admin1 = allUsers.find(u => u.email === "admin1@example.com")!;
    const admin2 = allUsers.find(u => u.email === "admin2@example.com")!;
    const [amit, rohit, sneha, arjun] = allUsers.filter(u => u.role === "student");

    // --- Groups ---
    const group1 = await prisma.group.create({
        data: {
            name: "AI Builders",
            createdById: amit.id,
            members: {
                create: [
                    { studentId: amit.id, isConfirmed: true },
                    { studentId: rohit.id, isConfirmed: true },
                ],
            },
        },
    });

    const group2 = await prisma.group.create({
        data: {
            name: "Data Visionaries",
            createdById: sneha.id,
            members: {
                create: [
                    { studentId: sneha.id, isConfirmed: true },
                    { studentId: arjun.id, isConfirmed: true },
                    { studentId: amit.id, isConfirmed: false },
                ],
            },
        },
    });

    // --- Assignments ---
    const assignment1 = await prisma.assignment.create({
        data: {
            title: "AI Project Proposal",
            description: "Submit a project proposal on generative AI.",
            dueDate: new Date("2025-11-10T23:59:00.000Z"),
            onedriveLink: "https://onedrive.com/assignments/ai-proposal",
            createdByAdminId: admin1.id,
        },
    });

    const assignment2 = await prisma.assignment.create({
        data: {
            title: "Data Engineering Report",
            description: "Build a data pipeline using Python and PostgreSQL.",
            dueDate: new Date("2025-12-01T23:59:00.000Z"),
            onedriveLink: "https://onedrive.com/assignments/data-report",
            createdByAdminId: admin2.id,
        },
    });

    const assignment3 = await prisma.assignment.create({
        data: {
            title: "System Design Presentation",
            description: "Prepare slides explaining scalability principles.",
            dueDate: new Date("2025-12-15T23:59:00.000Z"),
            onedriveLink: "https://onedrive.com/assignments/system-design",
            createdByAdminId: admin1.id,
        },
    });

    // --- Group Submissions ---
    await prisma.groupSubmission.createMany({
        data: [
            {
                groupId: group1.id,
                assignmentId: assignment1.id,
                isSubmitted: true,
                submittedAt: new Date("2025-10-20T12:00:00.000Z"),
            },
            {
                groupId: group2.id,
                assignmentId: assignment1.id,
                isSubmitted: false,
            },
            {
                groupId: group1.id,
                assignmentId: assignment2.id,
                isSubmitted: false,
            },
            {
                groupId: group2.id,
                assignmentId: assignment3.id,
                isSubmitted: true,
                submittedAt: new Date("2025-10-22T09:30:00.000Z"),
            },
        ],
    });

    console.log("✅ Database seeded successfully!");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error("❌ Seed failed:", e);
        await prisma.$disconnect();
        process.exit(1);
    });
