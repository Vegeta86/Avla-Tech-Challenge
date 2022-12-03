import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { FamilyData } from '../models/FamilyData';
import { FamilyDataService } from '../services/family-data.service';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  familyOptions!: number[];
  metricsOptions: string[] = ["Total", "Promedio", "Máximo", "Mínimo"];
  yearsOptions!: string[];
  filteredData!: FamilyData[];
  familyData!: FamilyData[];
  dataFormGroup!: FormGroup;
  showData: boolean = false;


  constructor(private service: FamilyDataService) {
    this.dataFormGroup = new FormGroup({
      selectedFamily: new FormControl('', [Validators.required]),
      selectedMetric: new FormControl('', [Validators.required]),
      selectedDate: new FormControl('', [Validators.required])
    })

  }
  ngOnInit(): void {
    this.familyData = [];
    this.service.getData().subscribe(resp => {
      this.familyData = resp;
      this.getFamilyOptions();
      this.getYearsOptions();
    })
  }

  onChange(event: any) {
    this.filteredData = [];
  }
  getFamilyOptions() {
    this.familyOptions = [];
    for (let i = 0; i < this.familyData.length; i++) {
      const family = this.familyData[i].family;
      if (!this.familyOptions.includes(this.familyData[i].family)) {
        this.familyOptions.push(family);
      }
    }
    return this.familyOptions;
  }
  getYearsOptions() {
    this.yearsOptions = [];
    for (let i = 0; i < this.familyData.length; i++) {
      const year = this.familyData[i].date.substring(0, 4);
      if (!this.yearsOptions.includes(this.familyData[i].date.substring(0, 4))) {
        this.yearsOptions.push(year);
      }
    }
    return this.yearsOptions;
  }
  calculate() {
    if (this.dataFormGroup.controls['selectedFamily'].valid &&
      this.dataFormGroup.controls['selectedDate'].valid && this.dataFormGroup.controls['selectedMetric'].valid) {

      this.filteredData = this.familyData.filter(item => {
        return item.family === this.dataFormGroup.controls['selectedFamily'].value &&
          item.date.substring(0, 4) == this.dataFormGroup.controls['selectedDate'].value
      })
      this.filteredData = this.filteredData.sort((a, b) => {
        return +b.date - +a.date;
      });
      console.log(this.filteredData);

      switch (this.dataFormGroup.controls['selectedMetric'].value) {
        case "Total":
          this.calculateTotal(this.filteredData);
          break;
        case "Promedio":
          this.calculateAv(this.filteredData);
          break;
        case "Máximo":
          this.calculateMax(this.filteredData);
          break;
        case "Mínimo":
          this.calculateMin(this.filteredData);
          break;
      }
      this.showData = true;

    }

  }
  calculateTotal(data: FamilyData[]) {
    let totalMonth = 0;
    let months: string[] = []
    let filtered: FamilyData[] = []
    for (let i = 0; i < data.length; i++) {
      const element = data[i].date.substring(5, 7);
      if (i > 0 && data[i].date.substring(5, 7) === data[i - 1].date.substring(5, 7)) {
        totalMonth += data[i - 1].amount + data[i].amount;
        data[i - 1].amount = totalMonth;
      }
      if (!months.includes(data[i].date.substring(5, 7))) {
        months.push(element)
        filtered.push(data[i])
      }
      totalMonth = 0;
    }
    this.filteredData = filtered;
  }
  calculateAv(data: FamilyData[]) {
    let total = 0;
    let count = 1;
    let months: string[] = []
    let filtered: FamilyData[] = []

    for (let i = 0; i < data.length; i++) {
      if (i > 0 && data[i].date.substring(5, 7) === data[i - 1].date.substring(5, 7)) {
        total += data[i].amount + data[i - 1].amount;
        count++
        count += count;
        data[i - 1].amount = total;
      }
      if (count > 1) {
        data[i - 1].amount = data[i - 1].amount / count
      }
      if (!months.includes(data[i].date.substring(5, 7))) {
        months.push(data[i].date.substring(5, 7))
        filtered.push(data[i])
      }
      total = 0;
      count = 0;
    }
    this.filteredData = filtered;
  }
  calculateMax(data: FamilyData[]) {
    let months: string[] = []
    let filtered: FamilyData[] = []
    for (let i = 0; i < data.length; i++) {
      if (i > 0 && data[i - 1].date.substring(5, 7) === data[i].date.substring(5, 7)) {
        data.sort((a, b) => {
          return a.amount - b.amount;
        });
      }
      if (!months.includes(data[i].date.substring(5, 7))) {
        months.push(data[i].date.substring(5, 7))
        filtered.push(data[i])
      }
    }
    this.filteredData = filtered;
  }
  calculateMin(data: FamilyData[]) {
    let months: string[] = []
    let filtered: FamilyData[] = []
    for (let i = 0; i < data.length; i++) {
      if (i > 0 && data[i].date.substring(5, 7) === data[i - 1].date.substring(5, 7)) {
        data.sort((a, b) => {
          return b.amount - a.amount;
        });
      }
      if (!months.includes(data[i].date.substring(5, 7))) {
        months.push(data[i].date.substring(5, 7))
        filtered.push(data[i])
      }
    }
    this.filteredData = filtered;
  }
}