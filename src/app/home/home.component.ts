import { DataService } from './../service/data.service';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

import { ModalComponent } from '../components/modal/modal.component';
import { INode } from './../model/node.model';
import { IData } from '../model/data.model';


@Component({
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent implements OnInit {
  selectedGroup: string = 'author';
  dataFromServer!: IData[];
  groups: string[] = ['author', 'week', 'location']
  treeControl = new NestedTreeControl<INode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<INode>();
  public dialogRef!: MatDialogRef<ModalComponent>;

  constructor(private dialog: MatDialog, private service: DataService) {
  }

  ngOnInit(): void {
    this.getData()
  }

  // checks if there areoresent nodes and childrens
  hasChild = (_: number, node: INode) => !!node.children && node.children.length > 0;

  // opens the dialog with daat and save the data after the dialog is closed with save button
  openDialog(id: string) {
    let datadialog = this.dataFromServer.find((el: IData) => {
      return el.id.toString() === id;
    });

    this.dialogRef = this.dialog.open(ModalComponent, {
      width: '640px',
      data: datadialog,
      autoFocus: false
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataFromServer = this.dataFromServer.filter((obj: IData) => { return obj.id !== id });
        this.dataFromServer.push(result);
        this.setGroup(this.selectedGroup)
      }
    });
  }

  // set the dataSoure for the tree view
  setGroup(group: string): void {
    this.dataSource.data = this.setGroupTree(group);
  }

  // Getting the data from 'DB' and setting week instead of time,
  // once got the data, the method call set group to set Tree data
  private getData(): void {
    this.service.getDataFromDB().subscribe((res: any) => {
      res.forEach((element: any) => {
        element.time = this.calculateWeeks(element.time);
        element.week = element.time
        delete element.time
      });
      this.dataFromServer = res;
      this.setGroup(this.selectedGroup);
    })
  }

  // Converting the data for tree data to display it
  private setGroupTree(group: string): INode[] {
    let arrGroup = [];
    const keyName = group as keyof typeof this.dataFromServer[0]
    for (let i = 0; i < this.dataFromServer.length; i++) {
      if (arrGroup.length === 0 || (!this.existGroup(this.dataFromServer[i][keyName], arrGroup))) {
        let obj: INode | any = {
          name: this.dataFromServer[i][keyName],
          children: []
        }
        for (let j = 0; j < this.dataFromServer.length; j++) {
          if (this.dataFromServer[i][keyName] === this.dataFromServer[j][keyName])
            obj.children.push({ name: `Author - ${this.dataFromServer[j].author}`, id: this.dataFromServer[j].id });
        }
        arrGroup.push(obj);
      }
    }
    return arrGroup;
  }
  // Trasform the seconds in weeks with start Epoch 1970
  private calculateWeeks(seconds: string): string {
    let secondsNum = Number(seconds)
    let t = new Date(1970, 0, 1);
    t.setSeconds(secondsNum);

    let currentDate = new Date(t);
    let startDate = new Date(currentDate.getFullYear(), 0, 1);
    let days = Math.floor(((currentDate as any) - (startDate as any)) /
      (24 * 60 * 60 * 1000));

    let weekNumber = Math.ceil(days / 7);
    return weekNumber.toString();
  }

  //Check if group exists to avoid creating multiple groups with the same elements
  private existGroup(group: string, arrGroup: INode[]): boolean {
    let existInGroup = false;
    if (arrGroup.length > 0) {
      arrGroup.forEach(element => {
        if (element.name === group) {
          existInGroup = true;
        }
      });
    }
    return existInGroup;
  }
}
