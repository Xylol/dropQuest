import { ServiceContainer } from './ServiceContainer';

const serviceContainer = new ServiceContainer();
const localBackend = serviceContainer.getBackendService();

const originalFetch = window.fetch;

window.fetch = async function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = typeof input === 'string' ? input : 
               input instanceof URL ? input.href : 
               input.url;

  if (url.startsWith('/api/') || url.includes('/api/')) {
    const method = init?.method || 'GET';
    let body: unknown = undefined;

    if (init?.body) {
      try {
        if (typeof init.body === 'string') {
          body = JSON.parse(init.body);
        } else if (init.body instanceof FormData) {
          body = Object.fromEntries(init.body.entries());
        } else {
          body = init.body;
        }
      } catch {
        body = init.body;
      }
    }

    const mockResponse = await localBackend.handleRequest(method, url, body);
    
    const responseBody = JSON.stringify(await mockResponse.json());
    
    return new Response(responseBody, {
      status: mockResponse.status,
      statusText: mockResponse.ok ? 'OK' : 'Error',
      headers: mockResponse.headers
    });
  }

  return originalFetch.call(this, input, init);
};

