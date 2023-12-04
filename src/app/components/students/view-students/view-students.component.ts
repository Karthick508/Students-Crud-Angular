import { StudentsCrudServiceService } from './../../../services/students/students-crud-service.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  ApiResponseModel,
  StudentDetailsModel,
} from 'src/app/services/students/students-crud-service.service';
import { mode } from '../student-registration/student-registration.component';

declare let jQuery: any;
@Component({
  selector: 'app-view-students',
  templateUrl: './view-students.component.html',
  styleUrls: ['./view-students.component.scss'],
})
export class ViewStudentsComponent implements OnInit {
  constructor(private studentsCrudService: StudentsCrudServiceService) {}

  @ViewChild('studentRegisPopup') registrationStudPopup!: ElementRef;

  formMode!: mode;
  studentObj : StudentDetailsModel | null= null;
  userDetailsData: StudentDetailsModel[] = [];
  displayedColumns: string[] = [
    'studentCode',
    'firstName',
    'lastName',
    'department',
    'gender',
    'emailId',
    'dateOfBirth',
    'actions',
  ];

  ngOnInit(): void {
    this.loadStudentAllDetails();
  }

  // get All Student Details From Api
  loadStudentAllDetails(): void {
    this.studentsCrudService.getStudentDetails().subscribe({
      next: (data: ApiResponseModel) => {
        if (data.message === 'Success' && data.data) {
          this.userDetailsData = data.data;
        } else {
          this.studentsCrudService.openSnackBar('Error in get Student Details Api','Close',3000);
        }
      },
      error : (err) =>{
        this.studentsCrudService.openSnackBar('Error in get Student Details Api','Close',3000);
      },
      complete() {},
    });
  }

  // open Student Registration component in popup
  openStudentRegComponet(mode: mode, studentObj?: StudentDetailsModel): void {
    this.formMode = mode;
    if (mode === 'create' || mode === 'edit') {
      jQuery(this.registrationStudPopup.nativeElement).modal('show');
      if (mode === 'edit' && studentObj) {
        this.studentObj = { ...studentObj };
      } else if(mode === 'create'){
        this.studentObj =null;
      }
    } else if (mode === 'delete' && studentObj && studentObj.studentCode) {
      this.deleteStudent(studentObj.studentCode);
    }
  }

  // Delete Student Detail
  deleteStudent(studentCode: string): void {
    this.studentsCrudService.deleteStudent(studentCode).subscribe({
      next : (response : ApiResponseModel) =>{
        this.studentsCrudService.openSnackBar('Student Detail Deleted Succesfully','Close',3000);
        this.loadStudentAllDetails();
      },
      error : (err) =>{
        this.studentsCrudService.openSnackBar('Error in Delete Student Api','Close',3000);
      },
      complete() {},
    });
  };

 // Response from child component 
  studentDetailUpdated(event : boolean) : void{
    if (event) {
      jQuery(this.registrationStudPopup.nativeElement).modal('hide');
      this.loadStudentAllDetails();
    } else {
      
    }
  }
}
