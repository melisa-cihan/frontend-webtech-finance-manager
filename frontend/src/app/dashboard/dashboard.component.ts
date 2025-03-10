import { Component, OnInit, inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'
import { BackendService } from '../shared/backend.service';
import { Chart, ChartDataset, ChartOptions, ChartType, ChartConfiguration,  ChartData } from 'chart.js';
import { CategoryData } from '../shared/category-data';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts'; 
import moment from 'moment';


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
  pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Total Value per Category Distribution'
      }
    }

    
  };
  
  @ViewChild('lineChartCanvas') lineChartCanvas!: ElementRef;
  lineChart!: Chart;
  assetGrowthDates: string[] = [];
  assetGrowthValues: number[] = [];

  // Properties for Polar Area Chart
  @ViewChild('polarChartCanvas') polarChartCanvas!: ElementRef;
  polarChart!: Chart;
  polarChartLabels: string[] = [];
  polarChartData: number[] = [];

  
  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.getCategoryDistribution();
    this.getAssetGrowth();
    this.getAssetLocationCount();
  }

  ngAfterViewInit(): void {
    this.createLineChart();
    this.createPolarChart();
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
        this.assetGrowthDates = data.map((item) => moment(item.purchase_date).format('YYYY-MM-DD'));
        this.assetGrowthValues = data.map((item) => item.total_value);
  
        
        if (this.lineChart) {
          this.lineChart.data.labels = this.assetGrowthDates;
          this.lineChart.data.datasets[0].data = this.assetGrowthValues;
          this.lineChart.update();
        }
      },
      (error) => console.error('Error fetching asset growth data:', error)
    );
  }

  //Fetching the asset location count
  getAssetLocationCount(): void {
    this.backendService.getAssetLocationCount().subscribe(
      (data: any[]) => {
        this.polarChartLabels = data.map(item => item.location);
        this.polarChartData = data.map(item => item.asset_count);
        // Ensure the chart is updated when data is fetched
        this.createPolarChart();
      },
      (error) => {
        console.error('Error fetching asset location count', error);
      }
    );
  }

  // Creating the Polar Area Chart
  createPolarChart(): void {
    const ctx = this.polarChartCanvas.nativeElement.getContext('2d');
    
    // Ensure chart is created only if data exists
    if (this.polarChartLabels.length > 0 && this.polarChartData.length > 0) {
      this.polarChart = new Chart(ctx, {
        type: 'polarArea' as ChartType,  // Cast to ChartType to avoid type issues
        data: {
          labels: this.polarChartLabels,
          datasets: [
            {
              label: 'Asset Count per Location',
              data: this.polarChartData,
              backgroundColor: ['#87CEFA', '#001eff', '#FFFF00', '#FF0000', '#FF1493', '#FF4500', '#ADFF2F' ],
            },
          ],
        },
        options: {
          responsive: true,
          layout:{
            padding:{
              bottom: 50,
            },
          },
          plugins: {
            legend: {
              position: 'bottom',
            },
            title: {
              display: true,
              text: 'Polar Chart Asset Count by Location',
            },
          },
        },
      });
    }
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
        layout:{
          padding:{
            top: 50,
          },
        },
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
        layout: {
          padding: {

            left: 20, // Increase this value to add more space on the left
            right: 200, // Adjust other paddings as needed
            top: 20,
            bottom: 20,
          },
        },
        plugins: {
          legend: { display: true },
        },
        scales: {
          x: { title: { display: true, text: 'Date' } },
          y: { beginAtZero: true, title: { display: true, text: 'Total Value (€)' } },
        },
      },
    });
  }
}
