import { BASE_URL } from '../config/constants';

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') ?? '';
  const body = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof body === 'string' ? body : body?.message ?? 'Unexpected API error';

    throw new Error(message);
  }

  return body;
}

export function getCandidateByEmail(email) {
  return request(`/api/candidate/get-by-email?email=${encodeURIComponent(email)}`, {
    method: 'GET',
  });
}

export function getJobs() {
  return request('/api/jobs/get-list', { method: 'GET' });
}

export function applyToJob(payload) {
  return request('/api/candidate/apply-to-job', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
