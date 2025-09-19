import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

/**
 * A dialog component for confirming actions.
 */
@Component({
  selector: 'app-confirm-dialog',
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatDialogModule,
    MatIcon,
    MatButtonModule
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  /**
   * @param data The data for the dialog, including the title and message.
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string, message: string }) { }
}
