import { Component, OnInit, inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'
import { BackendService } from '../shared/backend.service';
import { Chart, ChartDataset, ChartOptions, ChartType, ChartConfiguration,  ChartData } from 'chart.js';
import { CategoryData } from '../shared/category-data';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts'; 
import moment from 'moment';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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
        text: 'Pie Chart: Total Value per Category Distribution'
      }
    }  
  };

 
  @ViewChild('dashboardContent', { static: false }) dashboardContent!: ElementRef;
  
  @ViewChild('lineChartCanvas') lineChartCanvas!: ElementRef;
  lineChart!: Chart;
  assetGrowthDates: string[] = [];
  assetGrowthValues: number[] = [];

  @ViewChild('polarChartCanvas') polarChartCanvas!: ElementRef;
  polarChart!: Chart;
  polarChartLabels: string[] = [];
  polarChartData: number[] = [];

  @ViewChild('bubbleChartCanvas') bubbleChartCanvas!: ElementRef;
  bubbleChart!: Chart;
  bubbleChartData: any[] = [];
  bubbleChartLabels: string[] = [];

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.getCategoryDistribution();
    this.getAssetGrowth();
    this.getAssetLocationCount();
    this.getAssetProfitability();
  }

  ngAfterViewInit(): void {
    this.createLineChart();
    this.createPolarChart();
  }

  downloadDashboard(): void {

    this.lineChart.update();
    this.polarChart.update();
    this.bubbleChart.update();
  
    setTimeout(() => {
      const content = this.dashboardContent.nativeElement;
      
      html2canvas(content, { scale: 4, useCORS: true  }).then(canvas => {
        const imgData = canvas.toDataURL('image/png'); 
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const imgWidth = 200; 
        const imgHeight = (canvas.height * imgWidth) / canvas.width; 
  
        pdf.addImage(imgData, 'PNG', 5, 5, imgWidth, imgHeight);
        pdf.save('dashboard.pdf');
      });
    }, 500); 
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

  
  getAssetLocationCount(): void {
    this.backendService.getAssetLocationCount().subscribe(
      (data: any[]) => {
        this.polarChartLabels = data.map(item => item.location);
        this.polarChartData = data.map(item => item.asset_count);
        this.createPolarChart();
      },
      (error) => {
        console.error('Error fetching asset location count', error);
      }
    );
  }

  getAssetProfitability(): void {
    this.backendService.getAssetProfitability().subscribe(
        (data: any[]) => {
          this.bubbleChartLabels = data.map(item => item.asset); 

          this.bubbleChartData = data.map((item, index) => ({
              x: index,  
              y: item.roi, 
              r: Math.sqrt(item.current_value) / 10 
          }));

          this.createBubbleChart();
      },
      (error) => console.error('Error fetching profitability data:', error)
  );
}


createBubbleChart(): void {
  const ctx = this.bubbleChartCanvas.nativeElement.getContext('2d');

  this.bubbleChart = new Chart(ctx, {
      type: 'bubble' as ChartType,
      data: {
          datasets: [{
              label: 'Profitability per Asset',
              data: this.bubbleChartData,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
              title: {
                  display: true,
                  text: 'Bubble Chart: Profitability Per Asset (ROI % vs Current Value)'
              },
              tooltip: {
                  callbacks: {
                      label: (context) => {
                          const dataPoint = context.raw as { x: number; y: number; r: number }; 

                          const assetName = this.bubbleChartLabels[context.dataIndex]; 
                          const roi = dataPoint.y; 
                          const value = Math.pow(dataPoint.r * 10, 2); 

                          return `${assetName}: ROI ${roi}% | Value: €${value.toFixed(2)}`;
                      }
                  }
              }
          },
          scales: {
              x: {
                  type: 'category',
                  labels: this.bubbleChartLabels, 
                  title: {
                      display: true,
                      text: 'Assets'
                  }
              },
              y: {
                  title: {
                      display: true,
                      text: 'ROI (%)'
                  }
              }
          }
      }
  });
}

  
  createPolarChart(): void {
    const ctx = this.polarChartCanvas.nativeElement.getContext('2d');
    
    if (this.polarChartLabels.length > 0 && this.polarChartData.length > 0) {
      this.polarChart = new Chart(ctx, {
        type: 'polarArea' as ChartType,  
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
              text: 'Polar Chart: Asset Count by Location',
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

            left: 20, 
            right: 200, 
            top: 20,
            bottom: 20,
          },
        },
        plugins: {
          legend: { display: true },
          title: {
            display: true,
            text: 'Line Chart: Total Asset Value Over Time'
        },
        },
        scales: {
          x: { title: { display: true, text: 'Date' } },
          y: { beginAtZero: true, title: { display: true, text: 'Total Value (€)' } },
        },
      },
    });
  }
}
