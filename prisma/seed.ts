import "dotenv/config";

import { prisma } from "@/lib/prisma";

const COURSE_TITLE = "React Cert Prep";

const decks = [
  {
    title: "Welcome.txt",
    cards: [
      { prompt: "What Node.js version is required for the React Developer Certification code challenges?", answer: "Node.js version 16.0 or above." },
      { prompt: "What IDE is used during the actual React Developer Certification exam?", answer: "An embedded IDE powered by StackBlitz." },
    ],
  },
  {
    title: "Chapter 1 - JavaScript.txt",
    cards: [
      { prompt: "What ES6+ syntax lets you expand an iterable (array/object) where multiple elements are expected?", answer: "The spread syntax (...), e.g. const newArray = [...originalArray, 4, 5];" },
      { prompt: "What does the rest parameter syntax do in a function definition?", answer: "It collects the remaining arguments passed to a function into an array, e.g. function sum(...numbers) { return numbers.reduce((t,n)=>t+n,0); }" },
      { prompt: "What is the difference between let and const?", answer: "const declares a variable that cannot be reassigned; let declares a variable that can be reassigned. Both are block-scoped, unlike var." },
      { prompt: "What is object destructuring? Give an example.", answer: "A syntax to unpack values from objects into distinct variables, e.g. const { name, age } = user;" },
      { prompt: "What is array destructuring? Give an example.", answer: "A syntax to unpack values from arrays into distinct variables, e.g. const [first, second] = [10, 20];" },
      { prompt: "How do you write an arrow function equivalent to function add(a, b) { return a + b; }?", answer: "const add = (a, b) => a + b;" },
      { prompt: "What does Array.prototype.map() do?", answer: "It transforms each item in an array and returns a new array of the transformed items, e.g. numbers.map(n => n * 2)" },
      { prompt: "What does Array.prototype.filter() do?", answer: "It returns a new array containing only the elements that pass a given test/condition, e.g. numbers.filter(n => n % 2 === 0)" },
      { prompt: "What does Array.prototype.reduce() do?", answer: "It accumulates array elements into a single value using a callback, e.g. numbers.reduce((total, n) => total + n, 0)" },
      { prompt: "What is the difference between a default export and a named export in JavaScript modules?", answer: "A file can have only one default export (imported without curly braces, any name), but multiple named exports (imported with curly braces, matching names)." },
      { prompt: "How do you write an async function that awaits a fetch call?", answer: "async function fetchData() { try { const res = await fetch(url); const data = await res.json(); return data; } catch (e) { console.error(e); } }" },
    ],
  },
  {
    title: "Chapter 2 - Core Concepts & Tooling.txt",
    cards: [
      { prompt: "What is React?", answer: "A JavaScript library, maintained by Meta, for building user interfaces out of small, reusable, nestable components using a declarative approach." },
      { prompt: "What build tool does this course use to bootstrap React apps?", answer: "Vite (e.g. npm create vite@latest my-react-app -- --template react)" },
      { prompt: "What does the createRoot API do?", answer: "It is the entry point for rendering React into the DOM; createRoot(container) creates a root that can render/update components via root.render(<App />)." },
      { prompt: "How do you add React to only part of an existing (non-React) website?", answer: "Find/create a DOM container element, then call createRoot(container).render(<Component />) to mount React only into that container, leaving the rest of the page untouched." },
      { prompt: "What does React.createElement do and how does it relate to JSX?", answer: "It creates a React element programmatically (type, props, children); JSX is compiled down to createElement calls under the hood." },
      { prompt: "What is React Developer Tools?", answer: "A browser extension for inspecting component hierarchies, and examining props and state to help debug React applications." },
    ],
  },
  {
    title: "Chapter 3 - JSX.txt",
    cards: [
      { prompt: "What is JSX?", answer: "A syntax extension for JavaScript that lets you write HTML-like markup directly inside JavaScript files to describe UI." },
      { prompt: "Why and how would you use a Fragment (<>...</>) in JSX?", answer: "To group multiple elements and return them without adding an extra node to the DOM, e.g. return (<><h1>Title</h1><p>Text</p></>);" },
      { prompt: "How do you embed a JavaScript expression inside JSX markup?", answer: "Wrap it in curly braces {}, e.g. <h1>Hello, {name}!</h1>" },
      { prompt: "How do you render a list of items in JSX?", answer: "Use Array.prototype.map() to transform data into an array of elements, each with a unique key prop, e.g. numbers.map(n => <li key={n}>{n}</li>)" },
      { prompt: "Why does each item need a unique 'key' prop when rendering lists in React?", answer: "Keys let React identify which items changed, were added, or were removed between renders, so it can update the DOM efficiently and correctly." },
      { prompt: "Name three ways to do conditional rendering in JSX.", answer: "1) if/else statements outside JSX assigned to a variable, 2) the ternary operator (condition ? a : b), 3) the logical AND operator (condition && element)" },
    ],
  },
  {
    title: "Chapter 4 - Components.txt",
    cards: [
      { prompt: "What is a React component?", answer: "A JavaScript function that returns markup (JSX); components are the reusable building blocks of a React UI." },
      { prompt: "How do you export and import a component between files?", answer: "export default function Profile() {...} in Profile.js, then import Profile from './Profile.js'; in another file." },
      { prompt: "What are props in React?", answer: "Data passed from a parent component to a child component, allowing parents to configure/customize child components." },
      { prompt: "How do you destructure props directly in a function component's parameter list?", answer: "function Profile({ name, imageUrl, profession }) { ... } instead of using a single props object." },
      { prompt: "What makes a React component 'pure'?", answer: "It always returns the same output for the same props/inputs and does not produce side effects like mutating variables outside itself." },
      { prompt: "What does React's StrictMode help with?", answer: "It helps detect impure components during development by intentionally double-invoking functions to surface side effects." },
      { prompt: "How does React model a UI's structure conceptually?", answer: "As a tree, where components have parent-child relationships; this helps with reasoning about rendering, performance, and state." },
    ],
  },
  {
    title: "Chapter 5 - Event Handling.txt",
    cards: [
      { prompt: "How do you add a click event handler to a button in React?", answer: "function Button() { function handleClick(e) { alert('Clicked: ' + e.target.tagName); } return <button onClick={handleClick}>Click me</button>; }" },
      { prompt: "What is a controlled form input in React?", answer: "An input whose value is driven by React state via the value prop and updated through an onChange handler, so React is the 'single source of truth'." },
      { prompt: "What is an uncontrolled form input in React?", answer: "An input whose value is managed by the DOM itself (using defaultValue) and read out via a ref or FormData when needed, rather than being driven by React state." },
      { prompt: "How do you read form field values from an uncontrolled form on submit?", answer: "Use the FormData API: const formData = new FormData(event.target); const name = formData.get('name');" },
    ],
  },
  {
    title: "Chapter 6 - State.txt",
    cards: [
      { prompt: "What problem does React state solve that plain variables don't?", answer: "State lets a component 'remember' information between renders and triggers a re-render (UI update) whenever it changes, unlike regular variables which reset every render and don't trigger updates." },
      { prompt: "What are the three steps React uses to render and update the UI?", answer: "1) Trigger a render, 2) Render the component, 3) Commit the changes to the DOM." },
      { prompt: "What does it mean that 'state behaves like a snapshot' in React?", answer: "Each render captures its own version of state; a state variable inside an event handler keeps the value it had at the time of that render, even after calling the setter, until the next render happens." },
      { prompt: "How do you correctly queue multiple updates to the same state variable in one event handler?", answer: "Use the updater function form, e.g. setNumber(n => n + 1); called multiple times, each based on the latest pending state rather than the stale snapshot." },
      { prompt: "How should you update an object in state without mutating it?", answer: "Create a new object using the spread operator to copy existing properties and override changed ones: setPerson({ ...person, name: newName });" },
      { prompt: "How should you add an item to an array in state?", answer: "Create a new array rather than mutating the original, e.g. setItems([...items, 'Orange']);" },
      { prompt: "How should you remove an item from an array in state?", answer: "Create a new array using filter(), e.g. setItems(items.filter(item => item !== 'Apple'));" },
      { prompt: "Why is it recommended to avoid multiple boolean state flags (isTyping, isSubmitting, isSuccess, isError) for one process?", answer: "Independent booleans can combine into impossible/contradictory states; a single state variable like status ('typing' | 'submitting' | 'success') prevents impossible states." },
      { prompt: "What does 'lifting state up' mean and when should you do it?", answer: "When two or more components need to share and stay in sync on the same state, remove the state from each of them and move it to their closest common parent, then pass it down via props." },
      { prompt: "When does React preserve state between re-renders vs reset it?", answer: "React preserves state for a component as long as it stays at the same position in the UI tree; if its position/type changes (or it's removed/replaced), its state is reset. Adding a different 'key' also forces a reset." },
      { prompt: "What problem does React Context solve?", answer: "It lets a parent component make data available to any component below it in the tree without manually passing props through every intermediate component (avoiding 'prop drilling')." },
      { prompt: "How do you provide and consume a value with React Context?", answer: "Create it with createContext(), wrap children in <MyContext.Provider value={...}>, and read it in a descendant with const value = useContext(MyContext);" },
    ],
  },
  {
    title: "Chapter 7 - Hooks.txt",
    cards: [
      { prompt: "What is the purpose of the useEffect Hook?", answer: "To synchronize a component with an external system (e.g. browser APIs, subscriptions, network requests) by running side effects after render, with an optional cleanup function." },
      { prompt: "What does the dependency array in useEffect(fn, [deps]) control?", answer: "It determines when the Effect re-runs: the Effect only re-executes when one of the values in the dependency array has changed since the last render." },
      { prompt: "What is the useRef Hook typically used for?", answer: "To store a mutable value or reference a DOM element that persists across renders without causing a re-render when it changes." },
      { prompt: "How do you focus a DOM input element using a ref?", answer: "const inputRef = useRef(null); attach ref={inputRef} to the <input>; then call inputRef.current.focus() in an event handler." },
      { prompt: "When should you avoid using an Effect?", answer: "When you can compute/derive a value directly during rendering instead (e.g. filtering an array from props), since Effects are meant for syncing with external systems, not for transforming data that could be derived." },
      { prompt: "What is the difference between an Effect and an event handler in terms of reactivity?", answer: "Event handlers only run in response to a specific interaction and are not 'reactive'; Effects automatically re-run whenever a reactive value they read (props/state in their dependency array) changes." },
      { prompt: "How do you extract reusable stateful logic across multiple components in React?", answer: "By creating a custom Hook: a function starting with 'use' that itself calls other Hooks (like useState/useEffect) and returns the values/behavior needed, e.g. useOnlineStatus()." },
    ],
  },
  {
    title: "Chapter 8 - React Router.txt",
    cards: [
      { prompt: "What is React Router used for?", answer: "A standard library for handling client-side navigation/routing in React, enabling multiple views in a single-page app without full page reloads." },
      { prompt: "How do you configure basic routes with React Router?", answer: "Wrap the app in <BrowserRouter>, then use <Routes> containing <Route path=\"/\" element={<HomePage />} /> entries to map URL paths to components." },
      { prompt: "What are the two main ways to navigate between routes in React Router?", answer: "The <Link to=\"/path\"> component for declarative navigation, and the useNavigate() Hook for programmatic navigation (e.g. navigate('/dashboard') after a login action)." },
      { prompt: "What is useParams used for in React Router?", answer: "To read dynamic path parameters from the URL, e.g. const { userId } = useParams(); for a route like /users/:userId" },
      { prompt: "What is useSearchParams used for in React Router?", answer: "To read and update query string parameters, e.g. const [searchParams, setSearchParams] = useSearchParams(); searchParams.get('query');" },
    ],
  },
  {
    title: "Chapter 9 - TypeScript.txt",
    cards: [
      { prompt: "What are the main benefits of using TypeScript with React?", answer: "Compile-time type safety, better IDE autocomplete/refactoring support, self-documenting code via type annotations, clearer team collaboration, and the ability to adopt it gradually." },
      { prompt: "How do you type a React component's props with TypeScript?", answer: "Define a type/interface for the props (e.g. type Props = { title: string; onListChange: (t: Todo[]) => void; children?: React.ReactNode }) and annotate the function parameter: function TodoList({ title, onListChange, children }: Props) {}" },
      { prompt: "How do you explicitly type a useState Hook when the initial value doesn't convey enough type info?", answer: "Pass a generic type argument: const [todos, setTodos] = useState<Todo[]>([]);" },
      { prompt: "How do you type an input change event handler in TypeScript/React?", answer: "function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) { setInputText(event.currentTarget.value); }" },
    ],
  },
];

async function main() {
  await prisma.course.deleteMany({ where: { title: COURSE_TITLE } });

  const course = await prisma.course.create({
    data: {
      title: COURSE_TITLE,
      description:
        "Flashcards for React Developer Certification exam preparation.",
      decks: {
        create: decks.map((deck, deckOrder) => ({
          title: deck.title,
          order: deckOrder,
          cards: {
            create: deck.cards.map((card, cardOrder) => ({
              prompt: card.prompt,
              answer: card.answer,
              order: cardOrder,
            })),
          },
        })),
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

  const totalCards = course.decks.reduce(
    (sum, deck) => sum + deck._count.cards,
    0,
  );

  console.log(`Seeded course "${course.title}" (${course.id})`);
  console.log(`  ${course.decks.length} decks, ${totalCards} cards`);
  for (const deck of course.decks) {
    console.log(`  - "${deck.title}": ${deck._count.cards} cards`);
  }
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
