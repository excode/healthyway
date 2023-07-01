import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";

const TabularForm = () => {
  const [data, setData] = useState([{ name: "", age: "", email: "" }]);

  const onNameChange = (e, rowIndex) => {
    const updatedData = [...data];
    updatedData[rowIndex].name = e.target.value;
    setData(updatedData);
  };

  const onAgeChange = (e, rowIndex) => {
    const updatedData = [...data];
    updatedData[rowIndex].age = e.target.value;
    setData(updatedData);
  };

  const onEmailChange = (e, rowIndex) => {
    const updatedData = [...data];
    updatedData[rowIndex].email = e.target.value;
    setData(updatedData);
  };

  const addRow = () => {
    setData([...data, { name: "", age: "", email: "" }]);
  };

  const removeRow = (rowIndex) => {
    const updatedData = [...data];
    updatedData.splice(rowIndex, 1);
    setData(updatedData);
  };

  return (
    <div>
      <DataTable value={data}>
        <Column
          header="Name"
          body={(rowData, rowIndex) => (
            <InputText
              value={rowData.name}
              onChange={(e) => onNameChange(e, rowIndex)}
            />
          )}
        />
        <Column
          header="Age"
          body={(rowData, rowIndex) => (
            <InputText
              value={rowData.age}
              onChange={(e) => onAgeChange(e, rowIndex)}
            />
          )}
        />
        <Column
          header="Email"
          body={(rowData, rowIndex) => (
            <InputText
              value={rowData.email}
              onChange={(e) => onEmailChange(e, rowIndex)}
            />
          )}
        />
        <Column
          header="Actions"
          body={(rowData, rowIndex) => (
            <Button icon="pi pi-trash" onClick={() => removeRow(rowIndex)} />
          )}
        />
      </DataTable>

      <Button label="Add Row" onClick={addRow} />
    </div>
  );
};

export default TabularForm;
