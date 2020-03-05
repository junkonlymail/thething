import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmployeeModel } from './EmployeeModel';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  baseurl: string = "http://localhost:3000/api/";

  getAllEmployees(){
    return this.http.get<EmployeeModel[]>(this.baseurl + 'employees');
  }

  getEmployeeById(id: string){
    return this.http.get<EmployeeModel>(this.baseurl + 'employees' + '/' + id);
  }

  addEmployee(Employee: EmployeeModel){
    return this.http.post(this.baseurl + 'employees', Employee);
  }

  deleteEmployee(id: string){
    return this.http.delete(this.baseurl + 'employees' + '/' + id);
  }

  updateEmployee(Employee: EmployeeModel){
    return this.http.put(this.baseurl + 'employees' + '/' + Employee.id, Employee);
  }
}
