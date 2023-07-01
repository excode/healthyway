import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import React, { useState } from "react";

interface MealOption {
  label: string;
  value: string;
  image: string;
}

interface MealData {
  weekday: string;
  breakfast: string;
  lunch: string;
  dinner: string;
}

const TabularForm: React.FC = () => {
  const daysOfWeek: string[] = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  const [data, setData] = useState<MealData[]>(
    daysOfWeek.map((day) => ({
      weekday: day,
      breakfast: "",
      lunch: "",
      dinner: "",
    }))
  );

  const mealOptions: MealOption[] = [
    { label: "Meal 1", value: "meal1", image: "meal1.png" },
    { label: "Meal 2", value: "meal2", image: "meal2.png" },
    { label: "Meal 3", value: "meal3", image: "meal3.png" },
    // Add more meal options here
  ];

  const onMealChange = (
    e: { value: string },
    rowIndex: number,
    columnName: keyof MealData
  ) => {
    const updatedData = [...data];
    updatedData[rowIndex][columnName] = e.value;
    setData(updatedData);
  };

  const renderMealDropdown = (
    rowData: MealData,
    rowIndex: number,
    columnName: keyof MealData
  ) => {
    return (
      <Dropdown
        value={rowData[columnName]}
        options={mealOptions}
        optionLabel="label"
        optionValue="value"
        placeholder="Select a meal"
        onChange={(e) => onMealChange(e, rowIndex, columnName)}
      >
        <img
          src={`path/to/images/${rowData[columnName]}.png`}
          alt={rowData[columnName]}
          style={{ width: "50px", height: "50px" }}
        />
      </Dropdown>
    );
  };

  return (
    <DataTable value={data}>
      <Column field="weekday" header="Weekday" />
      <Column
        field="breakfast"
        header="Breakfast"
        body={(rowData, rowIndex) =>
          renderMealDropdown(rowData, rowIndex, "breakfast")
        }
      />
      <Column
        field="lunch"
        header="Lunch"
        body={(rowData, rowIndex) =>
          renderMealDropdown(rowData, rowIndex, "lunch")
        }
      />
      <Column
        field="dinner"
        header="Dinner"
        body={(rowData, rowIndex) =>
          renderMealDropdown(rowData, rowIndex, "dinner")
        }
      />
    </DataTable>
  );
};

export default TabularForm;
