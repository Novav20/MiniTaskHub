import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements AfterViewInit, OnDestroy {
  @Input() title: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to perform this action?';
  @Input() confirmButtonText: string = 'Confirm';
  @Input() cancelButtonText: string = 'Cancel';
  @Input() modalId: string = 'confirmModal';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild('modalElement') modalElementRef!: ElementRef<HTMLElement>;
  private modal: any;
  private lastFocusedElement: HTMLElement | null = null;
  private isInitialized = false;
  isModalVisible = false;

  private backdropClickHandler: ((event: MouseEvent) => void) | null = null;

  ngAfterViewInit(): void {
    if (this.modalElementRef?.nativeElement) {
      this.modal = new bootstrap.Modal(this.modalElementRef.nativeElement, {
        backdrop: true,
        keyboard: true,
        focus: false
      });
      this.isInitialized = true;
      
      const element = this.modalElementRef.nativeElement;
      
      element.addEventListener('shown.bs.modal', this.onModalShown.bind(this));
      element.addEventListener('hidden.bs.modal', this.onModalHidden.bind(this));
      
      this.backdropClickHandler = (event: MouseEvent) => {
        if (event.target === element) {
          this.hide();
          this.cancel.emit();
        }
      };
      element.addEventListener('click', this.backdropClickHandler);
    }
  }

  private onModalShown(): void {
    this.setFocusToFirstFocusableElement();
    
    if (this.modalElementRef?.nativeElement) {
      this.modalElementRef.nativeElement.addEventListener('keydown', this.handleKeydown.bind(this));
    }
  }
  
  private setFocusToFirstFocusableElement(): void {
    // Wait for the modal to be fully visible
    setTimeout(() => {
      const focusableElements = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
      const modalContent = this.modalElementRef?.nativeElement.querySelector('.modal-content');
      
      if (modalContent) {
        const focusableContent = Array.from(modalContent.querySelectorAll(focusableElements))
          .filter(el => {
            // Filter out hidden elements
            const style = window.getComputedStyle(el as Element);
            return !(el as HTMLElement).hidden && 
                   style.visibility !== 'hidden' && 
                   style.display !== 'none';
          });
        
        // Focus the first focusable element in the footer or the first focusable element
        const firstFocusable = modalContent.querySelector('.modal-footer button:not([disabled])') || focusableContent[0];
        if (firstFocusable) {
          (firstFocusable as HTMLElement).focus();
        }
      }
    }, 50); // Small delay to ensure the modal is fully visible
  }
  
  private handleKeydown(event: KeyboardEvent): void {
    // Close the modal on Escape key
    if (event.key === 'Escape') {
      this.onCancel();
      event.preventDefault();
      event.stopPropagation();
    }
    // Trap focus inside the modal
    else if (event.key === 'Tab') {
      const focusableElements = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
      const modalContent = this.modalElementRef?.nativeElement.querySelector('.modal-content');
      
      if (modalContent) {
        const focusableContent = Array.from(modalContent.querySelectorAll(focusableElements))
          .filter(el => {
            const style = window.getComputedStyle(el as Element);
            return !(el as HTMLElement).hidden && 
                   style.visibility !== 'hidden' && 
                   style.display !== 'none';
          }) as HTMLElement[];
        
        if (focusableContent.length === 0) return;
        
        const firstFocusable = focusableContent[0];
        const lastFocusable = focusableContent[focusableContent.length - 1];
        
        if (event.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            event.preventDefault();
          }
        }
      }
    }
  }

  private onModalHidden(): void {
    if (this.modalElementRef?.nativeElement) {
      this.modalElementRef.nativeElement.removeEventListener('keydown', this.handleKeydown);
      
      const modalElement = this.modalElementRef.nativeElement;
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      modalElement.setAttribute('aria-hidden', 'true');
      modalElement.setAttribute('inert', 'true');
      
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      const backdrop = document.querySelector('.modal-backdrop');
      backdrop?.remove();
    }
    
    this.restoreFocus();
    this.isModalVisible = false;
  }

  show(): void {
    if (this.modal) {
      this.lastFocusedElement = document.activeElement as HTMLElement;
      
      if (this.modalElementRef?.nativeElement) {
        this.modalElementRef.nativeElement.removeAttribute('aria-hidden');
        this.modalElementRef.nativeElement.removeAttribute('inert');
      }
      
      setTimeout(() => {
        try {
          this.modal.show();
          this.isModalVisible = true;
          
          if (this.modalElementRef?.nativeElement) {
            this.modalElementRef.nativeElement.setAttribute('aria-modal', 'true');
            this.modalElementRef.nativeElement.removeAttribute('aria-hidden');
            this.modalElementRef.nativeElement.removeAttribute('inert');
          }
        } catch (error) {
          console.error('Error showing modal:', error);
        }
      });
    } else if (!this.isInitialized) {
      this.ngAfterViewInit();
      if (this.modal) {
        this.show();
      }
    }
  }

  hide(): void {
    if (this.modal) {
      try {
        this.modal.hide();
        this.isModalVisible = false;
        
        if (this.modalElementRef?.nativeElement) {
          const modalElement = this.modalElementRef.nativeElement;
          modalElement.classList.remove('show');
          modalElement.style.display = 'none';
          modalElement.setAttribute('aria-hidden', 'true');
          modalElement.setAttribute('inert', 'true');
          document.body.classList.remove('modal-open');
          
          document.querySelector('.modal-backdrop')?.remove();
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
        }
      } catch (error) {
        console.error('Error hiding modal:', error);
      }
    }
    
    this.restoreFocus();
  }
  
  private restoreFocus(): void {
    if (this.lastFocusedElement) {
      requestAnimationFrame(() => {
        try {
          if (this.lastFocusedElement && document.body.contains(this.lastFocusedElement)) {
            this.lastFocusedElement.focus();
          } else {
            document.body.focus();
          }
        } catch (error) {
          console.error('Error restoring focus:', error);
        } finally {
          this.lastFocusedElement = null;
        }
      });
    }
  }

  onConfirm(): void {
    // No es necesario hacer blur manualmente, ya que el modal se cerrará
    this.confirm.emit();
    this.hide();
  }

  onCancel(): void {
    // No es necesario hacer blur manualmente, ya que el modal se cerrará
    // Limpiar referencias
    if (this.modal) {
      this.modal.dispose();
      this.modal = null;
    }
    this.lastFocusedElement = null;
  }

  ngOnDestroy(): void {
    // Clean up event listeners
    if (this.modalElementRef?.nativeElement) {
      const element = this.modalElementRef.nativeElement;
      element.removeEventListener('shown.bs.modal', this.onModalShown);
      element.removeEventListener('hidden.bs.modal', this.onModalHidden);
      
      // Remove backdrop click handler if it exists
      if (this.backdropClickHandler) {
        element.removeEventListener('click', this.backdropClickHandler);
        this.backdropClickHandler = null;
      }
    }
    
    // Clean up modal instance
    if (this.modal) {
      try {
        this.modal.hide();
        this.modal.dispose();
      } catch (e) {
        console.error('Error cleaning up modal:', e);
      }
      this.modal = null;
    }
    
    // Clean up backdrop
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
    
    // Reset body styles
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
}
