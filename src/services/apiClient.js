import { BASE_URL } from '../config/constants';

export class ApiError extends Error {
  constructor({ message, status, statusText, path, method }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.path = path;
    this.method = method;
  }
}

export function isApiError(error) {
  return error instanceof ApiError;
}

const GENERIC_API_ERROR_MESSAGE = 'Hubo un error al conectarse con el servidor.';

async function request(path, options = {}) {
  const method = options.method ?? 'GET';
  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
      ...options,
    });
  } catch (error) {
    throw new ApiError({
      message: GENERIC_API_ERROR_MESSAGE,
      status: null,
      statusText: '',
      path,
      method,
    });
  }

  const contentType = response.headers.get('content-type') ?? '';
  const rawBody = await response.text();
  const body = contentType.includes('application/json')
    ? (() => {
        if (!rawBody) {
          return null;
        }

        try {
          return JSON.parse(rawBody);
        } catch {
          return rawBody;
        }
      })()
    : rawBody;

  if (!response.ok) {
    throw new ApiError({
      message: GENERIC_API_ERROR_MESSAGE,
      status: response.status,
      statusText: response.statusText,
      path,
      method,
    });
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
