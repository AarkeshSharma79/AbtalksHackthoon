import { executeCandidateCode } from '../agent/codeSandbox.js';
import { parseResumeText } from '../agent/resumeParser.js';

console.log("====================================================");
console.log("   AUTOMATED VERIFICATION OF NEW FEATURES");
console.log("====================================================\n");

async function runTests() {
  // 1. Test Code Sandbox Execution
  console.log("1. Testing Code Execution Sandbox (JavaScript)...");
  const jsResult = await executeCandidateCode(`
    const cosineSim = (a, b) => a.reduce((sum, val, i) => sum + val * b[i], 0);
    console.log("Similarity:", cosineSim([1, 2], [3, 4]));
  `, 'javascript');
  console.log("JS Sandbox Result:", jsResult);
  if (!jsResult.success || !jsResult.output.includes("Similarity")) {
    console.error("FAILED: Code sandbox execution failed");
    process.exit(1);
  }

  // 2. Test Resume Parser & Skill Extraction
  console.log("\n2. Testing Resume Parser & CV Skill Extraction...");
  const sampleCV = "Sarah Johnson - Senior Data Engineer with 8 years experience in Python, FastAPI, Docker, ChromaDB, and LangChain.";
  const parsed = parseResumeText(sampleCV);
  console.log("Parsed CV Result:", parsed);
  if (!parsed.skills.includes("Python") || !parsed.skills.includes("Fastapi")) {
    console.error("FAILED: Resume skill extraction failed");
    process.exit(1);
  }

  console.log("\n====================================================");
  console.log("   ALL NEW FEATURES VERIFIED SUCCESSFULLY!");
  console.log("====================================================");
}

runTests();
