
export enum PreferredPosition {
  InBegin,
  DoesNotMatter,
  InEnd
}

export interface ISubmissionStudent {
  id: number;
  submissionWorkId: number;
  studentId: number;
  submissionConfigId: number;
  preferredPosition: PreferredPosition;
}