import { useMemo, useState } from 'react';

function JobItem({ job, candidate, defaultRepoUrl, onApply }) {
  const [repoUrl, setRepoUrl] = useState(defaultRepoUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: 'idle', message: '' });

  const isRepoUrlValid = useMemo(() => {
    if (!repoUrl.trim()) {
      return false;
    }

    try {
      const parsedUrl = new URL(repoUrl);
      return parsedUrl.hostname === 'github.com';
    } catch {
      return false;
    }
  }, [repoUrl]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!candidate) {
      setFeedback({
        type: 'error',
        message: 'Los datos del candidato todavía no están disponibles. Esperá un momento.',
      });
      return;
    }

    if (!isRepoUrlValid) {
      setFeedback({
        type: 'error',
        message: 'Ingresá una URL válida de un repositorio de GitHub.',
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: 'idle', message: '' });

    try {
      await onApply({
        uuid: candidate.uuid,
        candidateId: candidate.candidateId,
        jobId: job.id,
        repoUrl: repoUrl.trim(),
      });

      setFeedback({ type: 'success', message: 'Postulación enviada correctamente.' });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message || 'No se pudo enviar la postulación.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <li className="job-item">
      <h3>{job.title}</h3>
      <p className="job-id">ID de posición: {job.id}</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor={`repo-url-${job.id}`}>URL del repositorio en GitHub</label>
        <input
          id={`repo-url-${job.id}`}
          type="url"
          placeholder="https://github.com/tu-usuario/tu-repo"
          value={repoUrl}
          onChange={(event) => setRepoUrl(event.target.value)}
          disabled={isSubmitting}
          required
        />
        <button type="submit" disabled={isSubmitting || !candidate}>
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
      {feedback.type !== 'idle' && (
        <p className={feedback.type === 'error' ? 'error-message' : 'success-message'}>
          {feedback.message}
        </p>
      )}
    </li>
  );
}

export default JobItem;
