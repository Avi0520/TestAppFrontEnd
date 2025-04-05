import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../../../../course-service.service';
import { SharedModule } from '../../../shared/shared/shared.module';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent implements OnInit {
  courses: any[] = [];
  newCourse: any = {};
  selectedCourse: any = {};
  private readonly STORAGE_KEY = 'courses_data';

  constructor(
    private courseService: CourseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    // Try to load from local storage first
    const storedData = localStorage.getItem(this.STORAGE_KEY);
    if (storedData) {
      this.courses = JSON.parse(storedData);
    }
    
    // Then load from API to ensure we have latest data
    this.courseService.getAllCourses().subscribe(
      (data) => {
        this.courses = data;
        this.saveToLocalStorage();
      },
      (error) => {
        console.error('Error loading courses:', error);
      }
    );
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.courses));
  }

  onNameChange(value: string): void {
    if (this.selectedCourse.id) {
      this.selectedCourse.name = value;
    } else {
      this.newCourse.name = value;
    }
  }

  onDescriptionChange(value: string): void {
    if (this.selectedCourse.id) {
      this.selectedCourse.description = value;
    } else {
      this.newCourse.description = value;
    }
  }

  createCourse(): void {
    this.courseService.createCourse(this.newCourse).subscribe(
      (createdCourse) => {
        this.courses.push(createdCourse);
        this.saveToLocalStorage();
        this.newCourse = {};
      },
      (error) => {
        console.error('Error creating course:', error);
      }
    );
  }

  editCourse(course: any): void {
    this.selectedCourse = { ...course };
  }

  updateCourse(): void {
    this.courseService.updateCourse(this.selectedCourse.id, this.selectedCourse)
      .subscribe(
        (updatedCourse) => {
          const index = this.courses.findIndex(c => c.id === updatedCourse.id);
          if (index !== -1) {
            this.courses[index] = updatedCourse;
          }
          this.saveToLocalStorage();
          this.selectedCourse = {};
        },
        (error) => {
          console.error('Error updating course:', error);
        }
      );
  }

  deleteCourse(id: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(id).subscribe(
        () => {
          this.courses = this.courses.filter(course => course.id !== id);
          this.saveToLocalStorage();
        },
        (error) => {
          console.error('Error deleting course:', error);
        }
      );
    }
  }

  viewTests(courseId: number): void {
    this.router.navigate([`/admin/course/${courseId}/tests`]);
  }
} 