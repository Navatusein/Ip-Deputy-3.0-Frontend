import {FC, useState} from "react";
import {Card, Form, Input, InputNumber, Tag} from "antd";
import {ColumnsType} from "antd/es/table";
import {ISubject} from "../../../models/ISubject.ts";
import {subjectApi} from "../../../services/SubjectService.ts";
import DataTable from "../../../components/dashboard/DataTable.tsx";

const StudentsInformationPage: FC = () => {
  const [form] = Form.useForm();

  const [selectedRow, setSelectedRow] = useState<ISubject>();

  const subjectQuery = subjectApi.useFetchAllQuery();

  const [update] =  subjectApi.useUpdateMutation();
  const [add] =  subjectApi.useAddMutation();
  const [remove] = subjectApi.useRemoveMutation();

  const columns: ColumnsType<ISubject> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Short Name",
      dataIndex: "shortName",
      key: "shortName",
    },
    {
      title: "Laboratory Count",
      dataIndex: "laboratoryCount",
      key: "laboratoryCount",
      render: (_, row) => {
        return row.laboratoryCount === 0 ?
          <Tag color="red">None</Tag> :
          row.laboratoryCount;
      }
    },
    {
      title: "Practical Count",
      dataIndex: "practicalCount",
      key: "practicalCount",
      render: (_, row) => {
        return row.practicalCount === 0 ?
          <Tag color="red">None</Tag> :
          row.practicalCount;
      }
    },
  ];

  const updateHandler = () => {
    subjectQuery.refetch();
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
        data={subjectQuery.data}
        dataIsLoading={subjectQuery.isLoading}
        columns={columns}
        isModalRequired={true}
        alertMessage={"Subject selected"}
        deleteMessage={`Are you sure to delete ${selectedRow?.name} ?`}
      >
        <Form.Item name="name" label="Name" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="shortName" label="Short Name" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="laboratoryCount" label="Laboratory Count" rules={[{required: true}]}>
          <InputNumber min={0}/>
        </Form.Item>
        <Form.Item name="practicalCount" label="Practical Count" rules={[{required: true}]}>
          <InputNumber min={0}/>
        </Form.Item>
      </DataTable>
    </Card>
  );
};

export default StudentsInformationPage;