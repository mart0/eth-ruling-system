type HealthCheckBody = {
  version: string;
  source: string;
  message: string;
  requestId: string;
  error?: string;
};

export type HealthCheckResponse = {
  isSuccessful: boolean;
  result: HealthCheckBody;
};

