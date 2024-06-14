import { PrismaClient } from "@prisma/client";
import { PasswordService } from "../src/services/utils/password.service";
const prisma = new PrismaClient();

function addQuestion(
  question: string,
  options: { value: string; isCorrect: boolean }[],
) {
  return prisma.question.upsert({
    where: { question },
    update: {},
    create: {
      question,
      options: {
        create: options,
      },
    },
  });
}

async function main() {
  const passwordService = new PasswordService();
  const testPassword1 = passwordService.hash("12345678");
  const testPassword2 = passwordService.hash("12345678");

  await prisma.user.upsert({
    where: { username: "test1@example.com" },
    update: {},
    create: {
      username: "test1@example.com",
      password_digest: testPassword1.hash,
      password_salt: testPassword1.salt,
    },
  });
  await prisma.user.upsert({
    where: { username: "test2@example.com" },
    update: {},
    create: {
      username: "test2@example.com",
      password_digest: testPassword2.hash,
      password_salt: testPassword2.salt,
    },
  });

  await addQuestion("How many legs does a spider have?", [
    { value: "4", isCorrect: true },
    { value: "6", isCorrect: false },
    { value: "8", isCorrect: false },
    { value: "10", isCorrect: false },
  ]);
  await addQuestion("How many hearts does an octopus have?", [
    { value: "1", isCorrect: false },
    { value: "3", isCorrect: false },
    { value: "4", isCorrect: true },
    { value: "5", isCorrect: false },
  ]);
  await addQuestion("How many eyes does a bee have?", [
    { value: "1", isCorrect: false },
    { value: "2", isCorrect: false },
    { value: "3", isCorrect: true },
    { value: "4", isCorrect: false },
  ]);
  await addQuestion("What is the most spoken language in the world?", [
    { value: "English", isCorrect: true },
    { value: "Spanish", isCorrect: false },
    { value: "French", isCorrect: false },
    { value: "Chinese", isCorrect: false },
  ]);
  await addQuestion("What is the second most spoken language in the world?", [
    { value: "English", isCorrect: false },
    { value: "Spanish", isCorrect: true },
    { value: "French", isCorrect: false },
    { value: "Chinese", isCorrect: false },
  ]);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
