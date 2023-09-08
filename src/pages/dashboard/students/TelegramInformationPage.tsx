import {FC, useState} from "react";
import {Card, Form, Input, Select} from "antd";
import {ColumnsType} from "antd/es/table";
import {studentsTelegramApi} from "../../../services/StudentTelegramsService.ts";
import {IStudentTelegram} from "../../../models/IStudentTelegram.ts";
import {studentApi} from "../../../services/StudentsService.ts";
import moment from "moment-timezone";
import DataTable from "../../../components/dashboard/DataTable.tsx";

const StudentsInformationPage: FC = () => {
  const [form] = Form.useForm();

  const [selectedRow, setSelectedRow] = useState<IStudentTelegram>();

  const studentTelegramsQuery = studentsTelegramApi.useFetchAllQuery();
  const studentsQuery = studentApi.useFetchAllQuery();

  const [update] =  studentsTelegramApi.useUpdateMutation();
  const [add] =  studentsTelegramApi.useAddMutation();
  const [remove] = studentsTelegramApi.useRemoveMutation();

  const columns: ColumnsType<IStudentTelegram> = [
    {
      title: "Name",
      key: "name",
      render: (_, value) => {
        if (!studentsQuery.data)
          return "";

        return studentsQuery.data.find(x => x.id == value.studentId)?.name;
      }
    },
    {
      title: "Surname",
      key: "surname",
      render: (_, value) => {
        if (!studentsQuery.data)
          return "";

        return studentsQuery.data.find(x => x.id == value.studentId)?.surname;
      }
    },
    {
      title: "Patronymic",
      key: "patronymic",
      render: (_, value) => {
        if (!studentsQuery.data)
          return "";

        return studentsQuery.data.find(x => x.id == value.studentId)?.patronymic;
      }
    },
    {
      title: "Telegram Id",
      dataIndex: "telegramId",
      key: "telegramId",
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
    },
    {
      title: "Schedule Compact",
      dataIndex: "scheduleCompact",
      key: "scheduleCompact",
      render: (_, value) => {
        return value.scheduleCompact ? "true" : "false";
      }
    },
    {
      title: "Last Congratulations",
      dataIndex: "lastCongratulations",
      key: "lastCongratulations",
      render: (_, value) => {
        return value.lastCongratulations ? moment.utc(value.lastCongratulations).tz("Europe/Kyiv").format("YYYY-MM-DD HH:mm:ss") : "";
      }
    },
    {
      title: "Last Activity",
      dataIndex: "lastActivity",
      key: "lastActivity",
      render: (_, value) => {
        return value.lastActivity ? moment.utc(value.lastActivity).tz("Europe/Kyiv").format("YYYY-MM-DD HH:mm:ss") : "";
      }
    },
  ];

  const updateHandler = () => {
    studentTelegramsQuery.refetch();
  };

  const onFormSubmit = (result: IStudentTelegram) => {
    return {...result, language: "uk", scheduleCompact: false}
  }

  return (
    <Card bordered={false}>
      <DataTable
        form={form}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        updateHandler={updateHandler}
        onFormSubmit={onFormSubmit}
        addMutation={add}
        updateMutation={update}
        removeMutation={remove}
        data={studentTelegramsQuery.data}
        dataIsLoading={studentTelegramsQuery.isLoading || studentsQuery.isLoading}
        columns={columns}
        isModalRequired={true}
        alertMessage={"Student telegram selected"}
        deleteMessage={`Are you sure to delete ${selectedRow?.telegramId} ?`}
      >
        <Form.Item name="studentId" label="Student" rules={[{required: true}]}>
          <Select
            placeholder="Select student"
            options={studentsQuery?.data?.map((value) => {
              return {value: value.id, label: `${value.surname} ${value.name}`}
            })}
          />
        </Form.Item>
        <Form.Item name="telegramId" label="Telegram Id" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
      </DataTable>
    </Card>
  );
};

export default StudentsInformationPage;