import { Route, Routes } from "react-router-dom";

import { Home } from "./home";
import {EmployeeEditor} from "./addEmployee"

export const Router = () => {
    return (
      <Routes>
        <Route path="*" element={<EmployeeEditor />} />
      </Routes>
    );
  }
