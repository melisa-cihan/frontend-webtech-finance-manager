import { Component, OnInit, inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'
import { BackendService } from '../shared/backend.service';
import { Chart, ChartDataset, ChartOptions, ChartType, ChartConfiguration } from 'chart.js';
import { CategoryData } from '../shared/category-data';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts'; 


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  categoryDistribution: CategoryData[] = [];
  pieChartLabels: string[] = [];
  pieChartData: number[] = [];
  pieChartType: ChartType = 'pie';  ;
  pieChartOptions: any = {
    responsive: true
  };

  @ViewChild('lineChartCanvas') lineChartCanvas!: ElementRef;
  lineChart!: Chart;
  assetGrowthDates: string[] = [];
  assetGrowthValues: number[] = [];
  
  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.getCategoryDistribution();
    this.getAssetGrowth();
  }

  ngAfterViewInit(): void {
    this.createLineChart();
  }

  getCategoryDistribution(): void {
    this.backendService.getCategoryDistribution().subscribe(
      (data: CategoryData[]) => {
        this.categoryDistribution = data;
        this.pieChartLabels = data.map(item => item.category);
        this.pieChartData = data.map(item => item.total_value);
      },
      (error) => {
        console.error('Error fetching category distribution', error);
      }
    );
  }

  getAssetGrowth(): void {
    this.backendService.getAssetGrowth().subscribe(
      (data) => {
        this.assetGrowthDates = data.map((item) => item.purchase_date);
        this.assetGrowthValues = data.map((item) => item.total_value);
  
        // Once data is fetched, update the chart
        if (this.lineChart) {
          this.lineChart.data.labels = this.assetGrowthDates;
          this.lineChart.data.datasets[0].data = this.assetGrowthValues;
          this.lineChart.update();
        }
      },
      (error) => console.error('Error fetching asset growth data:', error)
    );
  }


  createChart(): void {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',  
      data: {
        labels: this.pieChartLabels,
        datasets: [
          {
            data: this.pieChartData,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }

  createLineChart(): void {
    const ctx = this.lineChartCanvas.nativeElement.getContext('2d');

    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.assetGrowthDates,
        datasets: [
          {
            label: 'Total Asset Value Over Time',
            data: this.assetGrowthValues,
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            fill: true,
            borderWidth: 2,
            pointRadius: 5,
            pointBackgroundColor: '#4CAF50',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
        },
        scales: {
          x: { title: { display: true, text: 'Date' } },
          y: { title: { display: true, text: 'Total Value ($)' } },
        },
      },
    });
  }
}
