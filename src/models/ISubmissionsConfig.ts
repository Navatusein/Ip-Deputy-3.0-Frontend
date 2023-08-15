import {ISubmissionWork} from "./ISubmissionWork";
import {ISubmissionStudent} from "./ISubmissionStudent.ts";

export interface ISubmissionsConfig {
    id: number;
    subgroupId?: number;
    subjectId?: number;
    subjectTypeId?: number;
    customType?: string;
    customName?: string;
    submissionWorks: ISubmissionWork[];
    submissionStudents: ISubmissionStudent[];
}