# DIY AI Code Review With OpenAI and Semaphore

Do AI reviews **directly** using an inference endpoint — no pricey tools needed.
This repo shows how to run a **code-review gate** in CI with a few Bash lines and an AI API.

* 🧩 **Works in CI** (Semaphore)
* 🧠 **Your rules** (security/style/perf… you decide)
* 📦 **Structured output** (JUnit XML) → shows in test results
* 💸 **Low cost** (you control what gets sent & how much)

Related blog post: <https://semaphore.io/blog/diy-ai-code-review>
Related video: <https://www.youtube.com/shorts/Ikq9E2DC-LU>

---

## How it works

* Collects up to *N* files from the PR (you can filter by extension or path)
* Builds a compact payload (truncate large files to control cost)
* Calls the AI endpoint with a prompt like:

  > “You are a senior code reviewer. Review these files for security, performance, and maintainability. **Respond only with valid JUnit XML.**”
* Extracts the model’s text output and saves it to `review.xml`

> If you prefer JSON, ask for JSON and convert to JUnit in the script. JUnit is convenient because CI already knows how to display it.

---

## Prerequisites

* A Semaphore project wired to this repo
* An AI endpoint + API key (e.g., OpenAI Responses API)

---

## Quick start (Semaphore)

1. Fork this repo
2. Add project to Semaphore
3. Add a secret with the API Token
   In *Project Settings → Secrets*, create `OPENAI_API_KEY`
4. Push code or create a PR
   Open a pull request that changes a small file under `src/`.
   The job will:

   * collect changed files
   * call the AI endpoint
   * write `review.xml`
   * publish it as a job artifact

## LICENSE

Copyright 2025 Continuous Integration Solutions Ltd

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
