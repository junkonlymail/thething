import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { EmployeeModel } from '../EmployeeModel';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  employees: EmployeeModel[];

    constructor(private employeeService: EmployeeService, private router: Router) { }

    ngOnInit() {
      console.log("oninit");
      this.getAllEmployees();
    }

    getAllEmployees(): void {
      this.employeeService.getAllEmployees().subscribe(data=>{
        this.employees = data;
      });
    };

    addEmployee(): void {
      this.router.navigate(['employee-add']);
    }

    deleteEmployee(employee: EmployeeModel){
      this.employeeService.deleteEmployee(employee.id).subscribe(data=>{
        this.getAllEmployees();
      });
    }

    updateEmployee(employee: EmployeeModel) {
      localStorage.removeItem("id");
      localStorage.setItem("id", employee.id);
      this.router.navigate(['employee-edit']);
    }
}
