import { MatInputModule } from '@angular/material/input';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent } from './modal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const mockedForm = {
  id: 'idTest',
  location: 'locationTest',
  week: 'weekTest',
  author: 'authorTest',
  text: 'textTest'
}

const mockDialogRef = {
  close: jasmine.createSpy('close')
};

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        BrowserAnimationsModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { isMainForm: true, amendContent: undefined }
        },
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.data = mockedForm;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the form value', () => {
    component.ngOnInit()

    expect(component.form.controls['id'].value).toEqual('idTest')
    expect(component.form.controls['location'].value).toEqual('locationTest')
    expect(component.form.controls['week'].value).toEqual('weekTest')
    expect(component.form.controls['author'].value).toEqual('authorTest')
    expect(component.form.controls['text'].value).toEqual('textTest')
  })

  it('should close dialog after close method was called', () => {
    component.close()

    expect(mockDialogRef.close).toHaveBeenCalled()
  })

  it('should close the modal after save method was called ', () => {
    component.save()

    expect(mockDialogRef.close).toHaveBeenCalled()
  })
});
