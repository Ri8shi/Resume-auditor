<!-- <div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div> -->
<h1>AI-Powered Resume Screening Bias Auditor</h1>
<h2>Overview:</h2>
<p>The Resume Screening Bias Auditor is an LLM-powered analytical tool designed to identify implicit bias, proxy variables, and exclusionary language in recruitment processes. Rather than relying on AI to make subjective hiring decisions—which often perpetuates existing training biases—this tool acts as a strict linguistic pattern matcher. It analyzes candidate dossiers, recruiter feedback, and job descriptions to flag text spans that correlate with protected demographics or reveal non-skills-based evaluator language.</p>

<h2>Core Methodology:</h2>
Proxy Variable Detection: Identifies implicit socio-economic, age, or cultural proxies (e.g., specific graduation years, zip codes, or affiliations) rather than just explicit demographic markers.
Coded Language Extraction: Flags subjective or gender-coded terminology (e.g., "culture fit," "aggressive," "digital native") and suggests objective, skills-based alternatives.
Evidentiary Constraint: Forces the model to cite exact text snippets from the input data, preventing AI hallucination and uncalibrated "bias scoring."

<h2>Technical Stack:</h2>
LLM: Google Gemini 1.5 Pro (via Google AI Studio)
Architecture: Zero-temperature, deterministic prompting optimized for strict JSON data extraction over creative text generation.
