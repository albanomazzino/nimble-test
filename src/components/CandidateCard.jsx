function CandidateCard({ candidate, candidateEmail }) {
  if (!candidate) {
    return null;
  }

  return (
    <section className="candidate-card">
      <h2>Candidato</h2>
      <p>
        {candidate.firstName} {candidate.lastName}
      </p>
      <p>Email: {candidateEmail}</p>
      <p>UUID: {candidate.uuid}</p>
      <p>ID de candidato: {candidate.candidateId}</p>
    </section>
  );
}

export default CandidateCard;
