import {FC, useState} from "react";
import {Card, Form, Input} from "antd";
import {ColumnsType} from "antd/es/table";
import {ITeacher} from "../../../models/ITeacher.ts";
import {teacherApi} from "../../../services/TeacherService.ts";
import DataTable from "../../../components/dashboard/DataTable.tsx";

const StudentsInformationPage: FC = () => {
  const [form] = Form.useForm();

  const [selectedRow, setSelectedRow] = useState<ITeacher>();

  const teacherQuery = teacherApi.useFetchAllQuery();

  const [update] =  teacherApi.useUpdateMutation();
  const [add] =  teacherApi.useAddMutation();
  const [remove] = teacherApi.useRemoveMutation();

  const columns: ColumnsType<ITeacher> = [
    {
      title: "Surname",
      dataIndex: "surname",
      key: "surname",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Patronymic",
      dataIndex: "patronymic",
      key: "patronymic",
    },
    {
      title: "Contact Phone",
      dataIndex: "contactPhone",
      key: "contactPhone",
    },
    {
      title: "Telegram Nickname",
      dataIndex: "telegramNickname",
      key: "telegramNickname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Fit Email",
      dataIndex: "fitEmail",
      key: "fitEmail",
    }
  ];

  const updateHandler = () => {
    teacherQuery.refetch();
  };

  return (
    <Card bordered={false}>
      <DataTable
        form={form}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        updateHandler={updateHandler}
        addMutation={add}
        updateMutation={update}
        removeMutation={remove}
        data={teacherQuery.data}
        dataIsLoading={teacherQuery.isLoading}
        columns={columns}
        isModalRequired={true}
        alertMessage={"Teacher selected"}
        deleteMessage={`Are you sure to delete ${selectedRow?.surname} ${selectedRow?.patronymic} ?`}
      >
        <Form.Item name="surname" label="Surname" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="name" label="Name" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="patronymic" label="Patronymic" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="contactPhone" label="Contact Phone">
          <Input/>
        </Form.Item>
        <Form.Item name="telegramNickname" label="Telegram Nickname">
          <Input/>
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input/>
        </Form.Item>
        <Form.Item name="fitEmail" label="Fit Email">
          <Input/>
        </Form.Item>
      </DataTable>
    </Card>
  );
};

export default StudentsInformationPage;