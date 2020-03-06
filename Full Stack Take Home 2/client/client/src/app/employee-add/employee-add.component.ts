import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { Router } from "@angular/router";
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.css']
})

export class EmployeeAddComponent implements OnInit {
      addForm: FormGroup;
      submitted = false;
      errorMessage = "";

    constructor(private formBuilder: FormBuilder, private router: Router, private employeeService: EmployeeService) { }

    ngOnInit() {
      this.addForm = this.formBuilder.group({
        id: [],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        hireDate: ['', Validators.required],
        role: ['', Validators.required]
      });
    }

    onSubmit(){
      console.log("submitted");
      this.submitted = true;

      if(this.addForm.valid){
        this.employeeService.addEmployee(this.addForm.value)
        .subscribe( data => {
          this.router.navigate(['employees']);
        },
        (error) => {
          this.errorMessage = error.error;
          console.log(error.error);
        });
      }
    }

    get f() {
      return this.addForm.controls;
    }
  }
