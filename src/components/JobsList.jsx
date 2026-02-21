import JobListing from './JobListing';

function JobsList({ jobs, candidate, defaultRepoUrl, onApply }) {
  if (!jobs.length) {
    return <p>No hay posiciones abiertas en este momento.</p>;
  }

  return (
    <ul className="jobs-list">
      {jobs.map((job) => (
        <JobListing
          key={job.id}
          job={job}
          candidate={candidate}
          defaultRepoUrl={defaultRepoUrl}
          onApply={onApply}
        />
      ))}
    </ul>
  );
}

export default JobsList;
