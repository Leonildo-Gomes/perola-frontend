/** RFC 7807 Problem Details (`application/problem+json`). */
export interface InvalidParam {
  name: string;
  reason: string;
}

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  invalidParams?: InvalidParam[];
}

/** Standard paginated envelope (API.md §2.3). */
export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last?: boolean;
}

export interface PageParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  expiresIn?: number;
}
