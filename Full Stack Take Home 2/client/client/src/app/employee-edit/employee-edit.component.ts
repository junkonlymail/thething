import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { Router } from "@angular/router";
import { EmployeeModel } from '../EmployeeModel';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css']
})

export class EmployeeEditComponent implements OnInit {
    employee: EmployeeModel;
    editForm: FormGroup;
    submitted = false;
    errorMessage = "";

    constructor(private formBuilder: FormBuilder, private router: Router, private employeeService: EmployeeService) { }

    ngOnInit() {
      let id = localStorage.getItem("id");

      if(!id){
        this.router.navigate(['employees']);
        return;
      }

      this.editForm = this.formBuilder.group({
        id: [],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        hireDate: ['', Validators.required],
        role: ['', Validators.required]
      });

      this.employeeService.getEmployeeById(id).subscribe(data=>{
        this.editForm.patchValue(data);
      });
    }

    get f() {
      return this.editForm.controls;
    }

    onSubmit() {
      this.submitted = true;

      if (this.editForm.valid) {
        this.employeeService.updateEmployee(this.editForm.value)
        .subscribe( data => {
          this.router.navigate(['employees']);
        },
        (error) => {
          this.errorMessage = error.error;
          console.log(error.error);
        });
      }
    }
}
