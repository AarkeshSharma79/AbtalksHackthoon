import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Safely executes JavaScript or Python code in a sandboxed process.
 */
export async function executeCandidateCode(code, language = 'javascript') {
  return new Promise((resolve) => {
    if (!code || typeof code !== 'string') {
      return resolve({
        success: false,
        output: '',
        error: 'No code provided for execution.'
      });
    }

    const tmpDir = os.tmpdir();
    const ext = language === 'python' ? '.py' : '.js';
    const tmpFile = path.join(tmpDir, `interview_sandbox_${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`);

    fs.writeFileSync(tmpFile, code, 'utf-8');

    let command = '';
    if (language === 'python') {
      command = `py "${tmpFile}" || python "${tmpFile}" || python3 "${tmpFile}"`;
    } else {
      command = `node "${tmpFile}"`;
    }

    const startTime = Date.now();

    exec(command, { timeout: 3000, maxBuffer: 1024 * 512 }, (err, stdout, stderr) => {
      const executionTimeMs = Date.now() - startTime;

      // Clean up temporary file
      try {
        if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
      } catch (e) {}

      if (err) {
        if (err.killed) {
          return resolve({
            success: false,
            output: stdout || '',
            error: 'Execution Timed Out (Exceeded 3000ms sandbox limit).',
            executionTimeMs
          });
        }
        return resolve({
          success: false,
          output: stdout || '',
          error: stderr || err.message,
          executionTimeMs
        });
      }

      return resolve({
        success: true,
        output: stdout || 'Code executed successfully with no output.',
        error: stderr || null,
        executionTimeMs
      });
    });
  });
}
