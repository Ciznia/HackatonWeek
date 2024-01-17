import { Route, Routes } from "react-router-dom";

import { Home } from "./home";
import { AddEmployee } from "./addEmployee"
import {EmployeeEditor} from "./addEmployee"

export const Router = () => {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addPersonal" element={<AddEmployee />} />
        <Route path="*" element={<Home />} />
        <Route path="/employeeEditor" element={<EmployeeEditor />} />
      </Routes>
    );
  }
