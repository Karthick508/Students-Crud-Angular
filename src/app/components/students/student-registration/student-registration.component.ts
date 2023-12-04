import {
  ApiResponseModel,
  EmailExistModel,
  StudentsCrudServiceService,
} from './../../../services/students/students-crud-service.service';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { StudentDetailsModel } from 'src/app/services/students/students-crud-service.service';


export interface StudentDetailsFgModel {
  studentCode: FormControl<string | null>;
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  department: FormControl<string | null>;
  gender: FormControl<string | null>;
  emailId: FormControl<string | null>;
  dateOfBirth: FormControl<Date | null>;
}

export type mode = 'create' | 'edit' | 'delete';
export type headerNameMode = 'Add New Student' | 'Modify Student Detail';
@Component({
  selector: 'app-student-registration',
  templateUrl: './student-registration.component.html',
  styleUrls: ['./student-registration.component.scss'],
})
export class StudentRegistrationComponent implements OnInit {
  @Input() mode!: mode;
  @Input() studentObj: StudentDetailsModel | null = null;

  @Output() studentDataUpdated = new EventEmitter<boolean>();

  headerName: headerNameMode = 'Add New Student';

  constructor(private studentsCrudService: StudentsCrudServiceService) {}

  studentsFormGroup = new FormGroup<StudentDetailsFgModel>({
    studentCode: new FormControl<string | null>('', [
      Validators.required,
      this.onlyAlphabetsAndNumbers,
    ]),
    firstName: new FormControl<string | null>('', [
      Validators.required,
      this.alphabetsOnlyValidator(),
    ]),
    lastName: new FormControl<string | null>('', [
      Validators.required,
      this.alphabetsOnlyValidator(),
    ]),
    department: new FormControl<string | null>('', [
      Validators.required,
      this.alphabetsOnlyValidator(),
    ]),
    gender: new FormControl<string | null>(null, [Validators.required]),
    emailId: new FormControl<string | null>('', [
      Validators.required,
      Validators.email,
    ]),
    dateOfBirth: new FormControl<Date | null>(null, Validators.required),
  });

  genderValues: string[] = ['Male', 'Female', 'Others'];

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.mode === 'edit' && this.studentObj) {
      this.assignFormGroupValues(this.studentObj);
      this.headerName = 'Modify Student Detail';
    } else if (this.mode === 'create') {
      this.headerName = 'Add New Student';
      this.resetForm();
    }
  }

  convertDate(inputDate : string) {
    const [day, month, year] = inputDate.split('/');
    return `${year}-${month}-${day}`;
  }

  assignFormGroupValues(studentData?: StudentDetailsModel | null) {
    if (studentData) {
      if (studentData && studentData.dateOfBirth) {
        const dateOfBirthValue = this.convertDate(studentData.dateOfBirth);
        this.studentsFormGroup.controls['dateOfBirth'].setValue(new Date(dateOfBirthValue));
      } else {

      }
      this.studentsFormGroup.controls['firstName'].setValue(
        studentData.firstName
      );
      this.studentsFormGroup.controls['lastName'].setValue(
        studentData.lastName
      );
      this.studentsFormGroup.controls['department'].setValue(
        studentData.department
      );
      this.studentsFormGroup.controls['gender'].setValue(studentData.gender);
      this.studentsFormGroup.controls['emailId'].setValue(studentData.emailId);
      this.studentsFormGroup.controls['studentCode'].setValue(
        studentData.studentCode
      );
    } else {
    }
  }

  saveStudentDetails(): void {
    if (this.studentsFormGroup.valid) {
      const studentData = this.studentsFormGroup.value as StudentDetailsModel;
      studentData.dateOfBirth = this.saveDateConversion(studentData.dateOfBirth);
      this.registerStudentDetails(studentData);
    } else {
      this.studentsFormGroup.markAllAsTouched();
    }
  }

  resetForm(): void {
    this.studentsFormGroup.reset();
  }

  alphabetsOnlyValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === '') {
        return null;
      } else {
        const PATTERN = /^[a-zA-Z]*$/;
        const result = PATTERN.test(control.value);
        if (result === false) {
          return { alphabetValidator: true };
        } else {
          return null;
        }
      }
    };
  }

  onlyAlphabetsAndNumbers(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === '') {
        return null;
      } else {
        const PATTERN = /^[a-zA-Z0-9]*$/;
        const result = PATTERN.test(control.value);
        if (result === false) {
          return { alphabetValidator: true };
        } else {
          return null;
        }
      }
    };
  }

  commonErrorMessage(formControlName: string): string | null {
    return this.studentsFormGroup.get(formControlName)?.hasError('required')
      ? 'Required'
      : this.studentsFormGroup.get(formControlName)?.errors?.[
          'alphabetValidator'
        ]
      ? 'Only Alphabets Allowed'
      : this.studentsFormGroup.get(formControlName)?.errors?.[
          'emailIdExistValidator'
        ]
      ? 'You are already a member kindly give another email'
      : null;
  }

  saveDateConversion(date: any): string {
    const inputDateString = date;
    const inputDate = new Date(inputDateString);

    const day = inputDate.getDate().toString().padStart(2, '0');
    const monthNames = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ];
    const month = monthNames[inputDate.getMonth()];
    const year = inputDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }

  // Save/Update Student Detail
  registerStudentDetails(studentData: StudentDetailsModel): void {
    this.studentsCrudService.registerStudent(studentData).subscribe({
      next: (response: ApiResponseModel) => {
        if (response && response.message === 'Success') {
          this.studentsCrudService.openSnackBar(
            'Student Detail Saved Succesfully',
            'Close',
            3000
          );
          this.studentDataUpdated.emit(true);
        } else {
          this.studentsCrudService.openSnackBar(
            'Error in Student Detail Save',
            'Close'
          );
          this.studentDataUpdated.emit(false);
        }
      },
      error: (err) => {
        this.studentsCrudService.openSnackBar(
          'Error in Student Detail Save',
          'Close'
        );
        this.studentDataUpdated.emit(false);
      },
      complete() {},
    });
  }

  checkEmailExist(): void {
    const emailIdControlValue =
      this.studentsFormGroup.controls['emailId'].value;
    if (emailIdControlValue) {
      const emailBody: EmailExistModel = {
        emailId: emailIdControlValue,
      };
      this.studentsCrudService
        .checkEmailExistFromStoredProcedure(emailBody)
        .subscribe({
          next: (response: ApiResponseModel) => {
            if (response && response.message === 'Success') {
              if (response.data > 0) {
                this.studentsFormGroup.controls['emailId'].setErrors({
                  emailIdExistValidator: true,
                });
              } else {
                // Do nothing
              }
            } else {
              this.studentsCrudService.openSnackBar(
                'Error in Email id Exist Api',
                'Close',
                3000
              );
            }
          },
          error: (err) => {
            this.studentsCrudService.openSnackBar(
              'Error in Email id Exist Api',
              'Close',
              3000
            );
          },
          complete() {},
        });
    } else {
    }
  }
}
