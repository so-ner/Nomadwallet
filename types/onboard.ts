export interface ConsentPayload {
  termsId: number;
  channels?: string[];
}

export interface SubmitConsentsResponse {
  ok: boolean;
}

