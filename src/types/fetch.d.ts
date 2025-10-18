// Type declarations for node-fetch v3
declare module 'node-fetch' {
  interface RequestInit {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
  }

  interface Response {
    ok: boolean;
    status: number;
    text(): Promise<string>;
    json(): Promise<any>;
  }

  function fetch(url: string, init?: RequestInit): Promise<Response>;
  export = fetch;
}

