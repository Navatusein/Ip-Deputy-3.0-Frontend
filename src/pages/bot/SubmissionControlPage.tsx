import {FC, useEffect, useState} from 'react';
import {useOutletContext} from "react-router-dom";
import {IBotLayoutContext} from "../../components/BotLayout.tsx";
import {submissionStudentApi} from "../../services/SubmissionStudentService.ts";
import {Button, Card, Divider, List, Select, Spin} from "antd";
import {subjectApi} from "../../services/SubjectService.ts";
import {subjectTypeApi} from "../../services/SubjectTypeService.ts";
import {submissionsConfigApi} from "../../services/SubmissionsConfigsService.ts";
import {ISubmissionsConfig} from "../../models/ISubmissionsConfig.ts";
import {DeleteOutlined} from "@ant-design/icons";
import {subgroupApi} from "../../services/SubgroupService.ts";
import {ISubmissionStudent} from "../../models/ISubmissionStudent.ts";

const SubmissionControlPage: FC = () => {
  const {isAuthorized, telegram, user} = useOutletContext<IBotLayoutContext>();

  const submissionsConfigsQuery = submissionsConfigApi.useFetchAllQuery(undefined, {skip: !isAuthorized});
  const submissionStudentQuery = submissionStudentApi.useFetchByStudentQuery(user?.studentId == undefined ? 0 : user.studentId, {skip: !isAuthorized});
  const subjectQuery = subjectApi.useFetchAllQuery(undefined,{skip: !isAuthorized});
  const subjectTypeQuery = subjectTypeApi.useFetchAllQuery(undefined,{skip: !isAuthorized});
  const subgroupQuery = subgroupApi.useFetchAllQuery(undefined,{skip: !isAuthorized});

  const [update] =  submissionStudentApi.useUpdateMutation();
  const [remove] =  submissionStudentApi.useRemoveMutation();

  const [isLoading, setIsLoading] = useState(true);
  const [submissionsConfigs, setSubmissionsConfigs] = useState<ISubmissionsConfig[]>([]);

  useEffect(() => {
    telegram.MainButton.text = "Завершити"
    telegram.MainButton.isVisible = true;
    telegram.MainButton.onClick(() => {
      telegram.close();
    })
  }, [])

  useEffect(() => {
    setIsLoading(true);
    const submissionsConfigIds = [...new Set(submissionStudentQuery.data?.map(item => item.submissionsConfigId))];
    const submissionsConfigs = submissionsConfigsQuery.data?.filter(x => submissionsConfigIds.includes(x.id));
    setSubmissionsConfigs(submissionsConfigs === undefined ? [] : submissionsConfigs);
    setIsLoading(false);
  }, [submissionStudentQuery.data, submissionsConfigsQuery.data]);

  const removeHandler = (id: number) => {
    telegram.showConfirm(
      "Бажаете видалити запис?",
      (confirm: boolean) => {
        if (!confirm)
          return;

        remove (id)
          .unwrap()
          .catch((error) => {
            if (error.response) {
              telegram.showAlert(error.message);
            }
          });
      });
  };

  const onPreferredPositionChange = (value: number, data: ISubmissionStudent[] | undefined) => {
    telegram.showConfirm(
      "Бажаете змінити бажану позицію?",
      () => {
        update({...data![0], preferredPosition: value})
          .unwrap()
          .catch((error) => {
            if (error.response) {
              telegram.showAlert(error.message);
            }
          });
      });
  };

  return (
    <>
      <Card bordered={false}>
        <h3 style={{marginTop: "0", marginBottom: "10px"}}>Мої записи</h3>
        {isLoading &&
            <div style={{display: "flex", flexDirection:"column"}}>
                <Spin/>
            </div>
        }
        {submissionsConfigs.map((submissionsConfig, index) => {
          const subject = subjectQuery.data?.find(x => x.id === submissionsConfig.subjectId);
          const name = submissionsConfig.customName != undefined ? submissionsConfig.customName : subject?.shortName;

          const subjectType = subjectTypeQuery.data?.find(x => x.id === submissionsConfig.subjectTypeId);
          const type = submissionsConfig.customType != undefined ? submissionsConfig.customType : subjectType?.shortName;

          const subgroup = subgroupQuery.data?.find(x => x.id == submissionsConfig.subgroupId);

          const data = submissionStudentQuery.data?.filter(x => x.submissionsConfigId == submissionsConfig.id);

          let preferredPosition = data?.sort((a,b)=> b.id - a.id)[0].preferredPosition;

          return (
            <div key={submissionsConfig.id}>
              {index > 0 && <Divider/>}
              <h4 style={{marginTop: "0", marginBottom: "5px"}}>{`${name} (${type}) ${subgroup !== undefined ? subgroup.name : ""}`}</h4>
              <div style={{display: "flex", alignItems: "baseline"}}>
                <label style={{marginRight: "5px"}}>
                  Бажана позиція:
                </label>
                <Select
                  style={{flexGrow: 1}}
                  placeholder="Бажана позиція"
                  defaultValue={preferredPosition === undefined ? 1 : preferredPosition}
                  onChange={value => {onPreferredPositionChange(value, data)}}
                  options={[
                    {value: 0, label: "На початку"},
                    {value: 1, label: "Без різниці"},
                    {value: 2, label: "В кінці"},
                  ]}
                />
              </div>
              <h4 style={{marginTop: "0", marginBottom: "5px"}}>Записи:</h4>
              <List
                bordered
                dataSource={data}
                size="small"
                renderItem={(item) => {
                  const submissionWork = submissionsConfig.submissionWorks.find(x => x.id === item.submissionWorkId)!;
                  return(
                    <List.Item
                      actions={[
                        <Button danger size="small" icon={<DeleteOutlined/>} onClick={() => {removeHandler(item.id)}}/>
                      ]}
                    >
                      {submissionWork.name}
                    </List.Item>
                  );
                }}
              />
            </div>
          );
        })}
      </Card>
    </>
  );
};

export default SubmissionControlPage;
