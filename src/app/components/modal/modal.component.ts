import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { IData } from 'src/app/model/data.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  form!: FormGroup;
  data: IData;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {

    this.data = data;
  }

  ngOnInit() {
    this.form = this.fb.group({
      id: [this.data.id, []],
      location: [this.data.location, [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30)]],
      week: [this.data.week, []],
      author: [this.data.author, [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(500)]],
      text: [this.data.text, []]
    });
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }

}
