import {FC, useEffect} from 'react';
import {Card, Form, Select} from "antd";
import {subjectApi} from "../../services/SubjectService.ts";
import {useOutletContext} from "react-router-dom";
import {IBotLayoutContext} from "../../components/BotLayout.tsx";
import {submissionsConfigApi} from "../../services/SubmissionsConfigsService.ts";
import {subjectTypeApi} from "../../services/SubjectTypeService.ts";
import {submissionStudentApi} from "../../services/SubmissionStudentService.ts";
import {ISubmissionStudent} from "../../models/ISubmissionStudent.ts";
import {subgroupApi} from "../../services/SubgroupService.ts";

interface SubmissionRegistrationForm {
  submissionConfigId?: number,
  submissionWorksId?: number[],
  preferredPosition: number;
}

const SubmissionRegistrationPage: FC = () => {
  const {isAuthorized, telegram, user} = useOutletContext<IBotLayoutContext>();

  const submissionConfigsQuery = submissionsConfigApi.useFetchForStudentQuery(user?.studentId == undefined ? 0 : user.studentId, {skip: !isAuthorized});
  const submissionStudentQuery = submissionStudentApi.useFetchByStudentQuery(user?.studentId == undefined ? 0 : user.studentId, {skip: !isAuthorized});
  const subjectQuery = subjectApi.useFetchAllQuery(undefined,{skip: !isAuthorized});
  const subjectTypeQuery = subjectTypeApi.useFetchAllQuery(undefined,{skip: !isAuthorized});
  const subgroupQuery = subgroupApi.useFetchAllQuery(undefined,{skip: !isAuthorized});

  const [add] =  submissionStudentApi.useAddMutation();

  const [form] = Form.useForm<SubmissionRegistrationForm>();

  const submissionConfigId = Form.useWatch("submissionConfigId", form);
  const submissionWorksId = Form.useWatch("submissionWorksId", form);

  useEffect(() => {
    telegram.MainButton.text = "Записатись"
    telegram.MainButton.onClick(() => {
      form.submit();
    })
  }, [])

  useEffect(() => {
    form.resetFields(["submissionWorksId"]);
  }, [submissionConfigId])

  useEffect(() => {
    telegram.MainButton.isVisible = submissionWorksId !== undefined;
  }, [submissionWorksId]);

  const formFinishHandler = (result: SubmissionRegistrationForm) => {
    if (user === undefined)
      return;
    
    if (result.submissionWorksId === undefined)
      return;
    
    result.submissionWorksId.forEach((submissionWorkId)=> {
      if (result.submissionConfigId === undefined)
        return;

      const submission: ISubmissionStudent = {
        id: 0,
        studentId: user.studentId,
        submissionsConfigId: result.submissionConfigId,
        submissionWorkId: submissionWorkId,
        preferredPosition: result.preferredPosition
      }

      add(submission)
        .unwrap()
        .catch((error) => {
          if (error.response) {
            telegram.showAlert(error.message);
          }
        });
    });

    telegram.showPopup({
        title: "Успіх!",
        message: "Ви успішно записались на захист.",
        buttons: [
          {id: "Continue", type: "default", text: "Продовжити"},
          {id: "Close", type: "destructive", text: "Закрити"},
        ]
      },
      (id: string) => {
        switch (id) {
          case "Continue":
            form.resetFields();
            break;
          case "Close":
            telegram.close();
            break;
        }
      });
  }

  return (
    <>
      <Card bordered={false}>
        <h3 style={{marginTop: "0", marginBottom: "0"}}>Реестрація на захист</h3>
        <Form form={form} initialValues={{preferredPosition: 1}} onFinish={formFinishHandler}>
          <Form.Item name="submissionConfigId" label="Виберіть предмет:" rules={[{required: true}]}>
            <Select
              placeholder="Предмет"
              options={submissionConfigsQuery.data?.map((value) => {
                const subject = subjectQuery.data?.find(x => x.id === value.subjectId);
                const name = value.customName != undefined ? value.customName : subject?.shortName;

                const subjectType = subjectTypeQuery.data?.find(x => x.id === value.subjectTypeId);
                const type = value.customType != undefined ? value.customType : subjectType?.shortName;

                const subgroup = subgroupQuery.data?.find(x => x.id == value.subgroupId);

                return {value: value.id, label: `${name} (${type}) ${subgroup !== undefined ? subgroup.name : ""}`}
              })}
            />
          </Form.Item>
          <Form.Item name="submissionWorksId" label="Виберіть роботы:" rules={[{required: true}]}>
            <Select
              mode="multiple"
              placeholder="Робота"
              showSearch={false}
              options={submissionConfigsQuery?.data?.find(x => x.id === submissionConfigId)?.submissionWorks.map((value) => {
                const submissionWork = submissionStudentQuery?.data?.find(x => x.submissionWorkId == value.id);
                return {value: value.id, label: value.name, disabled: submissionWork !== undefined};
              })}
            />
          </Form.Item>
          <Form.Item name="preferredPosition" label="Виберіть бажану позицію:">
            <Select
              placeholder="Бажана позиція"
              options={[
                {value: 0, label: "На початку"},
                {value: 1, label: "Без різниці"},
                {value: 2, label: "В кінці"},
              ]}
            />
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default SubmissionRegistrationPage;