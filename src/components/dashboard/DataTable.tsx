import {FC, ReactNode, useEffect, useState} from 'react';
import {Alert, App, Button, Form, FormInstance, Modal, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined, ExclamationCircleFilled, PlusOutlined, ReloadOutlined} from "@ant-design/icons";
import {IStudent} from "../../models/IStudent.ts";
import {MutationTrigger} from "@reduxjs/toolkit/dist/query/react/buildHooks";
import {ColumnsType} from "antd/es/table";

interface IDataTableProps<T> {
  form?: FormInstance;

  selectedRow?: T;
  setSelectedRow?: (row: T) => void;

  updateHandler: () => void;

  fromPrepareClear?:  (fieldValue: any) => any;
  fromPrepareSelected?:  (fieldValue: any) => any;

  onFormSubmit?: (result: T) => T;

  addMutation?: MutationTrigger<any>;
  updateMutation?: MutationTrigger<any>;
  removeMutation?: MutationTrigger<any>;

  data: T[] | undefined;
  dataIsLoading: boolean;

  columns: ColumnsType<T>;

  children?: ReactNode;

  isModalRequired?: boolean;

  alertMessage?: string;
  deleteMessage?: string;

  isCustomSelect? : boolean;

  additionalControls?: ReactNode;

  borderedTable?: boolean;
}

const DataTable: FC<IDataTableProps<any>> = (props) => {
  const {
    form,
    selectedRow,
    setSelectedRow,
    updateHandler,
    fromPrepareClear,
    fromPrepareSelected,
    onFormSubmit,
    addMutation,
    updateMutation,
    removeMutation,
    data,
    dataIsLoading,
    columns,
    children,
    isModalRequired,
    alertMessage,
    deleteMessage,
    isCustomSelect,
    additionalControls,
    borderedTable,
  } = props;

  const {modal, notification} = App.useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!form)
      return;

    if (selectedRow == undefined) {
      form.resetFields()

      let fieldValue = {id: 0}

      if (fromPrepareClear)
        fieldValue = fromPrepareClear(fieldValue);

      form.setFieldsValue(fieldValue)
    }
    else {
      form.resetFields()
      let fieldValue = {...selectedRow}

      if (fromPrepareSelected)
        fieldValue = fromPrepareSelected(fieldValue);

      form.setFieldsValue(fieldValue)
    }
  }, [form, selectedRow]);

  const modelOkHandler = async () => {
    if (!form)
      return;
    
    await form.validateFields()
      .then(() => {
        form.submit();
        setIsModalOpen(false);
      })
      .catch(() => {
        setIsModalOpen(true);
      });
  };

  const modelCancelHandler = () => {
    setIsModalOpen(false);
  };

  const addHandler = () => {
    if (!setSelectedRow)
      return;
    
    setSelectedRow(undefined);
    setIsModalOpen(true);
  };

  const editHandler = () => {
    setIsModalOpen(true);
  };

  const deleteHandler = () => {
    modal.confirm({
      title: deleteMessage ? deleteMessage : "Are you sure to delete this row?",
      icon: <ExclamationCircleFilled/>,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        if (!removeMutation)
          return;
        
        if (selectedRow != undefined)
          removeMutation(selectedRow.id);
      },
    });
  };

  const formFinishHandler = (result: IStudent) => {
    if (!addMutation || !updateMutation || !setSelectedRow)
      return;
    
    const id = selectedRow ? selectedRow.id : 0;
    const action = id === 0 ? addMutation : updateMutation;

    result = {...result, id: id}

    if (onFormSubmit)
      result = onFormSubmit(result);

    console.log(result)

    action(result)
      .unwrap()
      .catch((error) => {
        if (error.response) {
          notification.error({
            message: error.response.data
          });
        }
      });

    setSelectedRow(undefined);
  }

  return (
    <>
      <div style={{overflow: "auto"}}>
        <Space style={{marginBottom: "15px"}}>
          {additionalControls}
          {isModalRequired &&
            <>
              <Button icon={<PlusOutlined/>} onClick={addHandler}>
                  Add
              </Button>
              <Button icon={<EditOutlined/>} onClick={editHandler} disabled={selectedRow === undefined}>
                  Edit
              </Button>
              <Button icon={<DeleteOutlined/>} onClick={deleteHandler} disabled={selectedRow === undefined}>
                  Delete
              </Button>
            </>
          }
          <Button icon={<ReloadOutlined/>} onClick={updateHandler}>
            Update
          </Button>
        </Space>
      </div>

      {selectedRow && (
        <Alert
          message={alertMessage ? alertMessage : "Row selected"}
          style={{marginBottom: "15px"}}
          closable
          afterClose={() => {
            if (!setSelectedRow)
              return;
            
            setSelectedRow(undefined)
          }}
        />
      )}

      <Table
        dataSource={data}
        columns={columns}
        rowKey={(record) => record.id}
        loading={dataIsLoading}
        scroll={{x: "auto"}}
        pagination={{pageSize: 15}}
        rowSelection={!isCustomSelect ? {
          type: "radio",
          onChange: (_, selectedRows) => {
            if (!setSelectedRow)
              return;
            
            setSelectedRow(selectedRows[0]);
          },
          selectedRowKeys: selectedRow ? [selectedRow.id] : undefined
        } : undefined}
        size="small"
        bordered={borderedTable}
      />

      {isModalRequired &&
          <Modal
          forceRender
          title={selectedRow === undefined ? "Add" : "Edit"}
          open={isModalOpen}
          onOk={modelOkHandler}
          onCancel={modelCancelHandler}
        >
          <Form form={form} onFinish={formFinishHandler}>
            {children}
          </Form>
        </Modal>
      }
    </>
  );
};

export default DataTable;