const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, Header, Footer, PageNumber
} = require("docx");
const fs = require("fs");

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, bold: true, size: 32, font: "Arial", color: "1B4F72" })],
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, size: 26, font: "Arial", color: "1A5276" })],
  });
}

function body(text) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, size: 22, font: "Arial" })],
  });
}

function bullet(text, bold) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 60, after: 60 },
    children: [
      bold
        ? new TextRun({ text: bold + ": ", bold: true, size: 22, font: "Arial" })
        : null,
      new TextRun({ text, size: 22, font: "Arial" }),
    ].filter(Boolean),
  });
}

function techRow(name, version, purpose, color) {
  const shade = color || "EBF5FB";
  return new TableRow({
    children: [
      new TableCell({
        borders,
        width: { size: 2200, type: WidthType.DXA },
        shading: { fill: shade, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: name, bold: true, size: 20, font: "Arial" })] })],
      }),
      new TableCell({
        borders,
        width: { size: 1200, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: version, size: 20, font: "Arial", color: "555555" })] })],
      }),
      new TableCell({
        borders,
        width: { size: 5960, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: purpose, size: 20, font: "Arial" })] })],
      }),
    ],
  });
}

function headerRow() {
  return new TableRow({
    tableHeader: true,
    children: ["Technology", "Version", "Purpose"].map((t, i) => {
      const widths = [2200, 1200, 5960];
      return new TableCell({
        borders,
        width: { size: widths[i], type: WidthType.DXA },
        shading: { fill: "1B4F72", type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: t, bold: true, size: 20, font: "Arial", color: "FFFFFF" })] })],
      });
    }),
  });
}

function spacer() {
  return new Paragraph({ children: [new TextRun("")], spacing: { before: 120, after: 120 } });
}

