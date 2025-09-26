import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowUpAZ, faArrowDownZA, faTimes } from '@fortawesome/free-solid-svg-icons';
import { TaskItemStatus } from '../../../../core/models/task.model';

export interface TaskFilters {
  status: TaskItemStatus | null;
  dueDate: string | null;
  sortBy: 'title' | 'dueDate';
  sortDirection: 'asc' | 'desc';
}

@Component({
  selector: 'app-filter-sort-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './filter-sort-bar.component.html',
  styleUrls: ['./filter-sort-bar.component.scss']
})
export class FilterSortBarComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<TaskFilters>();

  private fb = inject(FormBuilder);

  // Form Controls
  controls = this.fb.group({
    status: this.fb.control<TaskItemStatus | null>(null),
    dueDate: this.fb.control<string | null>(null),
    sortBy: this.fb.control<'title' | 'dueDate'>('title', { nonNullable: true }),
  });

  // State
  sortDirection: 'asc' | 'desc' = 'asc';
  taskStatusOptions = Object.values(TaskItemStatus);

  // Icons
  faArrowUpAZ = faArrowUpAZ;
  faArrowDownZA = faArrowDownZA;
  faTimes = faTimes;

  ngOnInit(): void {
    this.controls.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      tap(() => this.emitFilters())
    ).subscribe();
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.emitFilters();
  }

  clearFilters(): void {
    this.controls.reset({
      status: null,
      dueDate: null,
      sortBy: 'title'
    });
    if (this.sortDirection !== 'asc') {
      this.sortDirection = 'asc';
    }
    // The reset will trigger valueChanges, so no need to call emitFilters() here
  }

  emitFilters(): void {
    const formValue = this.controls.getRawValue();
    this.filtersChanged.emit({
      ...formValue,
      sortDirection: this.sortDirection
    });
  }

  getStatusText(status: TaskItemStatus): string {
    if (status === TaskItemStatus.InProgress) {
      return 'In Progress';
    }
    return status;
  }
}