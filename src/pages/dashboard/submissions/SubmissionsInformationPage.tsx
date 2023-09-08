import {FC} from 'react';
import {App, Button, Card, Space, Table, Tag} from "antd";
import {submissionsConfigApi} from "../../../services/SubmissionsConfigsService.ts";
import {subjectApi} from "../../../services/SubjectService.ts";
import {subjectTypeApi} from "../../../services/SubjectTypeService.ts";
import {subgroupApi} from "../../../services/SubgroupService.ts";
import {ISubmissionsConfig} from "../../../models/ISubmissionsConfig.ts";
import {ColumnsType} from "antd/es/table";
import {studentApi} from "../../../services/StudentsService.ts";
import {ISubmissionStudent} from "../../../models/ISubmissionStudent.ts";
import {DeleteOutlined, ExclamationCircleFilled, ReloadOutlined} from "@ant-design/icons";
import {submissionStudentApi} from "../../../services/SubmissionStudentService.ts";

interface ISubmissionListItem {
  student: string;
  submissionStudents: ISubmissionStudent[];
  submissionConfigId: number;
}

const SubmissionsInformationPage: FC = () => {
  const {modal, notification} = App.useApp();

  const submissionsConfigsQuery = submissionsConfigApi.useFetchAllQuery();
  const subjectQuery = subjectApi.useFetchAllQuery();
  const subjectTypeQuery = subjectTypeApi.useFetchAllQuery();
  const subgroupQuery = subgroupApi.useFetchAllQuery();
  const studentQuery = studentApi.useFetchAllQuery();

  const [remove] =  submissionStudentApi.useRemoveMutation();

  const columns: ColumnsType<ISubmissionListItem> = [
    {
      title: "Student",
      dataIndex: "studentId",
      key: "studentId",
      ellipsis: true,
      render: (_, row) => {
        return row.student;
      }
    },
    {
      title: "Submission Works",
      dataIndex: "submissionWorks",
      key: "submissionWorks",
      render: (_, row) => {
        return row.submissionStudents.map((value) => {
          const submissionsConfig = submissionsConfigsQuery.data?.find(x => x.id === value.submissionsConfigId)!;
          const submissionWork = submissionsConfig.submissionWorks.find(x => x.id === value.submissionWorkId)!;

          return(
            <Tag color="blue" key={value.id} closable onClose={(e) => {
              e.preventDefault();
              deleteWorkHandler(value);
            }}>
              {submissionWork.name}
            </Tag>
          );
        });
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, row) => {
        return (
          <Button danger size="small" icon={<DeleteOutlined/>} onClick={() => deleteStudentHandler(row)}>
            Delete
          </Button>
        )
      },
      width: 100
    }
  ];

  const deleteWorkHandler = (submissionStudent: ISubmissionStudent) => {
    modal.confirm({
      title: "Are you sure to delete this work?",
      icon: <ExclamationCircleFilled/>,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        remove(submissionStudent.id)
          .unwrap()
          .then(() => {
            submissionsConfigsQuery.refetch();
          })
          .catch((error) => {
            if (error.response) {
              notification.error({
                message: error.response.data
              });
            }
          });
      },
    });
    submissionsConfigsQuery.refetch();
  }

  const deleteStudentHandler = (submissionListItem: ISubmissionListItem) => {
    modal.confirm({
      title: "Are you sure to delete this student from list?",
      icon: <ExclamationCircleFilled/>,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        submissionListItem.submissionStudents.forEach(submissionStudent => {
          remove(submissionStudent.id)
            .unwrap()
            .then(() => {
              submissionsConfigsQuery.refetch();
            })
            .catch((error) => {
              if (error.response) {
                notification.error({
                  message: error.response.data
                });
              }
            });
        });
      },
    });
  };

  const updateHandler = () => {
    submissionsConfigsQuery.refetch();
    subjectQuery.refetch();
    subjectTypeQuery.refetch();
    subgroupQuery.refetch();
    studentQuery.refetch();
  };

  const clearHandler = (submissionConfig: ISubmissionsConfig) => {
    modal.confirm({
      title: "Are you sure to clear list?",
      icon: <ExclamationCircleFilled/>,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        submissionConfig.submissionStudents.forEach(submissionStudent => {
          remove(submissionStudent.id)
            .unwrap()
            .then(() => {
              submissionsConfigsQuery.refetch();
            })
            .catch((error) => {
              if (error.response) {
                notification.error({
                  message: error.response.data
                });
              }
            });
        });
      },
    });
  }

  const getSubmissionConfigName = (submissionConfig: ISubmissionsConfig) : string => {
    const subject = subjectQuery.data?.find(x => x.id === submissionConfig.subjectId);
    const name = submissionConfig.customName != undefined ? submissionConfig.customName : subject?.shortName;

    const subjectType = subjectTypeQuery.data?.find(x => x.id === submissionConfig.subjectTypeId);
    const type = submissionConfig.customType != undefined ? submissionConfig.customType : subjectType?.shortName;

    const subgroup = subgroupQuery.data?.find(x => x.id == submissionConfig.subgroupId);

    return `${name} (${type}) ${subgroup !== undefined ? subgroup.name : ""}`;
  }

  const prepare = (submissionConfig: ISubmissionsConfig): ISubmissionListItem[] => {
    const sorted = [...submissionConfig.submissionStudents].sort((a, b) => a.preferredPosition - b.preferredPosition);

    const studentIds = sorted
      .map(item => item.studentId)
      .filter((value, index, self) => self.indexOf(value) === index);

    let list: ISubmissionListItem[] = [];

    studentIds.forEach(studentId => {
      const student = studentQuery.data?.find(x => x.id == studentId)!;

      const submissionListItem: ISubmissionListItem = {
        student: `${student.surname} ${student.name}`,
        submissionStudents: submissionConfig.submissionStudents.filter(x => x.studentId == studentId).sort((a, b) => a.submissionWorkId - b.submissionWorkId),
        submissionConfigId: submissionConfig.id
      }

      list = [...list, submissionListItem];
    });

    return list;
  }

  return (
    <>
      {submissionsConfigsQuery.data?.map(submissionConfig => {
        const data = prepare(submissionConfig);

        return(
          <Card key={submissionConfig.id} bordered={false} style={{marginBottom: "25px"}}>
            <div style={{display: "flex", alignItems: "baseline", justifyContent: "space-between"}}>
              <h4 style={{marginTop: "0", marginBottom: "15px"}}>{getSubmissionConfigName(submissionConfig)}</h4>
              <Space>
                <Button icon={<ReloadOutlined/>} onClick={updateHandler}>
                  Update
                </Button>
                <Button icon={<DeleteOutlined/>} onClick={() => clearHandler(submissionConfig)} danger disabled={data.length === 0}>
                  Clear
                </Button>
              </Space>
            </div>
            <Table
              dataSource={data}
              columns={columns}
              size={"small"}
              pagination={false}
              rowKey={"student"}
            />
          </Card>
        );
      })}
    </>
  );
};

export default SubmissionsInformationPage;