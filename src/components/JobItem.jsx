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
        message: 'Candidate data is not available yet. Please wait.',
      });
      return;
    }

    if (!isRepoUrlValid) {
      setFeedback({
        type: 'error',
        message: 'Please enter a valid GitHub repository URL.',
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

      setFeedback({ type: 'success', message: 'Application submitted successfully.' });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message || 'Could not submit the application.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <li className="job-item">
      <h3>{job.title}</h3>
      <p className="job-id">Job ID: {job.id}</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor={`repo-url-${job.id}`}>GitHub repo URL</label>
        <input
          id={`repo-url-${job.id}`}
          type="url"
          placeholder="https://github.com/your-user/your-repo"
          value={repoUrl}
          onChange={(event) => setRepoUrl(event.target.value)}
          disabled={isSubmitting}
          required
        />
        <button type="submit" disabled={isSubmitting || !candidate}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
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
