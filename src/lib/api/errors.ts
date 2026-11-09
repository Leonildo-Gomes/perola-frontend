import type { InvalidParam, ProblemDetails } from "@/types/api.types";

export const SLOT_CONFLICT_TYPE = "slot-already-booked";

/** Error returned by the API (RFC 7807) or a network/parse failure (status 0). */
export class ApiError extends Error {
  readonly status: number;
  readonly problem: ProblemDetails;

  constructor(problem: ProblemDetails) {
    super(problem.detail ?? problem.title);
    this.name = "ApiError";
    this.status = problem.status;
    this.problem = problem;
  }

  get type() {
    return this.problem.type;
  }

  get invalidParams(): InvalidParam[] {
    return this.problem.invalidParams ?? [];
  }
}

/**
 * HTTP 409 with `type: slot-already-booked` (anti-overbooking).
 * UI must keep the wizard state, show a banner and refetch slots.
 */
export class SlotConflictError extends ApiError {
  constructor(problem: ProblemDetails) {
    super(problem);
    this.name = "SlotConflictError";
  }
}

export class NetworkError extends ApiError {
  constructor(cause?: unknown) {
    super({
      type: "about:blank",
      title: "Erro de rede",
      status: 0,
      detail: "Não foi possível contactar o servidor. Verifique a sua ligação.",
    });
    this.name = "NetworkError";
    this.cause = cause;
  }
}

export const isApiError = (e: unknown): e is ApiError => e instanceof ApiError;
export const isSlotConflictError = (e: unknown): e is SlotConflictError =>
  e instanceof SlotConflictError;

export function isSlotConflictProblem(p: ProblemDetails): boolean {
  return p.status === 409 && p.type.split("/").pop() === SLOT_CONFLICT_TYPE;
}
