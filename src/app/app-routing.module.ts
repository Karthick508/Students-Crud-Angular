import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentRegistrationComponent } from './components/students/student-registration/student-registration.component';
import { ViewStudentsComponent } from './components/students/view-students/view-students.component';

const routes: Routes = [
  {
    path : "",
    component : ViewStudentsComponent
  },
  {
    path : "student-reg",
    component : StudentRegistrationComponent
  },
  {
    path : "view-students",
    component : ViewStudentsComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
