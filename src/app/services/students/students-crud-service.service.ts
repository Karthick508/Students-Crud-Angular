import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface StudentDetailsModel {
  studentCode: string;
  firstName: string;
  lastName: string;
  department: string;
  gender: string;
  emailId: string;
  dateOfBirth: string | null;
}

export interface ApiResponseModel {
  result: boolean;
  message: SuccessMessageResponse;
  data: any;
  status: number;
}

export interface EmailExistModel {
  emailId: string;
}

export type SuccessMessageResponse = 'Success' | 'Failure';

@Injectable({
  providedIn: 'root',
})
export class StudentsCrudServiceService {
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  readonly API_URL = 'http://localhost:9090';

  public registerStudent(body: StudentDetailsModel) {
    const url = `${this.API_URL}/register-student`;
    return this.http.post<ApiResponseModel>(url, body);
  }

  public getStudentDetails() {
    const url = `${this.API_URL}/getAllStudentsDetails`;
    return this.http.get<ApiResponseModel>(url);
  }

  public deleteStudent(studentCode: string) {
    const url = `${this.API_URL}/deleteStudent/${studentCode}`;
    return this.http.delete<ApiResponseModel>(url);
  }

  public checkEmailExistFromStoredProcedure(body: EmailExistModel) {
    const url = `${this.API_URL}/checkEmailExistinProcedure`;
    return this.http.post<ApiResponseModel>(url, body);
  }

  openSnackBar(
    message: string,
    action: string = 'Close',
    duration: number = 0,
    verticalPosition: 'top' | 'bottom' = 'bottom',
    horizontalPosition: 'start' | 'center' | 'end' | 'left' | 'right' = 'center'
  ) {
    const snack = this.snackBar.open(message, action, {
      duration: duration, // 0 by default (0 => infinite)
      verticalPosition: verticalPosition, // 'top' | 'bottom'
      horizontalPosition: horizontalPosition, // 'start' | 'center' | 'end' | 'left' | 'right'
    });
    snack.afterDismissed().subscribe(() => {});
    snack.onAction().subscribe(() => {});
  }
}
