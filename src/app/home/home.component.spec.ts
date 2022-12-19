import { DataService } from './../service/data.service';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { HomeComponent } from './home.component';
import { of } from 'rxjs';


const mockDialogRef = {
  close: jasmine.createSpy('close'),
  open: jasmine.createSpy('open')
};

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let httpTestingController: HttpTestingController;
  let dataService: DataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        MatDialogModule,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpClientTestingModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { isMainForm: true, amendContent: undefined }
        },
        {
          provide: DataService,
          useVaue: {
            getDataFromDB() {
              return [{
                "id": "1",
                "location": "San Francisco",
                "week": "1552657573",
                "author": "Happy User",
                "text": "Proper PDF conversion ensures that every element of your document remains just as you left it."
              }]
            }
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dataService = TestBed.get(DataService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should make request and set dataFromServer and set the first tree data', () => {
    const mockData = [{
      "id": "1",
      "location": "San Francisco",
      "week": "1552657573",
      "author": "Happy User",
      "text": "Proper PDF conversion ensures that every element of your document remains just as you left it."
    }]

    const mockTreeData = [
      {
        name: 'AUTHOR - Happy User', children: [
          { name: 'Author - Happy User', id: '1' }]
      }]

    component.ngOnInit()

    dataService.getDataFromDB().subscribe(res => {
      expect(res).toEqual(mockData)

      expect(component.dataFromServer).toEqual(mockData)
      expect(component.dataSource.data).toEqual(mockTreeData)
    })
  });
  it('should make request and set dataFromServer and set the first tree data', () => {
    spyOn(dataService, 'getDataFromDB').and.returnValue(of([]))


    component.ngOnInit()

    expect(component.dataFromServer).toEqual([])
    expect(component.dataSource.data).toEqual([])
  });

  it('should to define dialog when openDialog method is called', fakeAsync(() => {
    const mockData = [{
      "id": "1",
      "location": "San Francisco",
      "week": "1552657573",
      "author": "Happy User",
      "text": "Proper PDF conversion ensures that every element of your document remains just as you left it."
    }]

    component.ngOnInit()

    dataService.getDataFromDB().subscribe(res => {
      expect(res).toEqual(mockData)

      component.openDialog('1');

      tick()
      expect(component.dialogRef).toBeDefined()
    })
  }));
});

