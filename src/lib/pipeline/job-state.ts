export const JOB_STATES = ["pending", "processing", "completed", "failed", "cancelled"] as const;
export type JobState = (typeof JOB_STATES)[number];

const transitions: Record<JobState, readonly JobState[]> = {
  pending: ["processing", "cancelled"],
  processing: ["completed", "failed", "cancelled"],
  completed: [],
  failed: ["pending", "cancelled"],
  cancelled: [],
};

export function canTransition(from: JobState, to: JobState): boolean {
  return transitions[from].includes(to);
}

export function transition(from: JobState, to: JobState): JobState {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid job transition: ${from} -> ${to}`);
  }
  return to;
}
