import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'
import { BackendService } from '../shared/backend.service';
import { Chart, ChartDataset, ChartOptions, ChartType } from 'chart.js';
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
export class DashboardComponent implements OnInit {
  categoryDistribution: CategoryData[] = [];
  pieChartLabels: string[] = [];
  pieChartData: number[] = [];
  pieChartType: ChartType = 'pie';  ;
  pieChartOptions: any = {
    responsive: true
  };

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.getCategoryDistribution();
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

  createChart(): void {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',  // Type of the chart
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
}