function divider() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "AED6F1", space: 1 } },
    children: [new TextRun("")],
    spacing: { before: 160, after: 160 },
  });
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "1B4F72", space: 1 } },
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "AI Vet Doctor — Technology Reference", size: 18, font: "Arial", color: "555555" })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: "1B4F72", space: 1 } },
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Page ", size: 18, font: "Arial", color: "555555" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, font: "Arial", color: "555555" }),
            new TextRun({ text: "  •  Smart Care. Healthier Pets.", size: 18, font: "Arial", color: "AAAAAA" }),
          ],
        })],
      }),
    },
    children: [
      // Title block
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 80 },
        children: [new TextRun({ text: "AI Vet Doctor", bold: true, size: 56, font: "Arial", color: "1B4F72" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "Technologies Used to Build This Project", size: 28, font: "Arial", color: "555555" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 320 },
        children: [new TextRun({ text: "A guide for students", size: 22, font: "Arial", color: "888888", italics: true })],
      }),

      divider(),

      // Introduction
      heading1("What Did We Build?"),
      body("AI Vet Doctor is a web application that lets pet owners upload a photo of their animal, describe any symptoms, and receive an AI-powered health assessment. The app reads the image using a powerful AI model, scores the animal’s health from 1–10, lists observations and concerns, and gives practical recommendations."),
      body("It also supports voice input — so you can speak your description instead of typing — and can read the results aloud using the device’s built-in speech engine."),

      spacer(),
      divider(),

      // Tech table
      heading1("Technologies at a Glance"),
      spacer(),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2200, 1200, 5960],
        rows: [
          headerRow(),
          techRow("Next.js", "16.2.9", "The main framework. Handles routing, server-side logic, and the build pipeline.", "EBF5FB"),
          techRow("React", "19", "Builds the user interface as reusable components (upload card, results, buttons).", "FFFFFF"),
          techRow("TypeScript", "5.9", "Adds types to JavaScript so mistakes are caught before the app runs.", "EBF5FB"),
          techRow("Tailwind CSS", "4", "Utility classes that style every element without writing a separate CSS file.", "FFFFFF"),
          techRow("OpenAI API", "GPT-4o", "The AI brain. Receives the pet photo and returns a structured health report.", "EBF5FB"),
          techRow("Web Speech API", "Browser built-in", "Two features: SpeechRecognition (mic input) and SpeechSynthesis (read-aloud output).", "FFFFFF"),
          techRow("pnpm", "10", "Fast package manager that installs and locks all project dependencies.", "EBF5FB"),
          techRow("Node.js", "22", "Runs the server and the build scripts on your computer.", "FFFFFF"),
        ],
      }),

      spacer(),
      divider(),

      // Deep dives
      heading1("How Each Technology Is Used"),

      heading2("1. Next.js — The Framework"),
      body("Next.js is the backbone of the project. It provides:"),
      bullet("A file-based router: every file in the app/ folder automatically becomes a page or an API endpoint."),
      bullet("A built-in API route at /api/analyze that receives the image, calls the OpenAI API, and returns the health report as JSON."),
      bullet("Server-side rendering and fast refresh during development."),
      body("Think of Next.js as the “shell” that holds everything together."),

      spacer(),
      heading2("2. React — The User Interface"),
      body("React lets us break the UI into components. Each component manages its own state with hooks:"),
      bullet("useState", "Tracks values that change (the uploaded image, the result, whether audio is playing)."),
      bullet("useRef", "Holds references to the file input and the speech recognition object without causing re-renders."),
      bullet("useCallback / useEffect", "Runs code at the right time (setting up the mic on load, cleaning up on reset)."),

      spacer(),
      heading2("3. TypeScript — Type Safety"),
      body("TypeScript is JavaScript with types. For example, the AnalysisResult interface describes exactly what shape of data we expect back from the AI:"),
      new Paragraph({
        spacing: { before: 80, after: 80 },
        children: [new TextRun({
          text: "{ animalType: string; healthScore: number; healthStatus: “Excellent” | “Good” | “Fair” | “Poor” | “Critical”; ... }",
          font: "Courier New", size: 18, color: "1A5276",
        })],
      }),
      body("If the AI returns something unexpected, TypeScript flags it before it reaches the user."),

      spacer(),
      heading2("4. Tailwind CSS — Styling"),
      body("Instead of writing separate .css files, Tailwind provides short class names that map directly to CSS rules. For example:"),
      bullet("rounded-2xl → gives an element large rounded corners."),
      bullet("bg-gradient-to-r from-teal-500 to-blue-600 → creates a left-to-right colour gradient."),
      bullet("animate-spin → rotates the loading spinner."),
      body("This keeps all styling co-located with the HTML, making it easy to see and change the look without hunting through separate files."),

      spacer(),
      heading2("5. OpenAI API — The AI Brain"),
      body("The /api/analyze route sends two things to OpenAI’s GPT-4o model:"),
      bullet("The pet photo, encoded as a base64 data URL."),
      bullet("A structured prompt that asks the model to respond with a specific JSON format (animal type, score, status, observations, concerns, recommendations, summary)."),
      body("GPT-4o understands images as well as text, so it can look at the photo and reason about the animal’s visible health indicators."),

      spacer(),
      heading2("6. Web Speech API — Voice In & Out"),
      body("Two separate browser APIs handle voice, both built into modern browsers with no extra packages needed:"),
      bullet("SpeechRecognition", "Captures audio from the microphone and transcribes it to text in real time. The interim results appear in the textarea as you speak; the final result replaces them cleanly."),
      bullet("SpeechSynthesis (speechSynthesis.speak)", "Reads the health report aloud using the device’s text-to-speech engine. The Listen/Stop button on the results page controls playback."),

      spacer(),
      heading2("7. pnpm — Package Manager"),
      body("pnpm installs all the libraries the project depends on. It is faster and more disk-efficient than npm because it shares packages across projects. The pnpm-lock.yaml file ensures every developer (and the deployment server) installs identical versions."),

      spacer(),
      divider(),

      // Data flow
      heading1("How Data Flows Through the App"),
      body("Here is the journey from photo upload to spoken result:"),
      spacer(),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [700, 8660],
        rows: [
          ["1", "User drops or selects a photo. React reads it with FileReader and stores a base64 preview."],
          ["2", "User optionally speaks a description. SpeechRecognition transcribes it into the textarea."],
          ["3", "User clicks Analyze Now. React sends the image and description to /api/analyze via fetch()."],
          ["4", "The Next.js API route receives the form data, encodes the image, and calls the OpenAI GPT-4o API."],
          ["5", "GPT-4o returns a JSON health report. The API route parses it and sends it back to the browser."],
          ["6", "React displays the score, status badge, observations, concerns, and recommendations."],
          ["7", "User clicks Listen. SpeechSynthesis reads the report aloud. Clicking Stop cancels playback."],
        ].map(([step, text]) =>
          new TableRow({
            children: [
              new TableCell({
                borders,
                width: { size: 700, type: WidthType.DXA },
                shading: { fill: "1B4F72", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                verticalAlign: "center",
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: step, bold: true, size: 22, font: "Arial", color: "FFFFFF" })] })],
              }),
              new TableCell({
                borders,
                width: { size: 8660, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text, size: 20, font: "Arial" })] })],
              }),
            ],
          })
        ),
      }),

      spacer(),
      divider(),

      // Key concepts
      heading1("Key Concepts to Understand"),
      bullet("API (Application Programming Interface)", "A way for two programs to talk to each other. Our app talks to OpenAI’s API to get the AI analysis."),
      bullet("Base64 encoding", "A method of converting binary files (like images) into a text string so they can be sent inside a JSON request."),
      bullet("React state", "Data that lives inside a component and causes the UI to re-render when it changes."),
      bullet("Async / await", "JavaScript syntax for waiting on slow operations (like a network request) without freezing the page."),
      bullet("Environment variables", "Secret values (like the OPENAI_API_KEY) stored outside the code so they are not visible in the repository."),

      spacer(),
      divider(),

      // Summary
      heading1("Summary"),
      body("This project demonstrates how modern web technologies work together:"),
      bullet("Next.js & React provide the structure and interactivity of the UI."),
      bullet("TypeScript keeps the codebase reliable and self-documenting."),
      bullet("Tailwind CSS makes styling fast and consistent."),
      bullet("OpenAI’s GPT-4o adds real AI understanding of images and natural language."),
      bullet("The Web Speech API adds voice interaction with zero extra dependencies."),
      spacer(),
      body("Together, these tools show how a small team (or a single developer) can build a polished, AI-powered product in a short time using the right combination of modern open-source frameworks and cloud APIs."),

      spacer(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 320 },
        children: [new TextRun({ text: "Happy building! 🐾", size: 24, font: "Arial", color: "888888", italics: true })],
      }),
    ],
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("C:\\igebra_projects\\innovation-project\\AI-Vet-Doctor-Technologies.docx", buffer);
  console.log("Done: AI-Vet-Doctor-Technologies.docx");
});
