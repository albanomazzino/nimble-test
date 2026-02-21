import { useEffect, useMemo, useState } from 'react';
import JobsList from './components/JobsList';
import { CANDIDATE_EMAIL } from './config/constants';
import { applyToJob, getCandidateByEmail, getJobs } from './services/apiClient';
import './styles.css';

function App() {
  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const defaultRepoUrl = useMemo(() => 'https://github.com/albimazzino/nimble-test', []);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      setIsLoading(true);
      setError('');

      try {
        const [candidateData, jobsData] = await Promise.all([
          getCandidateByEmail(CANDIDATE_EMAIL),
          getJobs(),
        ]);

        if (!isMounted) {
          return;
        }

        setCandidate(candidateData);
        setJobs(jobsData);
      } catch (apiError) {
        if (!isMounted) {
          return;
        }

        setError(apiError.message || 'Could not load candidate or job data.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleApply(payload) {
    return applyToJob(payload);
  }

  return (
    <main className="container">
      <header>
        <h1>Nimble Job Application</h1>
        <p>Candidate email: {CANDIDATE_EMAIL}</p>
      </header>

      {isLoading && <p className="status">Loading candidate and job data...</p>}

      {!isLoading && error && <p className="error-message">{error}</p>}

      {!isLoading && !error && (
        <>
          <section className="candidate-card">
            <h2>Candidate</h2>
            <p>
              {candidate.firstName} {candidate.lastName}
            </p>
            <p>UUID: {candidate.uuid}</p>
            <p>Candidate ID: {candidate.candidateId}</p>
          </section>

          <section>
            <h2>Open positions</h2>
            <JobsList
              jobs={jobs}
              candidate={candidate}
              defaultRepoUrl={defaultRepoUrl}
              onApply={handleApply}
            />
          </section>
        </>
      )}
    </main>
  );
}

export default App;
