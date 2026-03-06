import { PrismaClient, Role, JobType, ItemStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Password123!", 10);

  const [student, business, admin] = await Promise.all([
    prisma.user.upsert({
      where: { email: "student@campushub.app" },
      update: {},
      create: {
        name: "Aisha Student",
        email: "student@campushub.app",
        password,
        university: "University of Cape Town",
        role: Role.student
      }
    }),
    prisma.user.upsert({
      where: { email: "biz@campushub.app" },
      update: {},
      create: {
        name: "Campus Tech Store",
        email: "biz@campushub.app",
        password,
        university: "University of Cape Town",
        role: Role.business
      }
    }),
    prisma.user.upsert({
      where: { email: "admin@campushub.app" },
      update: {},
      create: {
        name: "CampusHub Admin",
        email: "admin@campushub.app",
        password,
        university: "CampusHub HQ",
        role: Role.admin
      }
    })
  ]);

  await prisma.service.create({
    data: {
      title: "Calculus Tutoring",
      description: "1-on-1 tutoring for first year calculus modules.",
      price: 20,
      category: "Tutoring",
      sellerId: student.id,
      university: student.university
    }
  });

  await prisma.note.create({
    data: {
      title: "Computer Science 101 Exam Pack",
      course: "CSC101",
      university: student.university,
      price: 8,
      fileUrl: "https://example.com/notes/csc101.pdf",
      uploaderId: student.id
    }
  });

  await prisma.job.create({
    data: {
      title: "Student Brand Ambassador",
      company: "Campus Tech Store",
      description: "Promote campus offers and help run student activations.",
      pay: 15,
      location: "Cape Town",
      type: JobType.part_time,
      postedBy: business.id
    }
  });

  await prisma.item.create({
    data: {
      title: "Used Engineering Textbook",
      description: "Good condition, 3rd edition",
      price: 35,
      category: "Textbooks",
      sellerId: student.id,
      images: ["https://example.com/items/textbook.jpg"],
      university: student.university,
      status: ItemStatus.available
    }
  });

  await prisma.deal.create({
    data: {
      businessName: "Campus Tech Store",
      title: "20% off laptop accessories",
      description: "Valid with student card.",
      discount: "20%",
      location: "Main Road, Cape Town",
      expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    }
  });

  await prisma.post.create({
    data: {
      authorId: student.id,
      content: "Anyone joining the startup networking event this Friday?"
    }
  });

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
