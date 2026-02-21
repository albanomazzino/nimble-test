import { useEffect, useState } from 'react';
import JobsList from './components/JobsList';
import { CANDIDATE_EMAIL, DEFAULT_REPO_URL } from './config/constants';
import { applyToJob, getCandidateByEmail, getJobs } from './services/apiClient';
import './styles.css';

function App() {
  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

        setError(apiError.message || 'No se pudieron cargar los datos del candidato o de las posiciones.');
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
        <h1>Postulación Nimble</h1>
        <p>Email candidato: {CANDIDATE_EMAIL}</p>
      </header>

      {isLoading && <p className="status">Cargando datos del candidato y posiciones...</p>}

      {!isLoading && error && <p className="error-message">{error}</p>}

      {!isLoading && !error && (
        <>
          <section className="candidate-card">
            <h2>Candidato</h2>
            <p>
              {candidate.firstName} {candidate.lastName}
            </p>
            <p>UUID: {candidate.uuid}</p>
            <p>ID de candidato: {candidate.candidateId}</p>
          </section>

          <section>
            <h2>Posiciones abiertas</h2>
            <JobsList
              jobs={jobs}
              candidate={candidate}
              defaultRepoUrl={DEFAULT_REPO_URL}
              onApply={handleApply}
            />
          </section>
        </>
      )}
    </main>
  );
}

export default App;
