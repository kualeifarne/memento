import "dotenv/config";

import { prisma } from "@/lib/prisma";

const COURSE_TITLE = "JavaScript";

const cards = [
  {
    prompt:
      "What ES6+ syntax lets you expand an iterable (array/object) where multiple elements are expected?",
    answer:
      "The spread syntax (...), e.g. const newArray = [...originalArray, 4, 5];",
  },
  {
    prompt: "What does the rest parameter syntax do in a function definition?",
    answer:
      "It collects the remaining arguments passed to a function into an array, e.g. function sum(...numbers) { return numbers.reduce((t,n)=>t+n,0); }",
  },
  {
    prompt: "What is the difference between let and const?",
    answer:
      "const declares a variable that cannot be reassigned; let declares a variable that can be reassigned. Both are block-scoped, unlike var.",
  },
  {
    prompt: "What is object destructuring? Give an example.",
    answer:
      "A syntax to unpack values from objects into distinct variables, e.g. const { name, age } = user;",
  },
  {
    prompt: "What is array destructuring? Give an example.",
    answer:
      "A syntax to unpack values from arrays into distinct variables, e.g. const [first, second] = [10, 20];",
  },
  {
    prompt:
      "How do you write an arrow function equivalent to function add(a, b) { return a + b; }?",
    answer: "const add = (a, b) => a + b;",
  },
  {
    prompt: "What does Array.prototype.map() do?",
    answer:
      "It transforms each item in an array and returns a new array of the transformed items, e.g. numbers.map(n => n * 2)",
  },
  {
    prompt: "What does Array.prototype.filter() do?",
    answer:
      "It returns a new array containing only the elements that pass a given test/condition, e.g. numbers.filter(n => n % 2 === 0)",
  },
  {
    prompt: "What does Array.prototype.reduce() do?",
    answer:
      "It accumulates array elements into a single value using a callback, e.g. numbers.reduce((total, n) => total + n, 0)",
  },
  {
    prompt:
      "What is the difference between a default export and a named export in JavaScript modules?",
    answer:
      "A file can have only one default export (imported without curly braces, any name), but multiple named exports (imported with curly braces, matching names).",
  },
  {
    prompt: "How do you write an async function that awaits a fetch call?",
    answer:
      "async function fetchData() { try { const res = await fetch(url); const data = await res.json(); return data; } catch (e) { console.error(e); } }",
  },
];

async function main() {
  await prisma.course.deleteMany({ where: { title: COURSE_TITLE } });

  const course = await prisma.course.create({
    data: {
      title: COURSE_TITLE,
      description: "Practice ES6+ JavaScript syntax, arrays, and modules.",
      decks: {
        create: {
          title: "ES6+ Syntax",
          order: 0,
          cards: {
            create: cards.map((card, index) => ({
              ...card,
              order: index,
            })),
          },
        },
      },
    },
    include: {
      decks: {
        include: {
          _count: { select: { cards: true } },
        },
      },
    },
  });

  const deck = course.decks[0];
  console.log(`Seeded course "${course.title}" (${course.id})`);
  console.log(`  Deck: "${deck.title}" with ${deck._count.cards} cards`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
