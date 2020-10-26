import { CourseService } from 'src/app/services/course.service';
import { Course } from './../../../models/course.model';
import { CreateCourseComponent } from './../../../pages/create-course/create-course.component';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit {
  user: User;
  courses: any[];

  selectedCourse: any;

  constructor(private userService: UserService, private router: Router, private courseService: CourseService) {}

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();
    this.courses =
      this.user.type === 'IL'
        ? this.user.classesEnrolled
        : this.user.classesTeaching;

    console.log("kist", this.user)
  }

  ngOnChanges(): void {
    this.user = this.userService.getCurrentUser();
    this.courses =
      this.user.type === 'IL'
        ? this.user.classesEnrolled
        : this.user.classesTeaching;
  }

  /**
   * TODO: Setup
   */
  addNewCourse(): void {
    if(this.user.type === 'IL') {
      console.log("ADD NEW COURSE STUDENT");
      this.router.navigate(['enrollcourse']);
    } else if(this.user.type === 'IC') {
      console.log("CREATE NEW COURSE TEACHER");
      this.router.navigate(['createcourse']);
    }
  }

  onClick($event){
    this.selectedCourse = $event;
    this.dropCourse();
  }
  dropCourse(): void {
    if (!this.selectedCourse) return;
    this.user.classesEnrolled = this.user.classesEnrolled.filter((course: any) => course._id !== this.selectedCourse._id);
    this.userService.setUser(this.user);
    this.courseService.dropACourse(this.userService.getCurrentUser()._id, this.selectedCourse._id)
      .subscribe(
        (res) => {
          console.log(res);
          this.userService
            .dropACourse(this.userService.getCurrentUser()._id, this.selectedCourse._id)
            .subscribe(
              (res) => console.log(res),
              (err) => console.log(err)
            );
        },
        (err) => console.log(err)
      );
    this.ngOnChanges();
  }
}
