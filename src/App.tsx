/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  ShieldCheck, 
  FileText, 
  Briefcase, 
  AlertCircle, 
  CheckCircle2, 
  XSquare, 
  BarChart3,
  Loader2,
  Trash2,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { auditResume, AuditResult } from "./geminiService";

export default function App() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [rubric, setRubric] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAudit = async () => {
    if (!resume || !jobDescription) {
      setError("Please provide both a resume and a job description.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const auditResult = await auditResume(resume, jobDescription, rubric);
      setResult(auditResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = () => {
    setResume(`Alex Rivera
Rivera.alex@example.com | San Francisco, CA

Professional Summary:
Dynamic and result-oriented software engineer with 5+ years of experience. Graduated from Stanford University with a degree in Computer Science. Previously worked at Google and a YC-backed startup. Expert in full-stack development and team leadership. Recognized for high "culture fit" and being a "true go-getter".

Experience:
Senior Software Engineer | Google | 2021 – Present
- Led a team of 10 to overhaul the core search ranking algorithm.
- Improved query latency by 15% across all regions.
- Spearheaded the "Innovative Culture" initiative.

Software Engineer | TechLaunch (Startup) | 2019 – 2021
- Built the entire MVP from scratch in 3 months.
- Managed AWS infrastructure and reduced costs by 20% by optimizing queries.
- Frequent speaker at tech conferences.`);

    setJobDescription(`Senior Software Engineer

We are looking for a highly technical engineer to join our core architecture team. 

Key Requirements:
- At least 4 years of experience in backend or full-stack engineering.
- Proven track record of improving system performance or reducing costs.
- Experience with cloud infrastructure (AWS/GCP).
- Strong communication and leadership skills.

We value candidates who take ownership and drive results.`);
  };

  const clearInputs = () => {
    setResume("");
    setJobDescription("");
    setRubric("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen p-8 md:p-12 max-w-[1200px] mx-auto flex flex-col font-serif bg-page-bg text-ink selection:bg-yellow-200">
      {/* Header */}
      <header className="editorial-header">
        <div className="max-w-xl text-left">
          <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.85] mb-4">
            Audit<br />Report
          </h1>
          <p className="editorial-label">
            Project: Objective Talent Intelligence / System v2.4
          </p>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="font-sans text-[10px] uppercase font-bold tracking-[0.2em] mb-1 opacity-60">Status: Secure Processing</div>
          <div className="font-display text-3xl md:text-5xl font-light tracking-tighter tabular-nums text-ink">
            REF-{result ? "829-X" : "000-0"}
          </div>
          <div className="font-sans text-[9px] uppercase tracking-widest opacity-40 mt-1">
            Build: {new Date().toLocaleDateString()}
          </div>
          
          <div className="flex gap-4 mt-6 text-ink">
            <button 
              onClick={loadSampleData}
              className="font-sans text-[10px] uppercase font-bold tracking-widest hover:underline decoration-2"
            >
              [ Load Sample ]
            </button>
            <button 
              onClick={clearInputs}
              className="font-sans text-[10px] uppercase font-bold tracking-widest text-red-600 hover:underline decoration-2"
            >
              [ Reset ]
            </button>
          </div>
        </div>
        {/*
            <button 
              onClick={loadSampleData}
              className="text-sm font-semibold text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition-colors"
            >
              Load Sample Data
            </button>
            <button 
              onClick={clearInputs}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors px-3 py-2 rounded-md hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset All</span>
          </button>
        </div>
        */}
      </header>

      <main className="grid grid-cols-12 gap-8 md:gap-12 flex-grow text-ink">
        <div className="col-span-12 lg:col-span-5 flex flex-col space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[2px] w-8 bg-black"></div>
              <h2 className="editorial-label">Source Evidence / De-ID</h2>
            </div>

            <div className="space-y-6">
              <div className="editorial-panel p-6 flex flex-col bg-white">
                <label htmlFor="resume-input" className="font-sans text-[9px] uppercase font-black mb-2 opacity-40">Candidate Dossier / Text</label>
                <textarea
                  id="resume-input"
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder="Paste resume content for objective extraction..."
                  className="w-full h-64 font-serif text-sm leading-relaxed outline-none resize-none bg-transparent"
                />
              </div>

              <div className="editorial-panel p-6 flex flex-col bg-white">
                <label htmlFor="jd-input" className="font-sans text-[9px] uppercase font-black mb-2 opacity-40">Target Specification / JD</label>
                <textarea
                  id="jd-input"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste job description requirements..."
                  className="w-full h-40 font-serif text-sm leading-relaxed outline-none resize-none bg-transparent italic"
                />
              </div>

              <div className="editorial-panel p-4 flex flex-col bg-white">
                <label htmlFor="rubric-input" className="font-sans text-[9px] uppercase font-black mb-2 opacity-40">Audit Constraints (Optional)</label>
                <input
                  id="rubric-input"
                  type="text"
                  value={rubric}
                  onChange={(e) => setRubric(e.target.value)}
                  placeholder="Default: Fact-Extraction / Prestige Removal"
                  className="w-full font-serif text-xs outline-none bg-transparent"
                />
              </div>
            </div>

            <button
              onClick={handleAudit}
              disabled={loading || !resume || !jobDescription}
              className="official-button w-full mt-8 flex items-center justify-center gap-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Extraction...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Execute Audit</span>
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-4 border-2 border-red-600 bg-red-50 text-red-600 text-xs font-sans uppercase font-black tracking-widest flex items-center gap-3">
                <AlertCircle className="w-4 h-4" />
                <span>Error: {error}</span>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Results */}
        <div className="col-span-12 lg:col-span-7 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[2px] w-8 bg-black"></div>
            <h2 className="editorial-label">Verifiable Rubric Alignment</h2>
          </div>

          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-grow flex flex-col items-center justify-center text-center p-12 border border-black/10 bg-white"
              >
                <div className="mb-6 opacity-20">
                  <BarChart3 className="w-16 h-16" />
                </div>
                <p className="font-display text-2xl italic opacity-40">Awaiting input for objective evaluation.</p>
                <p className="editorial-label mt-4">System Initialized / Ready</p>
              </motion.div>
            )}

            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-3 gap-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="score-box h-32 bg-zinc-100 animate-pulse border-transparent" />
                  ))}
                </div>
                <div className="h-64 bg-zinc-50 animate-pulse border border-black/5" />
              </motion.div>
            )}

            {result && !loading && (
              <motion.div
                key="result"
                initial={{ opacity: 1 }}
                className="flex flex-col flex-grow"
              >
                {/* Score Grid */}
                <div className="grid grid-cols-3 gap-1 mb-10">
                  <div className="score-box score-box-dark">
                    <div className="editorial-label text-white/50 mb-2">Match Score</div>
                    <div className="font-display text-7xl font-black">{result.objective_score.total}<span className="text-xl font-light opacity-50">%</span></div>
                  </div>
                  <div className="score-box bg-white">
                    <div className="editorial-label mb-2 text-ink">Integrity</div>
                    <div className="font-display text-4xl font-black leading-none mt-auto text-ink">FACT-ONLY<br />VERIFIED</div>
                  </div>
                  <div className="score-box bg-white">
                    <div className="editorial-label mb-2 text-ink">Bias Mask</div>
                    <div className="font-display text-4xl font-black leading-none mt-auto tabular-nums text-ink">{result.flagged_subjectivity.length > 3 ? "HEAVY" : "LOW"}<br />DENSITY</div>
                  </div>
                </div>

                {/* Sub-metrics */}
                <div className="grid grid-cols-3 divide-x divide-black/10 border border-black/10 py-6 px-4 mb-8 bg-white">
                    {[
                      { label: "Skills Match", value: result.objective_score.skills_match },
                      { label: "Experience", value: result.objective_score.experience_relevance },
                      { label: "Impact", value: result.objective_score.metrics_impact }
                    ].map((stat) => (
                      <div key={stat.label} className="px-4">
                        <div className="editorial-label font-bold tracking-tighter opacity-100 mb-1 leading-none">{stat.label}</div>
                        <div className="font-sans text-2xl font-black tabular-nums leading-none text-ink">{stat.value}/10</div>
                      </div>
                    ))}
                </div>

                {/* Table: Extracted Facts */}
                <div className="flex-grow editorial-panel bg-white mb-8">
                  <table className="w-full data-table">
                    <thead>
                      <tr>
                        <th className="text-left font-sans font-black">Extracted Fact / Evidence</th>
                        <th className="text-right shrink-0 font-sans font-black">Audit Status</th>
                      </tr>
                    </thead>
                    <tbody className="font-serif text-sm">
                      {result.verifiable_matches.map((match, i) => (
                        <tr key={match + i}>
                          <td className="italic font-bold">"{match}"</td>
                          <td className="text-right font-sans text-[10px] font-black uppercase text-ink">Verified</td>
                        </tr>
                      ))}
                      {result.flagged_subjectivity.map((flag, i) => (
                        <tr key={flag + i} className="bg-red-50/30">
                          <td className="opacity-50">
                            <span className="line-through decoration-red-500/50">{flag}</span>
                          </td>
                          <td className="text-right font-sans text-[10px] font-black uppercase text-red-600 italic">Discarded</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Auditor Warning */}
                <div className="border-4 border-black p-6 bg-white flex gap-6 items-start">
                  <div className="text-4xl text-ink">⚠️</div>
                  <div>
                    <h4 className="editorial-label font-black opacity-100 mb-2">Auditor General Declaration</h4>
                    <p className="font-serif text-sm italic leading-relaxed opacity-90 text-ink">
                      {result.auditor_warning} Prestige markers successfully purged; score reflects only verifiable technical output.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="mt-12 pt-8 border-t border-black/10 flex flex-wrap gap-4 justify-between items-center font-sans text-[9px] uppercase tracking-widest opacity-40">
        <div>Objective Bias Auditor (OBA) v2.4.0-Stable</div>
        <div className="italic">Checksum: {result ? "0x82f..99a" : "0x000..000"}</div>
        <div>Processed by: System Internal Logic</div>
      </footer>
    </div>
  );
}
