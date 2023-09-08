import {FC, useCallback, useState} from "react";
import {Card, DatePicker, Form, Input, InputNumber, Select, Tag} from "antd";
import {studentApi} from "../../../services/StudentsService.ts";
import {IStudent} from "../../../models/IStudent.ts";
import {ColumnsType} from "antd/es/table";
import dayjs from 'dayjs';
import {subgroupApi} from "../../../services/SubgroupService.ts";
import DataTable from "../../../components/dashboard/DataTable.tsx";

const StudentsInformationPage: FC = () => {
  const [form] = Form.useForm();

  const [selectedRow, setSelectedRow] = useState<IStudent>();

  const studentsQuery = studentApi.useFetchAllQuery();
  const subgroupQuery = subgroupApi.useFetchAllQuery();

  const [update] =  studentApi.useUpdateMutation();
  const [add] =  studentApi.useAddMutation();
  const [remove] = studentApi.useRemoveMutation();

  const maxIndex = useCallback(() => {
      return studentsQuery.data ? Math.max(...studentsQuery.data.map(x => x.index)) : 1;
  }, [studentsQuery.data]);

  const fromPrepareClear = (fieldValue: IStudent) => {
    const index = maxIndex() + 1;
    return {...fieldValue, index: index, birthday: dayjs("2004-01-01", "YYYY-MM-DD")}
  }

  const fromPrepareSelected = (fieldValue: IStudent) => {
    return {...fieldValue, birthday: dayjs(fieldValue.birthday, "YYYY-MM-DD")}
  }

  const columns: ColumnsType<IStudent> = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Surname",
      dataIndex: "surname",
      key: "surname",
    },
    {
      title: "Patronymic",
      dataIndex: "patronymic",
      key: "patronymic",
    },
    {
      title: "Subgroup",
      dataIndex: "subgroupId",
      key: "subgroup",
      render: (subgroupId: number) => {
        const subgroup = subgroupQuery.data?.find(x => x.id === subgroupId);

        return (
          <Tag color="blue">
            {subgroup === undefined ? "None" : subgroup.name}
          </Tag>
        );
      }
    },
    {
      title: "Contact Phone",
      dataIndex: "contactPhone",
      key: "contactPhone",
    },
    {
      title: "Telegram Phone",
      dataIndex: "telegramPhone",
      key: "telegramPhone",
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
    },
    {
      title: "Telegram Nickname",
      dataIndex: "telegramNickname",
      key: "telegramNickname",
    },
    {
      title: "Birthday",
      dataIndex: "birthday",
      key: "birthday",
      ellipsis: true
    },
  ];

  const updateHandler = () => {
    studentsQuery.refetch();
    subgroupQuery.refetch();
  };

  const onFormSubmit = (result: IStudent) => {
    return {...result, birthday: dayjs(result.birthday).format("YYYY-MM-DD").toString()}
  };

  return (
    <Card bordered={false}>
      <DataTable
        form={form}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        updateHandler={updateHandler}
        fromPrepareClear={fromPrepareClear}
        fromPrepareSelected={fromPrepareSelected}
        onFormSubmit={onFormSubmit}
        addMutation={add}
        updateMutation={update}
        removeMutation={remove}
        data={studentsQuery.data}
        dataIsLoading={studentsQuery.isLoading || subgroupQuery.isLoading}
        columns={columns}
        isModalRequired={true}
        alertMessage={"Student selected"}
        deleteMessage={`Are you sure to delete ${selectedRow?.surname} ${selectedRow?.name} ?`}
      >
        <Form.Item name="name" label="Name" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="surname" label="Surname" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="patronymic" label="Patronymic" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="index" label="Index" rules={[{required: true}]}>
          <InputNumber min={1}/>
        </Form.Item>
        <Form.Item name="subgroupId" label="Subgroup" rules={[{required: true}]}>
          <Select
            placeholder="Select subgroup"
            options={subgroupQuery?.data?.map((value) => {
              return {value: value.id, label: value.name}
            })}
          />
        </Form.Item>
        <Form.Item name="contactPhone" label="Contact Phone" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="telegramPhone" label="Telegram Phone" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="fitEmail" label="Fit Email" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="telegramNickname" label="Telegram Nickname">
          <Input/>
        </Form.Item>
        <Form.Item name="birthday" label="Birthday" rules={[{required: true}]}>
          <DatePicker format={"YYYY-MM-DD"}/>
        </Form.Item>
      </DataTable>
    </Card>
  );
};

export default StudentsInformationPage;