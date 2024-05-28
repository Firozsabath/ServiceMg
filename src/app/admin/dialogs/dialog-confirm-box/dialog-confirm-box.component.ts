import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogModel } from 'src/app/models/ConfirmDialogModel';

@Component({
  selector: 'app-dialog-confirm-box',
  templateUrl: './dialog-confirm-box.component.html',
  styleUrls: ['./dialog-confirm-box.component.css']
})
export class DialogConfirmBoxComponent implements OnInit {
  title: string;
  message: string;
  constructor(public dialogRef:MatDialogRef<DialogConfirmBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data:ConfirmDialogModel) { 
      this.title = data.title;
      this.message = data.message;
    }

  ngOnInit(): void {
  }

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

}
