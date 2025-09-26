import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, OnInit, inject, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskItem, TaskItemStatus, TaskDto } from '../../../core/models/task.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

declare var bootstrap: any; // Declare bootstrap to avoid TypeScript errors

@Component({
  selector: 'app-task-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './task-edit-modal.component.html',
  styleUrl: './task-edit-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskEditModalComponent implements OnInit, OnChanges {
  @ViewChild('editTaskModal') modalElement!: ElementRef<HTMLElement>;
  private modal: any;
  private lastFocusedElement: HTMLElement | null = null;
  @Input() task: TaskItem | null = null;
  @Output() save = new EventEmitter<TaskItem>();
  @Output() cancel = new EventEmitter<void>();

  taskForm!: FormGroup;
  taskItemStatusOptions = Object.values(TaskItemStatus);

  // Icons
  faSave = faSave;
  faTimes = faTimes;

  private fb = inject(FormBuilder);

  ngOnInit(): void {
    // Inicializar el formulario
    this.initializeForm();
    
    // Inicializar el modal después de que la vista se haya inicializado
    setTimeout(() => {
      if (this.modalElement?.nativeElement) {
        this.modal = new bootstrap.Modal(this.modalElement.nativeElement, {
          backdrop: 'static',
          keyboard: false
        });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Asegurarse de que el formulario esté inicializado
    if (!this.taskForm) {
      this.initializeForm();
    }

    if (changes['task'] && this.taskForm) {
      if (this.task) {
        this.taskForm.patchValue({
          title: this.task.title,
          description: this.task.description,
          status: this.task.status,
          dueDate: this.task.dueDate?.split('T')[0] || ''
        });
      } else {
        this.taskForm.reset({
          title: '',
          description: '',
          status: TaskItemStatus.Pending,
          dueDate: ''
        });
      }
    }
  }

  private initializeForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.minLength(3), Validators.maxLength(500)]],
      status: [TaskItemStatus.Pending, Validators.required],
      dueDate: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      if (this.task) {
        // Update existing task
        const updatedTask: TaskItem = {
          ...this.task,
          ...this.taskForm.value
        };
        this.save.emit(updatedTask);
      } else {
        // Handle case where task is null (shouldn't happen in normal flow)
        console.error('No task selected for editing');
      }
    } else {
      this.taskForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  show(): void {
    if (this.modal) {
      // Guardar el elemento que tenía el foco antes de abrir el modal
      this.lastFocusedElement = document.activeElement as HTMLElement;
      
      // Mostrar el modal
      this.modal.show();
      
      // Mover el foco al primer elemento enfocable dentro del modal
      const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const modalContent = this.modalElement.nativeElement.querySelector('.modal-content');
      if (modalContent) {
        const focusableContent = modalContent.querySelectorAll(focusableElements);
        if (focusableContent.length > 0) {
          (focusableContent[0] as HTMLElement).focus();
        }
      }
    }
  }

  hide(): void {
    if (this.modal) {
      // Ocultar el modal
      this.modal.hide();
      
      // Restaurar el foco al elemento que lo tenía antes de abrir el modal
      if (this.lastFocusedElement) {
        // Usar setTimeout para asegurar que el modal se haya ocultado completamente
        setTimeout(() => {
          if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
            this.lastFocusedElement.focus();
          }
          this.lastFocusedElement = null;
        }, 100);
      }
    }
  }
}
